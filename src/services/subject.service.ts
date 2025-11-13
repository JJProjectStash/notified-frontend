import apiClient from './api'
import { Subject, SubjectFormData } from '@/types'

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    const response = await apiClient.get<Subject[]>('/subjects')
    return response.data
  },

  async getById(id: number): Promise<Subject> {
    const response = await apiClient.get<Subject>(`/subjects/${id}`)
    return response.data
  },

  async create(data: SubjectFormData): Promise<Subject> {
    const response = await apiClient.post<Subject>('/subjects', data)
    return response.data
  },

  async update(id: number, data: Partial<SubjectFormData>): Promise<Subject> {
    const response = await apiClient.put<Subject>(`/subjects/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/subjects/${id}`)
  },

  async search(query: string): Promise<Subject[]> {
    const response = await apiClient.get<Subject[]>('/subjects/search', {
      params: { q: query },
    })
    return response.data
  },

  async getStudents(id: number): Promise<number[]> {
    const response = await apiClient.get<number[]>(`/subjects/${id}/students`)
    return response.data
  },

  async addStudent(subjectId: number, studentId: number): Promise<void> {
    await apiClient.post(`/subjects/${subjectId}/students/${studentId}`)
  },

  async removeStudent(subjectId: number, studentId: number): Promise<void> {
    await apiClient.delete(`/subjects/${subjectId}/students/${studentId}`)
  },
}
