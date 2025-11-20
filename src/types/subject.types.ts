// ============================================================================
// SUBJECT MANAGEMENT TYPES (ENHANCED)
// ============================================================================

/**
 * Subject schedule configuration
 */
export interface SubjectSchedule {
  days: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday')[]
  startTime: string // HH:mm format (e.g., "09:00")
  endTime: string // HH:mm format (e.g., "10:30")
  room?: string
  building?: string
}

/**
 * Enrolled student in a subject
 */
export interface EnrolledStudent {
  readonly id: number
  studentId: number
  subjectId: string | number
  enrolledAt: string
  student?: {
    id: number
    studentNumber: string
    firstName: string
    lastName: string
    email: string
    section?: string
    guardianName?: string
    guardianEmail?: string
  }
}

/**
 * Subject entity with enhanced fields
 */
export interface SubjectEnhanced {
  readonly id: string | number
  subjectCode: string
  subjectName: string
  section: string
  yearLevel: number
  schedule?: SubjectSchedule
  enrolledStudents?: EnrolledStudent[]
  enrollmentCount?: number
  createdAt: string
  updatedAt?: string
}

/**
 * Form data for subject enrollment
 */
export interface EnrollmentFormData {
  subjectId: string | number
  studentId: number
}

/**
 * Bulk enrollment data
 */
export interface BulkEnrollmentData {
  subjectId: string | number
  studentIds: number[]
}

/**
 * Subject attendance data
 */
export interface SubjectAttendanceData {
  subjectId: string | number
  studentId: number
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  timeSlot?: 'arrival' | 'departure'
  notes?: string
}

/**
 * Bulk subject attendance data
 */
export interface BulkSubjectAttendanceData {
  subjectId: string | number
  studentIds: number[]
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  timeSlot?: 'arrival' | 'departure'
  notes?: string
}

/**
 * Subject attendance summary
 */
export interface SubjectAttendanceSummaryEnhanced {
  subjectId: string | number
  subjectCode: string
  subjectName: string
  section: string
  date: string
  totalStudents: number
  present: number
  absent: number
  late: number
  excused: number
  attendanceRate: number
  records: {
    studentId: number
    studentNumber: string
    studentName: string
    status: 'present' | 'absent' | 'late' | 'excused'
    markedAt?: string
  }[]
}

/**
 * Student subject attendance history
 */
export interface StudentSubjectAttendance {
  studentId: number
  studentNumber: string
  studentName: string
  subjectId: string | number
  subjectCode: string
  subjectName: string
  totalSessions: number
  presentCount: number
  absentCount: number
  lateCount: number
  excusedCount: number
  attendanceRate: number
  recentRecords: {
    date: string
    status: 'present' | 'absent' | 'late' | 'excused'
    notes?: string
  }[]
}
