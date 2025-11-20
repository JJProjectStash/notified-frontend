/**
 * Subject Attendance Service
 *
 * Handles attendance marking specific to subjects
 */

import apiClient from './api'
import {
  SubjectAttendanceData,
  BulkSubjectAttendanceData,
  SubjectAttendanceSummaryEnhanced,
  StudentSubjectAttendance,
} from '@/types/subject.types'
import { AttendanceRecord, ApiResponse } from '@/types'

export const subjectAttendanceService = {
  /**
   * Mark attendance for a student in a subject
   */
  async markSubjectAttendance(data: SubjectAttendanceData): Promise<AttendanceRecord> {
    const response = await apiClient.post<ApiResponse<AttendanceRecord>>(
      '/attendance/subject/mark',
      data
    )
    return response.data.data || response.data
  },

  /**
   * Bulk mark attendance for multiple students
   */
  async bulkMarkSubjectAttendance(data: BulkSubjectAttendanceData): Promise<AttendanceRecord[]> {
    const response = await apiClient.post<ApiResponse<AttendanceRecord[]>>(
      '/attendance/subject/bulk-mark',
      data
    )
    return response.data.data || response.data
  },

  /**
   * Get attendance records for a subject on a specific date
   */
  async getSubjectAttendanceByDate(
    subjectId: string | number,
    date: string
  ): Promise<AttendanceRecord[]> {
    const response = await apiClient.get<ApiResponse<AttendanceRecord[]>>(
      `/attendance/subject/${subjectId}/date/${date}`
    )
    return response.data.data || response.data
  },

  /**
   * Get attendance summary for a subject on a specific date
   */
  async getSubjectAttendanceSummary(
    subjectId: string | number,
    date: string
  ): Promise<SubjectAttendanceSummaryEnhanced> {
    const response = await apiClient.get<ApiResponse<SubjectAttendanceSummaryEnhanced>>(
      `/attendance/subject/${subjectId}/summary/${date}`
    )
    return response.data.data || response.data
  },

  /**
   * Get a student's attendance history for a specific subject
   */
  async getStudentSubjectAttendance(
    studentId: number,
    subjectId: string | number
  ): Promise<StudentSubjectAttendance> {
    const response = await apiClient.get<ApiResponse<StudentSubjectAttendance>>(
      `/attendance/subject/${subjectId}/student/${studentId}`
    )
    return response.data.data || response.data
  },

  /**
   * Mark all students as present
   */
  async markAllPresent(
    subjectId: string | number,
    date: string,
    studentIds: number[]
  ): Promise<AttendanceRecord[]> {
    return this.bulkMarkSubjectAttendance({
      subjectId,
      studentIds,
      date,
      status: 'present',
      timeSlot: 'arrival',
    })
  },

  /**
   * Mark all students as absent
   */
  async markAllAbsent(
    subjectId: string | number,
    date: string,
    studentIds: number[]
  ): Promise<AttendanceRecord[]> {
    return this.bulkMarkSubjectAttendance({
      subjectId,
      studentIds,
      date,
      status: 'absent',
    })
  },

  /**
   * Mark all students as late
   */
  async markAllLate(
    subjectId: string | number,
    date: string,
    studentIds: number[]
  ): Promise<AttendanceRecord[]> {
    return this.bulkMarkSubjectAttendance({
      subjectId,
      studentIds,
      date,
      status: 'late',
      timeSlot: 'arrival',
    })
  },

  /**
   * Mark all students as excused
   */
  async markAllExcused(
    subjectId: string | number,
    date: string,
    studentIds: number[]
  ): Promise<AttendanceRecord[]> {
    return this.bulkMarkSubjectAttendance({
      subjectId,
      studentIds,
      date,
      status: 'excused',
    })
  },
}
