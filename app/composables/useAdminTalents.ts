import type { AdminTalent, AdminTalentsData, ApiResponse } from '~/composables/types';

export const useAdminTalents = () => {
  const { $api } = useNuxtApp();
  const page = ref(1);

  const { data: response, pending, error, refresh } = useAsyncData(
    'admin-talents',
    () => $api<ApiResponse<AdminTalentsData>>(`/talents${page.value > 1 ? '?page=' + page.value : ''}`),
    { watch: [page] }
  );

  const talents = computed<AdminTalent[]>(() => response.value?.data?.talents || []);
  const pagination = computed(() => response.value?.data?.pagination);

  const verifyTalent = async (id: number, verified: boolean) => {
    try {
      const res = await $api<ApiResponse<any>>(`/admin/talents/${id}/verify`, {
        method: 'PUT',
        body: { verified },
      });
      if (res.success) {
        await refresh();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.data?.message || 'Gagal memverifikasi talent' };
    }
  };

  return {
    response,
    talents,
    pagination,
    pending,
    error,
    refresh,
    verifyTalent,
    page,
  };
};

