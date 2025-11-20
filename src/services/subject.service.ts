import apiClient from './api'
import { Subject, SubjectFormData } from '@/types'
import { SubjectSchedule } from '@/types/subject.types'

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    const response = await apiClient.get<Subject[]>('/subjects')
    return response.data
  },

  async getById(id: string | number): Promise<Subject> {
    const response = await apiClient.get<Subject>(`/subjects/${id}`)
    return response.data
  },

  async create(data: SubjectFormData): Promise<Subject> {
    const response = await apiClient.post<Subject>('/subjects', data)
    return response.data
  },

  async update(id: string | number, data: Partial<SubjectFormData>): Promise<Subject> {
    const response = await apiClient.put<Subject>(`/subjects/${id}`, data)
    return response.data
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/subjects/${id}`)
  },

  async updateSchedule(id: string | number, schedule: SubjectSchedule | null): Promise<Subject> {
    const response = await apiClient.put<Subject>(`/subjects/${id}`, { schedule })
    return response.data
  },

  async getSchedule(id: string | number): Promise<SubjectSchedule | null> {
    const subject = await this.getById(id)
    return (subject as any).schedule || null
  },
}
