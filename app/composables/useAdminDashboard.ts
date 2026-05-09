import type { AdminDashboardStats, ApiResponse } from '~/composables/types';

export const useAdminDashboard = () => {
  const { $api } = useNuxtApp();

  const { data: response, pending, error, refresh } = useAsyncData(
    'admin-dashboard',
    () => $api<ApiResponse<AdminDashboardStats>>('/admin/dashboard')
  );

  const data = computed<AdminDashboardStats>(() => {
    if (response.value?.success && response.value.data) {
      return response.value.data;
    }
    // Fallback if backend doesn't implement this yet
    return {
      total_users: 0,
      total_talents: 0,
      total_eo: 0,
      total_events: 0,
      active_events: 0,
      total_bookings: 0,
      completed_bookings: 0,
      total_reviews: 0,
    };
  });

  return {
    response,
    data,
    pending,
    error,
    refresh,
  };
};

