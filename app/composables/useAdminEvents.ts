import type { AdminModeratePayload, ApiResponse, Event, EventsData } from '~/composables/types';

export const useAdminEvents = () => {
  const { $api } = useNuxtApp();
  const page = ref(1);

  const { data: response, pending, error, refresh } = useAsyncData(
    'admin-events',
    () => $api<ApiResponse<EventsData>>(`/events${page.value > 1 ? '?page=' + page.value : ''}`),
    { watch: [page] }
  );

  const events = computed<Event[]>(() => response.value?.data?.events || []);
  const pagination = computed(() => response.value?.data?.pagination);

  const moderateEvent = async (id: number, payload: AdminModeratePayload) => {
    try {
      const res = await $api<ApiResponse<any>>(`/admin/events/${id}/moderate`, {
        method: 'PUT',
        body: payload,
      });
      if (res.success) {
        await refresh();
        return { success: true };
      }
      return { success: false, message: res.message };
    } catch (err: any) {
      return { success: false, message: err.data?.message || 'Gagal memoderasi event' };
    }
  };

  return {
    response,
    events,
    pagination,
    pending,
    error,
    refresh,
    moderateEvent,
    page,
  };
};

