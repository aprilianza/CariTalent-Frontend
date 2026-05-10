import type { ApiResponse, EoApplication, EventApplicationsData } from '~/composables/types';

export const useEoApplications = (eventId?: number) => {
  const { $api } = useNuxtApp();
  const key = `eo-applications-${eventId ?? 'all'}`;
  
  const { data: response, pending, error, refresh } = useAsyncData<ApiResponse<EventApplicationsData>>(
    key,
    () => $api(`/events/${eventId}/applications`),
    {
      immediate: !!eventId,
    }
  );

  const updateApplicationStatus = async (id: number, status: 'accepted' | 'rejected', agreedPrice?: number) => {
    return await $api<ApiResponse<any>>(`/applications/${id}/status`, {
      method: 'PUT',
      body: { 
        status,
        agreed_price: agreedPrice
      },
    });
  };

  return {
    response,
    pending,
    error,
    refresh,
    updateApplicationStatus,
    data: computed<EoApplication[]>(() => response.value?.data?.applications || []),
  };
};
