import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL } from '@/utils/constants'
import { ApiError } from '@/types'

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    // Add Authorization header if token exists. Keep logs minimal to avoid console spam.
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and data extraction
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // For paginated email history, return full response
    if (response.config.url?.includes('/emails/history')) {
      return response
    }

    // If backend uses { success, data, message } pattern, extract nested data for callers
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      return { ...response, data: response.data.data }
    }

    return response
  },
  (error: AxiosError) => {
    // Keep error logs (important) but avoid logging large payloads
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    })

    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status || 500,
    }

    if (error.response) {
      const data = error.response.data as { message?: string; errors?: { [key: string]: string[] } }
      apiError.message = data.message || 'An error occurred'
      apiError.errors = data.errors

      // Handle unauthorized access
      if (error.response.status === 401) {
        // Clear auth state and redirect to login
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    } else if (error.request) {
      apiError.message = 'Network error. Please check your connection.'
      console.error('Network error - no response received')
    } else {
      apiError.message = error.message
      console.error('Request setup error:', error.message)
    }

    return Promise.reject(apiError)
  }
)

export default apiClient
