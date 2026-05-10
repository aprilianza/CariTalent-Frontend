import type { EoApplication, EventApplicationsData } from '~/composables/types';

export const useEoApplications = (eventId?: number) => {
  const api = useApiClient();
  const key = `eo-applications-${eventId ?? 'all'}`;

  const { data: response, pending, error, refresh } = useAsyncData(
    key,
    () => api.get<EventApplicationsData>(`/events/${eventId}/applications`),
    {
      immediate: !!eventId,
      default: () => ({
        success: false,
        message: '',
        data: { applications: [] },
      }),
    },
  );

  const updateApplicationStatus = async (id: number, status: 'accepted' | 'rejected', agreedPrice?: number) => {
    const response = await api.put(`/applications/${id}/status`, {
      status,
      agreed_price: agreedPrice,
    });
    await refresh();
    return response;
  };

  return {
    response,
    pending,
    error,
    refresh,
    updateApplicationStatus,
    data: computed<EoApplication[]>(() => response.value?.data?.applications ?? []),
  };
};
