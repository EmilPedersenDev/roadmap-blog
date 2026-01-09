interface ApiOptions extends RequestInit {
  requireAuth?: boolean
}

export const useApi = () => {
  const config = useRuntimeConfig()
  const { session } = useAuth()

  // Get API base URL from runtime config (with fallback)
  const getApiUrl = () => {
    return config.public.apiUrl || 'http://localhost:3001'
  }

  // Get base API path
  const getBasePath = () => {
    return `${getApiUrl()}/api/v1`
  }

  // Get auth token from stored session
  const getAuthToken = (): string | null => {
    return session.value?.access_token || null
  }

  // Main API request method
  const apiRequest = async <T = any>(
    endpoint: string,
    options: ApiOptions = {}
  ): Promise<T> => {
    const { requireAuth = false, headers = {}, ...fetchOptions } = options

    const url = `${getBasePath()}${endpoint}`
    const requestHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    }

    // Add auth token if required
    if (requireAuth) {
      const token = getAuthToken()
      if (token) {
        (requestHeaders as Record<string, string>)['Authorization'] = `Bearer ${token}`
      } else {
        throw new Error('Authentication required but no token available')
      }
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        return await response.json()
      }

      return null as T
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)
      throw error
    }
  }

  // Convenience methods
  const get = <T = any>(endpoint: string, requireAuth = false) => {
    return apiRequest<T>(endpoint, { method: 'GET', requireAuth })
  }

  const post = <T = any>(endpoint: string, data?: any, requireAuth = true) => {
    return apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      requireAuth,
    })
  }

  const put = <T = any>(endpoint: string, data?: any, requireAuth = true) => {
    return apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      requireAuth,
    })
  }

  const del = <T = any>(endpoint: string, requireAuth = true) => {
    return apiRequest<T>(endpoint, {
      method: 'DELETE',
      requireAuth,
    })
  }

  return {
    get,
    post,
    put,
    delete: del,
    request: apiRequest,
  }
}

