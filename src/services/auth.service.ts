import apiClient from './api'
import { LoginCredentials, SignupData, AuthResponse, User } from '@/types'
import { fetchWithRetry, logError, withTimeout } from '@/utils/errorHandling'
import { validateEmail, validatePassword, sanitizeString } from '@/utils/validation'

/**
 * Authentication service for user login, registration, and profile management
 */
export const authService = {
  /**
   * Authenticate user with email and password
   * @param credentials - User email and password
   * @returns Authentication response with user data and token
   * @throws {Error} When validation fails or API request fails
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    console.log('[AuthService] Login attempt for:', credentials.email)

    // Validate email format
    const emailValidation = validateEmail(credentials.email)
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error)
    }

    // Validate password
    if (!credentials.password || credentials.password.length === 0) {
      throw new Error('Password is required')
    }

    try {
      const response = await withTimeout(
        fetchWithRetry(() => apiClient.post<AuthResponse>('/auth/login', credentials)),
        15000, // 15 second timeout
        'Login request timeout - Please try again'
      )

      console.log(
        '[AuthService] Login successful, token received:',
        response.data.token ? `${response.data.token.substring(0, 10)}...` : 'none'
      )
      console.log('[AuthService] User:', response.data.user.email)

      return response.data
    } catch (error) {
      logError('AuthService', 'login', error)
      throw error
    }
  },

  /**
   * Register a new user account
   * @param data - User registration data
   * @returns Authentication response with user data and token
   * @throws {Error} When validation fails or API request fails
   */
  async signup(data: SignupData): Promise<AuthResponse> {
    console.log('[AuthService] Signup attempt for:', data.email)

    // Validate and sanitize inputs
    const emailValidation = validateEmail(data.email)
    if (!emailValidation.isValid) {
      throw new Error(emailValidation.error)
    }

    const passwordValidation = validatePassword(data.password)
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error)
    }

    if (!data.name || data.name.trim().length < 2) {
      throw new Error('Name must be at least 2 characters')
    }

    // Sanitize name to prevent XSS
    const sanitizedData: SignupData = {
      ...data,
      name: sanitizeString(data.name),
      email: data.email.trim().toLowerCase(),
    }

    try {
      const response = await withTimeout(
        fetchWithRetry(() => apiClient.post<AuthResponse>('/auth/register', sanitizedData)),
        15000,
        'Signup request timeout - Please try again'
      )

      console.log('[AuthService] Signup successful for:', response.data.user.email)
      return response.data
    } catch (error) {
      logError('AuthService', 'signup', error)
      throw error
    }
  },

  /**
   * Logout current user
   * @throws {Error} When API request fails
   */
  async logout(): Promise<void> {
    console.log('[AuthService] Logging out user')
    try {
      await withTimeout(apiClient.post('/auth/logout'), 10000, 'Logout request timeout')
      console.log('[AuthService] Logout successful')
    } catch (error) {
      logError('AuthService', 'logout', error)
      throw error
    }
  },

  /**
   * Get current authenticated user data
   * @returns Current user data
   * @throws {Error} When API request fails
   */
  async getCurrentUser(): Promise<User> {
    console.log('[AuthService] Fetching current user')
    try {
      const response = await withTimeout(
        fetchWithRetry(() => apiClient.get<User>('/auth/me')),
        10000,
        'Get user request timeout'
      )
      console.log('[AuthService] Current user:', response.data.email)
      return response.data
    } catch (error) {
      logError('AuthService', 'getCurrentUser', error)
      throw error
    }
  },

  /**
   * Refresh authentication token
   * @returns New authentication token
   * @throws {Error} When API request fails
   */
  async refreshToken(): Promise<{ token: string }> {
    console.log('[AuthService] Refreshing token')
    try {
      const response = await withTimeout(
        fetchWithRetry(() => apiClient.post<{ token: string }>('/auth/refresh-token')),
        10000,
        'Token refresh timeout'
      )
      console.log('[AuthService] Token refreshed successfully')
      return response.data
    } catch (error) {
      logError('AuthService', 'refreshToken', error)
      throw error
    }
  },

  /**
   * Update user password
   * @param data - Current and new password
   * @throws {Error} When validation fails or API request fails
   */
  async updatePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
    console.log('[AuthService] Updating password')

    // Validate new password
    const passwordValidation = validatePassword(data.newPassword)
    if (!passwordValidation.isValid) {
      throw new Error(passwordValidation.error)
    }

    if (!data.currentPassword || data.currentPassword.length === 0) {
      throw new Error('Current password is required')
    }

    try {
      await withTimeout(
        apiClient.put('/auth/update-password', data),
        10000,
        'Update password timeout'
      )
      console.log('[AuthService] Password updated successfully')
    } catch (error) {
      logError('AuthService', 'updatePassword', error)
      throw error
    }
  },

  /**
   * Update user profile information
   * @param data - Partial user data to update
   * @returns Updated user data
   * @throws {Error} When API request fails
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    console.log('[AuthService] Updating profile')

    // Sanitize name if provided
    const sanitizedData = data.name ? { ...data, name: sanitizeString(data.name) } : data

    try {
      const response = await withTimeout(
        apiClient.put<User>('/auth/update-profile', sanitizedData),
        10000,
        'Update profile timeout'
      )
      console.log('[AuthService] Profile updated successfully')
      return response.data
    } catch (error) {
      logError('AuthService', 'updateProfile', error)
      throw error
    }
  },
}
