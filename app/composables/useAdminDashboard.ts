import type { AdminDashboardStats, ApiResponse } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const dashboardPayload: ApiResponse<AdminDashboardStats> = {
  success: true,
  message: 'OK',
  data: {
    total_users: 245,
    total_talents: 180,
    total_eo: 65,
    total_events: 120,
    active_events: 34,
    total_bookings: 89,
    completed_bookings: 56,
    total_reviews: 48,
  },
};

export const useAdminDashboard = () => {
  const resource = useMockResource<AdminDashboardStats>('admin-dashboard', dashboardPayload);

  return {
    ...resource,
    data: computed<AdminDashboardStats>(() => resource.data.value),
  };
};
