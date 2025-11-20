/**
 * SubjectDetailsModal - Enterprise-grade Subject Management
 *
 * Features:
 * - Subject information display with schedule
 * - Student enrollment management
 * - Integrated attendance marking
 * - Bulk operations (Mark All)
 * - Individual student attendance with search
 * - Real-time status updates
 */

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  BookOpen,
  Users,
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  Search,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  UserPlus,
  UserMinus,
  Download,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/store/toastStore'
import { Subject, Student, AttendanceRecord } from '@/types'
import { SubjectEnhanced, EnrolledStudent } from '@/types/subject.types'
import { subjectEnrollmentService } from '@/services/subject-enrollment.service'
import { subjectAttendanceService } from '@/services/subject-attendance.service'
import { studentService } from '@/services/student.service'

interface SubjectDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  subject: Subject | null
}

type TabType = 'overview' | 'students' | 'attendance' | 'schedule'

export default function SubjectDetailsModal({
  isOpen,
  onClose,
  subject,
}: SubjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set())
  const { addToast } = useToast()
  const queryClient = useQueryClient()

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('overview')
      setSearchTerm('')
      setSelectedStudents(new Set())
      setSelectedDate(new Date().toISOString().split('T')[0])
    }
  }, [isOpen, subject])

  // Fetch enrolled students
  const {
    data: enrolledStudents = [],
    isLoading: loadingEnrolled,
    refetch: refetchEnrolled,
  } = useQuery({
    queryKey: ['subjects', subject?.id, 'students'],
    queryFn: () => subjectEnrollmentService.getEnrolledStudents(subject!.id),
    enabled: isOpen && !!subject,
  })

  // Fetch all students for enrollment
  const { data: allStudents = [], isLoading: loadingAllStudents } = useQuery({
    queryKey: ['students'],
    queryFn: studentService.getAll,
    enabled: isOpen && activeTab === 'students',
  })

  // Fetch attendance records for selected date
  const {
    data: attendanceRecords = [],
    isLoading: loadingAttendance,
    refetch: refetchAttendance,
  } = useQuery({
    queryKey: ['subjects', subject?.id, 'attendance', selectedDate],
    queryFn: () => subjectAttendanceService.getSubjectAttendanceByDate(subject!.id, selectedDate),
    enabled: isOpen && !!subject && activeTab === 'attendance',
  })

  // Enroll student mutation
  const enrollMutation = useMutation({
    mutationFn: (studentId: number) =>
      subjectEnrollmentService.enrollStudent({ subjectId: subject!.id, studentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', subject?.id, 'students'] })
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      addToast('Student enrolled successfully', 'success')
      refetchEnrolled()
    },
    onError: (error: any) => {
      addToast(error?.message || 'Failed to enroll student', 'error')
    },
  })

  // Unenroll student mutation
  const unenrollMutation = useMutation({
    mutationFn: (studentId: number) =>
      subjectEnrollmentService.unenrollStudent(subject!.id, studentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects', subject?.id, 'students'] })
      queryClient.invalidateQueries({ queryKey: ['subjects'] })
      addToast('Student unenrolled successfully', 'success')
      refetchEnrolled()
    },
    onError: (error: any) => {
      addToast(error?.message || 'Failed to unenroll student', 'error')
    },
  })

  // Mark attendance mutation
  const markAttendanceMutation = useMutation({
    mutationFn: (data: { studentId: number; status: 'present' | 'absent' | 'late' | 'excused' }) =>
      subjectAttendanceService.markSubjectAttendance({
        subjectId: subject!.id,
        studentId: data.studentId,
        date: selectedDate,
        status: data.status,
        timeSlot: 'arrival',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['subjects', subject?.id, 'attendance', selectedDate],
      })
      addToast('Attendance marked successfully', 'success')
      refetchAttendance()
    },
    onError: (error: any) => {
      addToast(error?.message || 'Failed to mark attendance', 'error')
    },
  })

  // Bulk mark attendance mutation
  const bulkMarkMutation = useMutation({
    mutationFn: (data: {
      studentIds: number[]
      status: 'present' | 'absent' | 'late' | 'excused'
    }) =>
      subjectAttendanceService.bulkMarkSubjectAttendance({
        subjectId: subject!.id,
        studentIds: data.studentIds,
        date: selectedDate,
        status: data.status,
        timeSlot: 'arrival',
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['subjects', subject?.id, 'attendance', selectedDate],
      })
      addToast(`Marked ${variables.studentIds.length} students as ${variables.status}`, 'success')
      setSelectedStudents(new Set())
      refetchAttendance()
    },
    onError: (error: any) => {
      addToast(error?.message || 'Failed to mark attendance', 'error')
    },
  })

  // Available students (not enrolled)
  const availableStudents = useMemo(() => {
    const enrolledIds = new Set(enrolledStudents.map((e) => e.studentId))
    return allStudents.filter((s) => !enrolledIds.has(s.id))
  }, [allStudents, enrolledStudents])

  // Filtered enrolled students
  const filteredEnrolledStudents = useMemo(() => {
    if (!searchTerm) return enrolledStudents
    const term = searchTerm.toLowerCase()
    return enrolledStudents.filter((e) => {
      const student = e.student
      if (!student) return false
      return (
        student.studentNumber.toLowerCase().includes(term) ||
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.email.toLowerCase().includes(term)
      )
    })
  }, [enrolledStudents, searchTerm])

  // Attendance status map
  const attendanceStatusMap = useMemo(() => {
    const map = new Map<number, AttendanceRecord>()
    attendanceRecords.forEach((record) => {
      map.set(record.studentId, record)
    })
    return map
  }, [attendanceRecords])

  // Handle mark all
  const handleMarkAll = (status: 'present' | 'absent' | 'late' | 'excused') => {
    const studentIds = filteredEnrolledStudents.map((e) => e.studentId)
    if (studentIds.length === 0) {
      addToast('No students to mark', 'warning')
      return
    }
    bulkMarkMutation.mutate({ studentIds, status })
  }

  // Handle mark selected
  const handleMarkSelected = (status: 'present' | 'absent' | 'late' | 'excused') => {
    if (selectedStudents.size === 0) {
      addToast('No students selected', 'warning')
      return
    }
    bulkMarkMutation.mutate({ studentIds: Array.from(selectedStudents), status })
  }

  // Toggle student selection
  const toggleStudentSelection = (studentId: number) => {
    const newSelection = new Set(selectedStudents)
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId)
    } else {
      newSelection.add(studentId)
    }
    setSelectedStudents(newSelection)
  }

  // Select all/none
  const toggleSelectAll = () => {
    if (selectedStudents.size === filteredEnrolledStudents.length) {
      setSelectedStudents(new Set())
    } else {
      setSelectedStudents(new Set(filteredEnrolledStudents.map((e) => e.studentId)))
    }
  }

  if (!subject) return null

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-slate-800/95 backdrop-blur-xl rounded-3xl shadow-enterprise-2xl border border-slate-700/50 w-full max-w-6xl max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 text-white p-6 rounded-t-3xl shadow-lg border-b border-purple-500/30 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                      className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30"
                    >
                      <BookOpen className="w-7 h-7" />
                    </motion.div>
                    <div>
                      <h2 className="text-2xl font-bold">{subject.subjectCode}</h2>
                      <p className="text-purple-100 text-sm mt-1">{subject.subjectName}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-xs">
                          <Users className="w-3 h-3" />
                          {enrolledStudents.length} students
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-lg text-xs">
                          Year {subject.yearLevel} - {subject.section}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mt-6">
                  {tabs.map((tab) => {
                    const Icon = tab.icon
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                          activeTab === tab.id
                            ? 'bg-white/30 text-white font-semibold'
                            : 'bg-white/10 text-purple-100 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                          <BookOpen className="w-5 h-5 text-purple-400" />
                          Subject Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm text-slate-500">Subject Code</label>
                            <p className="text-slate-200 font-medium">{subject.subjectCode}</p>
                          </div>
                          <div>
                            <label className="text-sm text-slate-500">Subject Name</label>
                            <p className="text-slate-200 font-medium">{subject.subjectName}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm text-slate-500">Year Level</label>
                              <p className="text-slate-200 font-medium">Year {subject.yearLevel}</p>
                            </div>
                            <div>
                              <label className="text-sm text-slate-500">Section</label>
                              <p className="text-slate-200 font-medium">{subject.section}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-400" />
                          Enrollment Statistics
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Total Students</span>
                            <span className="text-2xl font-bold text-blue-400">
                              {enrolledStudents.length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Today's Attendance</span>
                            <span className="text-2xl font-bold text-emerald-400">
                              {attendanceRecords.filter((r) => r.status === 'present').length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400">Attendance Rate</span>
                            <span className="text-2xl font-bold text-purple-400">
                              {enrolledStudents.length > 0
                                ? Math.round(
                                    (attendanceRecords.filter((r) => r.status === 'present')
                                      .length /
                                      enrolledStudents.length) *
                                      100
                                  )
                                : 0}
                              %
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Search and Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <Input
                          type="text"
                          placeholder="Search students..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 h-12 border-slate-600 bg-slate-900/50 text-slate-100"
                        />
                      </div>
                    </div>

                    {/* Enrolled Students List */}
                    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
                      <div className="p-4 bg-slate-800/50 border-b border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                          <Users className="w-5 h-5 text-blue-400" />
                          Enrolled Students ({filteredEnrolledStudents.length})
                        </h3>
                      </div>
                      <div className="divide-y divide-slate-700/30 max-h-96 overflow-y-auto">
                        {loadingEnrolled ? (
                          <div className="p-8 text-center text-slate-400">Loading students...</div>
                        ) : filteredEnrolledStudents.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            {searchTerm ? 'No students found' : 'No students enrolled yet'}
                          </div>
                        ) : (
                          filteredEnrolledStudents.map((enrolled) => {
                            const student = enrolled.student
                            if (!student) return null
                            return (
                              <div
                                key={enrolled.id}
                                className="p-4 hover:bg-slate-800/60 transition-colors flex items-center justify-between"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                    {student.firstName[0]}
                                    {student.lastName[0]}
                                  </div>
                                  <div>
                                    <p className="text-slate-200 font-medium">
                                      {student.firstName} {student.lastName}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                      {student.studentNumber}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => unenrollMutation.mutate(student.id)}
                                  disabled={unenrollMutation.isPending}
                                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                                >
                                  <UserMinus className="w-4 h-4 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    {/* Available Students */}
                    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
                      <div className="p-4 bg-slate-800/50 border-b border-slate-700/50">
                        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                          <UserPlus className="w-5 h-5 text-emerald-400" />
                          Available Students ({availableStudents.length})
                        </h3>
                      </div>
                      <div className="divide-y divide-slate-700/30 max-h-96 overflow-y-auto">
                        {loadingAllStudents ? (
                          <div className="p-8 text-center text-slate-400">Loading students...</div>
                        ) : availableStudents.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            All students are enrolled
                          </div>
                        ) : (
                          availableStudents.map((student) => (
                            <div
                              key={student.id}
                              className="p-4 hover:bg-slate-800/60 transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-semibold">
                                  {student.firstName[0]}
                                  {student.lastName[0]}
                                </div>
                                <div>
                                  <p className="text-slate-200 font-medium">
                                    {student.firstName} {student.lastName}
                                  </p>
                                  <p className="text-sm text-slate-500">{student.studentNumber}</p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => enrollMutation.mutate(student.id)}
                                disabled={enrollMutation.isPending}
                                className="bg-emerald-600 hover:bg-emerald-700"
                              >
                                <Plus className="w-4 h-4 mr-1" />
                                Enroll
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Attendance Tab */}
                {activeTab === 'attendance' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {/* Date Selector and Bulk Actions */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1">
                        <label className="block text-sm text-slate-400 mb-2">Select Date</label>
                        <Input
                          type="date"
                          value={selectedDate}
                          onChange={(e) => setSelectedDate(e.target.value)}
                          max={new Date().toISOString().split('T')[0]}
                          className="h-12 border-slate-600 bg-slate-900/50 text-slate-100"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm text-slate-400 mb-2">Search Students</label>
                        <div className="relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                          <Input
                            type="text"
                            placeholder="Search by name or number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 h-12 border-slate-600 bg-slate-900/50 text-slate-100"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mark All Toolbar */}
                    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 border border-slate-700/50">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-slate-300">Mark All:</span>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAll('present')}
                          disabled={bulkMarkMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Present
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAll('absent')}
                          disabled={bulkMarkMutation.isPending}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Absent
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAll('late')}
                          disabled={bulkMarkMutation.isPending}
                          className="bg-amber-600 hover:bg-amber-700"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Late
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAll('excused')}
                          disabled={bulkMarkMutation.isPending}
                          className="bg-purple-600 hover:bg-purple-700"
                        >
                          <AlertCircle className="w-4 h-4 mr-1" />
                          Excused
                        </Button>
                        {selectedStudents.size > 0 && (
                          <>
                            <div className="w-px h-6 bg-slate-600" />
                            <span className="text-sm text-slate-400">
                              {selectedStudents.size} selected
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={toggleSelectAll}
                              className="border-slate-600"
                            >
                              {selectedStudents.size === filteredEnrolledStudents.length
                                ? 'Deselect All'
                                : 'Select All'}
                            </Button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Students List with Attendance */}
                    <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
                      <div className="divide-y divide-slate-700/30 max-h-[500px] overflow-y-auto">
                        {loadingEnrolled || loadingAttendance ? (
                          <div className="p-8 text-center text-slate-400">Loading...</div>
                        ) : filteredEnrolledStudents.length === 0 ? (
                          <div className="p-8 text-center text-slate-400">
                            {searchTerm ? 'No students found' : 'No students enrolled'}
                          </div>
                        ) : (
                          filteredEnrolledStudents.map((enrolled) => {
                            const student = enrolled.student
                            if (!student) return null
                            const attendanceRecord = attendanceStatusMap.get(student.id)
                            const status = attendanceRecord?.status

                            return (
                              <div
                                key={enrolled.id}
                                className="p-4 hover:bg-slate-800/60 transition-colors"
                              >
                                <div className="flex items-center justify-between gap-4">
                                  <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <input
                                      type="checkbox"
                                      checked={selectedStudents.has(student.id)}
                                      onChange={() => toggleStudentSelection(student.id)}
                                      className="w-5 h-5 rounded border-slate-600 text-purple-600 focus:ring-2 focus:ring-purple-500"
                                    />
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
                                      {student.firstName[0]}
                                      {student.lastName[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-slate-200 font-medium truncate">
                                        {student.firstName} {student.lastName}
                                      </p>
                                      <p className="text-sm text-slate-500">
                                        {student.studentNumber}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {status ? (
                                      <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          status === 'present'
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : status === 'absent'
                                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                              : status === 'late'
                                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                        }`}
                                      >
                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                      </span>
                                    ) : (
                                      <>
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            markAttendanceMutation.mutate({
                                              studentId: student.id,
                                              status: 'present',
                                            })
                                          }
                                          disabled={markAttendanceMutation.isPending}
                                          className="bg-emerald-600 hover:bg-emerald-700 h-8 px-3"
                                        >
                                          <CheckCircle className="w-3 h-3 mr-1" />
                                          Present
                                        </Button>
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            markAttendanceMutation.mutate({
                                              studentId: student.id,
                                              status: 'absent',
                                            })
                                          }
                                          disabled={markAttendanceMutation.isPending}
                                          className="bg-red-600 hover:bg-red-700 h-8 px-3"
                                        >
                                          <XCircle className="w-3 h-3 mr-1" />
                                          Absent
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>
                    </div>

                    {/* Attendance Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                          <span className="text-sm text-emerald-400 font-medium">Present</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-400">
                          {attendanceRecords.filter((r) => r.status === 'present').length}
                        </p>
                      </div>
                      <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <XCircle className="w-5 h-5 text-red-400" />
                          <span className="text-sm text-red-400 font-medium">Absent</span>
                        </div>
                        <p className="text-2xl font-bold text-red-400">
                          {attendanceRecords.filter((r) => r.status === 'absent').length}
                        </p>
                      </div>
                      <div className="bg-amber-500/10 rounded-xl p-4 border border-amber-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-amber-400" />
                          <span className="text-sm text-amber-400 font-medium">Late</span>
                        </div>
                        <p className="text-2xl font-bold text-amber-400">
                          {attendanceRecords.filter((r) => r.status === 'late').length}
                        </p>
                      </div>
                      <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertCircle className="w-5 h-5 text-purple-400" />
                          <span className="text-sm text-purple-400 font-medium">Excused</span>
                        </div>
                        <p className="text-2xl font-bold text-purple-400">
                          {attendanceRecords.filter((r) => r.status === 'excused').length}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Schedule Tab */}
                {activeTab === 'schedule' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        Class Schedule
                      </h3>
                      <div className="text-center py-8 text-slate-400">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                        <p className="font-medium">Schedule management coming soon</p>
                        <p className="text-sm mt-2">
                          Configure class days, times, and room assignments
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex-shrink-0 px-6 py-4 bg-slate-900/50 border-t border-slate-700/50 rounded-b-3xl">
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={onClose} className="border-slate-600">
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
