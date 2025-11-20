/**
 * Subject Service
 *
 * Handles subject-related API calls
 */

import apiClient from './api'
import { Subject, ApiResponse } from '@/types'
import { SubjectEnhanced, SubjectScheduleSlot, SubjectSchedule } from '@/types/subject.types'

export const subjectService = {
  /**
   * Get all subjects
   */
  async getAll(): Promise<Subject[]> {
    const response = await apiClient.get<ApiResponse<Subject[]>>('/subjects')
    return response.data.data || response.data
  },

  /**
   * Get subject by ID
   */
  async getById(id: string | number): Promise<SubjectEnhanced> {
    const response = await apiClient.get<ApiResponse<SubjectEnhanced>>(`/subjects/${id}`)
    return response.data.data || response.data
  },

  /**
   * Create new subject
   */
  async create(data: Partial<Subject>): Promise<Subject> {
    const response = await apiClient.post<ApiResponse<Subject>>('/subjects', data)
    return response.data.data || response.data
  },

  /**
   * Update subject
   */
  async update(id: string | number, data: Partial<Subject>): Promise<Subject> {
    const response = await apiClient.put<ApiResponse<Subject>>(`/subjects/${id}`, data)
    return response.data.data || response.data
  },

  /**
   * Update subject schedule (legacy single schedule)
   */
  async updateSchedule(id: string | number, schedule: SubjectSchedule | null): Promise<Subject> {
    const response = await apiClient.put<ApiResponse<Subject>>(`/subjects/${id}`, { schedule })
    return response.data.data || response.data
  },

  /**
   * Update subject schedules (multiple schedules support)
   */
  async updateSchedules(
    id: string | number,
    schedules: SubjectScheduleSlot[]
  ): Promise<SubjectEnhanced> {
    const response = await apiClient.put<ApiResponse<SubjectEnhanced>>(
      `/subjects/${id}/schedules`,
      {
        schedules,
      }
    )
    return response.data.data || response.data
  },

  /**
   * Delete subject
   */
  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/subjects/${id}`)
  },

  /**
   * Search subjects
   */
  async search(query: string): Promise<Subject[]> {
    const response = await apiClient.get<ApiResponse<Subject[]>>('/subjects/search', {
      params: { q: query },
    })
    return response.data.data || response.data
  },
}
