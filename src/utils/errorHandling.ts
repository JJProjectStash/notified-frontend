import { isApiError, isNetworkError, isAxiosError, type ApiError } from '../types'

// ============================================================================
// ERROR HANDLING UTILITIES
// ============================================================================

/**
 * Default retry configuration
 */
export interface RetryConfig {
  maxRetries: number
  initialDelay: number
  maxDelay: number
  backoffMultiplier: number
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffMultiplier: 2,
}

/**
 * Calculate exponential backoff delay
 * @param attempt - Current retry attempt (0-indexed)
 * @param config - Retry configuration
 * @returns Delay in milliseconds
 */
function calculateBackoff(attempt: number, config: RetryConfig): number {
  const delay = config.initialDelay * Math.pow(config.backoffMultiplier, attempt)
  return Math.min(delay, config.maxDelay)
}

/**
 * Check if an error is retryable
 * @param error - Error to check
 * @returns True if the error should be retried
 */
function isRetryableError(error: unknown): boolean {
  // Network errors are retryable
  if (isNetworkError(error)) {
    return true
  }

  // 5xx server errors are retryable
  if (isApiError(error) && error.status >= 500 && error.status < 600) {
    return true
  }

  // 429 (Too Many Requests) is retryable after delay
  if (isApiError(error) && error.status === 429) {
    return true
  }

  // 408 (Request Timeout) is retryable
  if (isApiError(error) && error.status === 408) {
    return true
  }

  return false
}

/**
 * Retry an async function with exponential backoff
 * @param fn - Async function to retry
 * @param config - Retry configuration
 * @returns Promise with the function result
 * @throws Last error if all retries fail
 * @example
 * const data = await fetchWithRetry(() => api.get('/students'))
 */
export async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  config: Partial<RetryConfig> = {}
): Promise<T> {
  const retryConfig: RetryConfig = { ...DEFAULT_RETRY_CONFIG, ...config }
  let lastError: unknown

  for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // Don't retry if it's not a retryable error
      if (!isRetryableError(error)) {
        throw error
      }

      // Don't retry if it's the last attempt
      if (attempt === retryConfig.maxRetries) {
        throw error
      }

      // Calculate backoff delay
      const delay = calculateBackoff(attempt, retryConfig)
      console.log(`[Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`)

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // This should never be reached, but TypeScript requires it
  throw lastError
}

/**
 * Get a user-friendly error message from an error object
 * @param error - Error object
 * @param fallbackMessage - Message to show if error can't be parsed
 * @returns User-friendly error message
 */
export function getErrorMessage(
  error: unknown,
  fallbackMessage = 'An unexpected error occurred'
): string {
  // Network errors
  if (isNetworkError(error)) {
    return 'Network error - Please check your internet connection and try again'
  }

  // API errors
  if (isApiError(error)) {
    return error.message || fallbackMessage
  }

  // Axios errors
  if (isAxiosError(error)) {
    const status = error.response.status
    const data = error.response.data as { message?: string }

    if (status === 401) {
      return 'Session expired - Please login again'
    }
    if (status === 403) {
      return 'Access denied - You do not have permission to perform this action'
    }
    if (status === 404) {
      return data.message || 'Resource not found'
    }
    if (status === 429) {
      return 'Too many requests - Please try again later'
    }
    if (status === 500) {
      return 'Server error - Please try again later'
    }

    return data.message || fallbackMessage
  }

  // Standard Error objects
  if (error instanceof Error) {
    return error.message || fallbackMessage
  }

  // String errors
  if (typeof error === 'string') {
    return error
  }

  return fallbackMessage
}

/**
 * Get HTTP status code from an error
 * @param error - Error object
 * @returns HTTP status code or undefined
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (isApiError(error)) {
    return error.status
  }

  if (isAxiosError(error)) {
    return error.response.status
  }

  return undefined
}

/**
 * Check if error requires user to re-authenticate
 * @param error - Error object
 * @returns True if user needs to login again
 */
export function requiresReauth(error: unknown): boolean {
  const status = getErrorStatus(error)
  return status === 401 || status === 403
}

/**
 * Log error with context for debugging
 * @param moduleName - Name of the module where error occurred
 * @param operation - Operation that was being performed
 * @param error - Error object
 */
export function logError(moduleName: string, operation: string, error: unknown): void {
  console.error(`[${moduleName}] Error in ${operation}:`, {
    message: getErrorMessage(error),
    status: getErrorStatus(error),
    error: import.meta.env.DEV ? error : undefined, // Only log full error in development
  })
}

/**
 * Create a timeout promise that rejects after specified milliseconds
 * @param ms - Milliseconds to wait before timeout
 * @param message - Error message for timeout
 * @returns Promise that rejects after timeout
 */
export function timeout(ms: number, message = 'Request timeout'): Promise<never> {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(message))
    }, ms)
  })
}

/**
 * Race a promise against a timeout
 * @param promise - Promise to race
 * @param ms - Timeout in milliseconds
 * @param message - Error message for timeout
 * @returns Promise that resolves or rejects with timeout
 * @example
 * const data = await withTimeout(api.get('/students'), 10000)
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message = 'Request timeout'
): Promise<T> {
  return Promise.race([promise, timeout(ms, message)])
}

/**
 * Create an AbortController with automatic cleanup
 * @param timeoutMs - Timeout in milliseconds
 * @returns AbortController that will be aborted after timeout
 */
export function createAbortController(timeoutMs: number): AbortController {
  const controller = new AbortController()
  setTimeout(() => controller.abort(), timeoutMs)
  return controller
}
