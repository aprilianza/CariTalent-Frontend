import type { AdminDashboardStats, ApiResponse } from '~/composables/types';

const defaultStats: AdminDashboardStats = {
  total_users: 0,
  total_talents: 0,
  total_eo: 0,
  total_events: 0,
  active_events: 0,
  total_bookings: 0,
  completed_bookings: 0,
  total_reviews: 0,
};

export const useAdminDashboard = () => {
  const { $api } = useNuxtApp();

  const { data: response, pending, error, refresh } = useAsyncData(
    'admin-dashboard',
    async () => {
      try {
        return await $api<ApiResponse<AdminDashboardStats>>('/admin/dashboard');
      } catch (err: any) {
        // Return a fallback so the page doesn't crash with an error banner
        console.error('[useAdminDashboard] fetch failed:', err?.data?.message || err?.message || err);
        throw err;
      }
    },
    {
      server: false,  // $api plugin is client-only
      lazy: true,     // Don't block navigation
    }
  );

  const data = computed<AdminDashboardStats>(() => {
    if (response.value?.success && response.value.data) {
      return response.value.data;
    }
    return { ...defaultStats };
  });

  return {
    response,
    data,
    pending,
    error,
    refresh,
  };
};

