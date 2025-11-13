export interface User {
  id: number
  name: string
  email: string
  role: 'superadmin' | 'admin' | 'staff'
}

export interface AuthResponse {
  user: User
  accessToken: string
  token?: string // Legacy support
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface Student {
  id: number
  studentNumber: string
  firstName: string
  lastName: string
  email: string
  section?: string
  guardianName?: string
  guardianEmail?: string
  createdAt: string
  updatedAt?: string
}

export interface StudentFormData {
  studentNumber: string
  firstName: string
  lastName: string
  email: string
  section?: string
  guardianName?: string
  guardianEmail?: string
}

export interface Subject {
  id: number
  subjectCode: string
  subjectName: string
  section: string
  yearLevel: number
  createdAt: string
  updatedAt?: string
}

export interface SubjectFormData {
  subjectCode: string
  subjectName: string
  section: string
  yearLevel: number
}

export interface Record {
  id: number
  studentId: number
  studentNumber: string
  firstName: string
  lastName: string
  email: string
  recordType: string
  createdAt: string
}

export interface DashboardStats {
  totalStudents: number
  totalSubjects: number
  totalRecords: number
  todayRecords: number
}

export interface ApiError {
  message: string
  status: number
  errors?: { [key: string]: string[] }
}
