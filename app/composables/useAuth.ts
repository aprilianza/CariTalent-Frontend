import type { ApiResponse } from './types';

export const useAuth = () => {
  const { $api } = useNuxtApp();
  const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 }); // 7 days
  const user = useState<any>('auth_user', () => null);

  const isLoggedIn = computed(() => !!token.value && !!user.value);

  const login = async (credentials: any) => {
    try {
      const response = await $api<ApiResponse<any>>('/auth/login', {
        method: 'POST',
        body: credentials,
      });

      if (response.success && response.data?.token) {
        token.value = response.data.token.split('|')[1] || response.data.token;
        user.value = response.data.user;
        return { success: true, role: user.value.role };
      }
      return { success: false, message: response.message };
    } catch (error: any) {
      return { success: false, message: error.data?.message || 'Login failed' };
    }
  };

  const register = async (userData: any) => {
    try {
      const response = await $api<ApiResponse<any>>('/auth/register', {
        method: 'POST',
        body: userData,
      });

      if (response.success && response.data?.token) {
        token.value = response.data.token.split('|')[1] || response.data.token;
        user.value = response.data.user;
        return { success: true, role: user.value.role };
      }
      return { success: false, message: response.message, errors: response.errors };
    } catch (error: any) {
      return { success: false, message: error.data?.message || 'Registration failed', errors: error.data?.errors };
    }
  };

  const fetchMe = async () => {
    if (!token.value) return null;
    try {
      const response = await $api<ApiResponse<any>>('/auth/me');
      if (response.success) {
        user.value = response.data;
        return user.value;
      }
    } catch (error) {
      token.value = null;
      user.value = null;
    }
    return null;
  };

  const logout = async (redirectPath = '/') => {
    try {
      if (token.value) {
        await $api('/auth/logout', { method: 'POST' });
      }
    } catch (error) {
      // Ignore errors on logout
    } finally {
      token.value = null;
      user.value = null;
      if (process.client) {
        navigateTo(redirectPath);
      }
    }
  };

  const updateProfile = async (data: { name?: string; phone?: string }) => {
    try {
      const response = await $api<ApiResponse<any>>('/users/profile', {
        method: 'PUT',
        body: data,
      });
      if (response.success && response.data) {
        user.value = { ...user.value, ...response.data };
      }
      return response;
    } catch (error: any) {
      return { success: false, message: error.data?.message || 'Gagal memperbarui profil', errors: error.data?.errors };
    }
  };

  const updatePassword = async (data: any) => {
    try {
      return await $api<ApiResponse<any>>('/users/password', {
        method: 'PUT',
        body: data,
      });
    } catch (error: any) {
      return { success: false, message: error.data?.message || 'Gagal mengubah password', errors: error.data?.errors };
    }
  };

  return {
    token,
    user,
    isLoggedIn,
    login,
    register,
    logout,
    fetchMe,
    updateProfile,
    updatePassword,
  };
};
