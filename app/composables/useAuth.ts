import { useCookie, useState } from '#imports'

export const useAuth = () => {
  const token = useCookie<string | null>('auth_token')
  const user = useState<any>('user', () => null)
  
  const config = useRuntimeConfig()
  const baseURL = (config.public.apiBase as string) || 'http://127.0.0.1:8000/api/v1'

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

  const updateProfile = async (profileData: { name: string, phone: string }) => {
    try {
      const response = await $fetch<any>('/users/profile', {
        baseURL,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: profileData
      })
      if (response.success) {
        user.value = { ...user.value, ...profileData }
      }
      return response
    } catch (error: any) {
      return error.data || { success: false, message: error.message }
    }
  }

  const updatePassword = async (passwordData: any) => {
    try {
      const response = await $fetch<any>('/users/password', {
        baseURL,
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token.value}`
        },
        body: passwordData
      })
      return response
    } catch (error: any) {
      return error.data || { success: false, message: error.message }
    }
  }

  return {
    token,
    user,
    login,
    register,
    fetchUser,
    logout,
    updateProfile,
    updatePassword
  }
}
