import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  User,
  Mail,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Student } from '@/types'
import { subjectEnrollmentService } from '@/services/subject-enrollment.service'
import { CardSkeleton } from '@/components/ui/skeleton'

interface StudentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student | null
}

interface StudentEnrollment {
  id: string
  subjectId: string
  enrolledAt: string
  subject?: {
    id: string
    subjectCode: string
    subjectName: string
    section: string
  }
}

export default function StudentDetailsModal({
  isOpen,
  onClose,
  student,
}: StudentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'enrollments' | 'attendance'>('profile')

  // Fetch student's enrollments
  const { data: enrollments = [], isLoading: loadingEnrollments } = useQuery({
    queryKey: ['student-enrollments', student?.id],
    queryFn: async () => {
      // Note: This endpoint may need to be implemented on the backend
      // For now, we'll show what data is available from the student object
      return [] as StudentEnrollment[]
    },
    enabled: isOpen && !!student && activeTab === 'enrollments',
  })

  // Get initials for avatar
  const initials = useMemo(() => {
    if (!student) return '??'
    return `${student.firstName?.[0] || ''}${student.lastName?.[0] || ''}`.toUpperCase()
  }, [student])

  // Get status badge color
  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'inactive':
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
      case 'graduated':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'transferred':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  if (!student) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-3xl bg-slate-800/95 backdrop-blur-xl rounded-2xl shadow-enterprise-2xl border border-slate-700/50 overflow-hidden max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-8 py-6 border-b border-blue-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Avatar with initials */}
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center"
                  >
                    <span className="text-2xl font-bold text-white">{initials}</span>
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {student.firstName} {student.lastName}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-blue-100 text-sm">{student.studentNumber}</span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(student.status)}`}
                      >
                        {student.status || 'Active'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mt-6">
                {[
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'enrollments', label: 'Enrollments', icon: BookOpen },
                  { id: 'attendance', label: 'Attendance', icon: Calendar },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id
                        ? 'bg-white/20 text-white'
                        : 'text-blue-100 hover:bg-white/10'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 thin-scrollbar">
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Contact Information */}
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-5">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Mail className="w-5 h-5 text-blue-400" />
                      Contact Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 uppercase tracking-wide">
                          Email
                        </label>
                        <p className="text-slate-200">{student.email || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 uppercase tracking-wide">
                          Section
                        </label>
                        <p className="text-slate-200">{student.section || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Guardian Information */}
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-5">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-400" />
                      Guardian Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 uppercase tracking-wide">
                          Guardian Name
                        </label>
                        <p className="text-slate-200">{student.guardianName || '-'}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 uppercase tracking-wide">
                          Guardian Email
                        </label>
                        <p className="text-slate-200">{student.guardianEmail || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Details */}
                  <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-5">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-amber-400" />
                      System Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 uppercase tracking-wide">
                          Student ID
                        </label>
                        <p className="text-slate-200 font-mono text-sm">{student.id}</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400 uppercase tracking-wide">
                          Status
                        </label>
                        <p className="text-slate-200">{student.status || 'Active'}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'enrollments' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {loadingEnrollments ? (
                    <div className="space-y-3">
                      <CardSkeleton />
                      <CardSkeleton />
                      <CardSkeleton />
                    </div>
                  ) : enrollments.length === 0 ? (
                    <div className="text-center py-12">
                      <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-slate-300">No Enrollments Found</h3>
                      <p className="text-sm text-slate-500 mt-2">
                        This student is not enrolled in any subjects yet.
                      </p>
                      <p className="text-xs text-amber-400 mt-4">
                        Note: Backend endpoint GET /students/:id/enrollments may need to be
                        implemented
                      </p>
                    </div>
                  ) : (
                    enrollments.map((enrollment) => (
                      <div
                        key={enrollment.id}
                        className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 hover:border-blue-500/30 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-purple-500/20 rounded-lg">
                              <BookOpen className="w-5 h-5 text-purple-400" />
                            </div>
                            <div>
                              <h4 className="font-medium text-white">
                                {enrollment.subject?.subjectName || 'Unknown Subject'}
                              </h4>
                              <p className="text-sm text-slate-400">
                                {enrollment.subject?.subjectCode} • Section{' '}
                                {enrollment.subject?.section}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-slate-500" />
                        </div>
                      </div>
                    ))
                  )}
                </motion.div>
              )}

              {activeTab === 'attendance' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-300">Attendance Summary</h3>
                    <p className="text-sm text-slate-500 mt-2">
                      Attendance tracking per student coming soon.
                    </p>
                    <p className="text-xs text-amber-400 mt-4">
                      Note: Backend endpoint GET /students/:id/attendance/summary needed
                    </p>
                  </div>

                  {/* Placeholder Statistics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Present', value: '-', icon: CheckCircle, color: 'emerald' },
                      { label: 'Absent', value: '-', icon: XCircle, color: 'red' },
                      { label: 'Late', value: '-', icon: Clock, color: 'amber' },
                      { label: 'Excused', value: '-', icon: AlertCircle, color: 'blue' },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-slate-900/50 rounded-xl border border-slate-700/50 p-4 text-center"
                      >
                        <stat.icon
                          className={`w-6 h-6 mx-auto mb-2 text-${stat.color}-400`}
                        />
                        <p className="text-2xl font-bold text-white">{stat.value}</p>
                        <p className="text-xs text-slate-400">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-slate-900/50 border-t border-slate-700/50 flex justify-end">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-white rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
