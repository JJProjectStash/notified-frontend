import apiClient from './api'
import { Record, DashboardStats } from '@/types'

export const recordService = {
  async getAll(): Promise<Record[]> {
    const response = await apiClient.get<Record[]>('/records')
    return response.data
  },

  async getById(id: number): Promise<Record> {
    const response = await apiClient.get<Record>(`/records/${id}`)
    return response.data
  },

  async create(studentId: number, recordType: string): Promise<Record> {
    const response = await apiClient.post<Record>('/records', {
      studentId,
      recordType,
    })
    return response.data
  },

  async getByDateRange(startDate: string, endDate: string): Promise<Record[]> {
    const response = await apiClient.get<Record[]>('/records/date-range', {
      params: { startDate, endDate },
    })
    return response.data
  },

  async getByStudent(studentId: number): Promise<Record[]> {
    const response = await apiClient.get<Record[]>(`/records/student/${studentId}`)
    return response.data
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>('/records/stats')
    return response.data
  },

  async search(query: string): Promise<Record[]> {
    const response = await apiClient.get<Record[]>('/records/search', {
      params: { q: query },
    })
    return response.data
  },
}
