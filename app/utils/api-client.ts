import type { ApiResponse } from '~/composables/types'

/**
 * Custom API Error class for handling API-specific errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Options for API client requests
 */
export interface ApiClientOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  query?: Record<string, any>
  headers?: Record<string, string>
  requiresAuth?: boolean
}

/**
 * Creates an API client with automatic authentication and error handling
 */
export const createApiClient = () => {
  const config = useRuntimeConfig()
  const baseURL = config.public.apiBase as string
  const token = useCookie<string | null>('auth_token')

  /**
   * Makes an HTTP request to the API
   */
  const request = async <T>(
    endpoint: string,
    options: ApiClientOptions = {}
  ): Promise<ApiResponse<T>> => {
    const {
      method = 'GET',
      body,
      query,
      headers = {},
      requiresAuth = true,
    } = options

    // Check authentication
    if (requiresAuth && !token.value) {
      throw new ApiError('Authentication required', 401)
    }

    // Build headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    }

    if (requiresAuth && token.value) {
      requestHeaders.Authorization = `Bearer ${token.value}`
    }

    try {
      const response = await $fetch<ApiResponse<T>>(endpoint, {
        baseURL,
        method,
        headers: requestHeaders,
        body,
        query,
      })

      // Check if response indicates failure
      if (!response.success) {
        throw new ApiError(
          response.message || 'Request failed',
          400,
          response
        )
      }

      return response
    } catch (error: any) {
      // Handle $fetch errors
      if (error.statusCode === 401) {
        // Clear token and redirect to login
        token.value = null
        await navigateTo('/auth/login')
        throw new ApiError('Session expired', 401)
      }

      if (error.statusCode === 403) {
        throw new ApiError('Access denied', 403)
      }

      if (error.statusCode === 404) {
        throw new ApiError('Resource not found', 404)
      }

      if (error.statusCode === 422) {
        throw new ApiError(
          error.data?.message || 'Validation failed',
          422,
          error.data?.errors
        )
      }

      if (error.statusCode >= 500) {
        throw new ApiError('Server error. Please try again later.', 500)
      }

      // If it's already an ApiError, rethrow it
      if (error instanceof ApiError) {
        throw error
      }

      // Network or unknown errors
      throw new ApiError(
        error.message || 'Network error. Please check your connection.',
        0
      )
    }
  }

  return {
    /**
     * Makes a GET request
     */
    get: <T>(endpoint: string, query?: Record<string, any>, requiresAuth = true) =>
      request<T>(endpoint, { method: 'GET', query, requiresAuth }),

    /**
     * Makes a POST request
     */
    post: <T>(endpoint: string, body?: any, requiresAuth = true) =>
      request<T>(endpoint, { method: 'POST', body, requiresAuth }),

    /**
     * Makes a PUT request
     */
    put: <T>(endpoint: string, body?: any, requiresAuth = true) =>
      request<T>(endpoint, { method: 'PUT', body, requiresAuth }),

    /**
     * Makes a DELETE request
     */
    delete: <T>(endpoint: string, requiresAuth = true) =>
      request<T>(endpoint, { method: 'DELETE', requiresAuth }),
  }
}

/**
 * Composable wrapper for API client
 */
export const useApiClient = () => createApiClient()
