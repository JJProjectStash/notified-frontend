/**
 * Subject Enrollment Service
 *
 * Handles student enrollment/unenrollment for subjects
 */

import apiClient from './api'
import { EnrolledStudent, EnrollmentFormData, BulkEnrollmentData } from '@/types/subject.types'
import { ApiResponse } from '@/types'

export const subjectEnrollmentService = {
  /**
   * Enroll a student in a subject
   */
  async enrollStudent(data: EnrollmentFormData): Promise<EnrolledStudent> {
    const response = await apiClient.post<ApiResponse<EnrolledStudent>>(
      `/subjects/${data.subjectId}/enroll`,
      { studentId: data.studentId }
    )
    return response.data.data || response.data
  },

  /**
   * Unenroll a student from a subject
   */
  async unenrollStudent(subjectId: string | number, studentId: number): Promise<void> {
    await apiClient.delete(`/subjects/${subjectId}/enroll/${studentId}`)
  },

  /**
   * Get all enrolled students for a subject
   */
  async getEnrolledStudents(subjectId: string | number): Promise<EnrolledStudent[]> {
    const response = await apiClient.get<ApiResponse<EnrolledStudent[]>>(
      `/subjects/${subjectId}/students`
    )
    return response.data.data || response.data
  },

  /**
   * Bulk enroll multiple students
   */
  async bulkEnrollStudents(data: BulkEnrollmentData): Promise<EnrolledStudent[]> {
    const response = await apiClient.post<ApiResponse<EnrolledStudent[]>>(
      `/subjects/${data.subjectId}/students/bulk`,
      { studentIds: data.studentIds }
    )
    return response.data.data || response.data
  },

  /**
   * Enroll all available students in a subject
   */
  async enrollAllStudents(
    subjectId: string | number,
    studentIds: number[]
  ): Promise<EnrolledStudent[]> {
    return this.bulkEnrollStudents({ subjectId, studentIds })
  },

  /**
   * Check if a student is enrolled in a subject
   */
  async isStudentEnrolled(subjectId: string | number, studentId: number): Promise<boolean> {
    try {
      const students = await this.getEnrolledStudents(subjectId)
      return students.some((s) => s.studentId === studentId)
    } catch (error) {
      console.error('[EnrollmentService] Error checking enrollment:', error)
      return false
    }
  },

  /**
   * Get enrollment count for a subject
   */
  async getEnrollmentCount(subjectId: string | number): Promise<number> {
    try {
      const students = await this.getEnrolledStudents(subjectId)
      return students.length
    } catch (error) {
      console.error('[EnrollmentService] Error getting enrollment count:', error)
      return 0
    }
  },
}
