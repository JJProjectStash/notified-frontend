import apiClient from './api'

interface Attendance {
  id: number
  studentId: number
  subjectId: string | number
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
  createdAt: string
  updatedAt: string
}

interface AttendanceFormData {
  studentId: number
  subjectId: string | number
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  notes?: string
}

interface AttendanceSummary {
  totalDays: number
  present: number
  absent: number
  late: number
  excused: number
  attendanceRate: number
}

interface TodayAttendanceStats {
  present: number
  absent: number
  late: number
  excused: number
  unmarked: number
  total: number
  attendanceRate: number
}

export const attendanceService = {
  async getAll(): Promise<Attendance[]> {
    const response = await apiClient.get<Attendance[]>('/attendance')
    return response.data
  },

  async getToday(): Promise<Attendance[]> {
    const response = await apiClient.get<Attendance[]>('/attendance/today')
    return response.data
  },

  async getSummary(): Promise<AttendanceSummary> {
    const response = await apiClient.get<AttendanceSummary>('/attendance/summary')
    return response.data
  },

  /**
   * Get today's attendance breakdown stats
   * Calculates present/absent/late/excused counts from today's records
   */
  async getTodayStats(): Promise<TodayAttendanceStats> {
    try {
      const todayRecords = await this.getToday()

      const stats = {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        unmarked: 0,
        total: todayRecords.length,
        attendanceRate: 0,
      }

      todayRecords.forEach((record) => {
        switch (record.status) {
          case 'present':
            stats.present++
            break
          case 'absent':
            stats.absent++
            break
          case 'late':
            stats.late++
            break
          case 'excused':
            stats.excused++
            break
        }
      })

      // Calculate attendance rate (present + late + excused = attended)
      const attended = stats.present + stats.late + stats.excused
      stats.attendanceRate = stats.total > 0 ? Math.round((attended / stats.total) * 100) : 0

      return stats
    } catch (error) {
      // Return default stats on error
      return {
        present: 0,
        absent: 0,
        late: 0,
        excused: 0,
        unmarked: 0,
        total: 0,
        attendanceRate: 0,
      }
    }
  },

  async getById(id: number): Promise<Attendance> {
    const response = await apiClient.get<Attendance>(`/attendance/${id}`)
    return response.data
  },

  async getByStudent(studentId: number): Promise<Attendance[]> {
    const response = await apiClient.get<Attendance[]>(`/attendance/student/${studentId}`)
    return response.data
  },

  async getBySubject(subjectId: string | number): Promise<Attendance[]> {
    const response = await apiClient.get<Attendance[]>(`/attendance/subject/${subjectId}`)
    return response.data
  },

  async create(data: AttendanceFormData): Promise<Attendance> {
    const response = await apiClient.post<Attendance>('/attendance', data)
    return response.data
  },

  async update(id: number | string, data: Partial<AttendanceFormData>): Promise<Attendance> {
    const response = await apiClient.put<Attendance>(`/attendance/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/attendance/${id}`)
  },
}
