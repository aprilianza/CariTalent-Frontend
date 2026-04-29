import { useCookie, useState } from '#imports'

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token')
  const user = useState<any>('user', () => null)
  
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiBase as string) || 'https://api.caritalent.id/api/v1'

  const login = async (credentials: any) => {
    try {
      const response = await $fetch<any>('/auth/login', {
        baseURL,
        method: 'POST',
        body: credentials
      })
      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user
      }
      return response
    } catch (error: any) {
      throw error.data || error
    }
  }

  const register = async (userData: any) => {
    try {
      const response = await $fetch<any>('/auth/register', {
        baseURL,
        method: 'POST',
        body: userData
      })
      if (response.success) {
        token.value = response.data.token
        user.value = response.data.user
      }
      return response
    } catch (error: any) {
      throw error.data || error
    }
  }

  const fetchUser = async () => {
    if (!token.value) return null
    try {
      const response = await $fetch<any>('/auth/me', {
        baseURL,
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      if (response.success) {
        user.value = response.data
      }
      return response.data
    } catch (error) {
      token.value = null
      user.value = null
      return null
    }
  }

  const logout = async () => {
    try {
       await $fetch<any>('/auth/logout', {
        baseURL,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
    } catch (error) {
      console.error(error)
    } finally {
      token.value = null
      user.value = null
    }
  }

  return {
    token,
    user,
    login,
    register,
    fetchUser,
    logout
  }
}
