import type { AdminUser, AdminUsersData, ApiResponse } from '~/composables/types';

export const useAdminUsers = () => {
  const { $api } = useNuxtApp();
  const page = ref(1);
  const role = ref('');
  const search = ref('');

  const { data: response, pending, error, refresh } = useAsyncData(
    'admin-users',
    () => {
      const query = new URLSearchParams();
      if (page.value > 1) query.append('page', page.value.toString());
      if (role.value) query.append('role', role.value);
      if (search.value) query.append('search', search.value);
      
      const queryString = query.toString();
      return $api<ApiResponse<AdminUsersData>>(`/admin/users${queryString ? '?' + queryString : ''}`);
    },
    { watch: [page, role, search] }
  );

  const users = computed<AdminUser[]>(() => response.value?.data?.users || []);
  const pagination = computed(() => response.value?.data?.pagination);

  const deleteUser = async (id: number) => {
    try {
      const res = await $api<ApiResponse<any>>(`/admin/users/${id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        await refresh();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.data?.message || 'Gagal menghapus pengguna' };
    }
  };

  return {
    response,
    users,
    pagination,
    pending,
    error,
    refresh,
    deleteUser,
    page,
    role,
    search,
  };
};
