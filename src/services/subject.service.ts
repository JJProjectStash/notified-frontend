import apiClient from './api'
import { Subject, SubjectFormData } from '@/types'

export const subjectService = {
  async getAll(): Promise<Subject[]> {
    const response = await apiClient.get<any[]>('/subjects')
    // Map backend Mongo _id to frontend id for consistency
    return response.data.map((s: any) => ({ ...s, id: s.id ?? s._id }))
  },

  async getById(id: number | string): Promise<Subject> {
    const response = await apiClient.get<any>(`/subjects/${id}`)
    const s = response.data
    return { ...s, id: s.id ?? s._id }
  },

  async getByCode(code: string): Promise<Subject> {
    const response = await apiClient.get<any>(`/subjects/code/${code}`)
    const s = response.data
    return { ...s, id: s.id ?? s._id }
  },

  async getByYear(year: number): Promise<Subject[]> {
    const response = await apiClient.get<any[]>(`/subjects/year/${year}`)
    return response.data.map((s: any) => ({ ...s, id: s.id ?? s._id }))
  },

  async getEnrollments(id: string | number): Promise<unknown[]> {
    const response = await apiClient.get<unknown[]>(`/subjects/${id}/enrollments`)
    return response.data
  },

  async create(data: SubjectFormData): Promise<Subject> {
    const response = await apiClient.post<any>('/subjects', data)
    const s = response.data
    return { ...s, id: s.id ?? s._id }
  },

  async update(id: number | string, data: Partial<SubjectFormData>): Promise<Subject> {
    if (typeof id === 'undefined' || id === null) {
      throw new Error('subjectService.update called with undefined id')
    }
    const response = await apiClient.put<any>(`/subjects/${id}`, data)
    const s: any = response.data
    return { ...s, id: s.id ?? s._id }
  },

  async delete(id: number | string): Promise<void> {
    await apiClient.delete(`/subjects/${id}`)
  },

  async search(query: string): Promise<Subject[]> {
    const response = await apiClient.get<any[]>('/subjects/search', {
      params: { q: query },
    })
    return response.data.map((s: any) => ({ ...s, id: s.id ?? s._id }))
  },
}
