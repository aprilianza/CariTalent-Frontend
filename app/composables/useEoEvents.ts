import type { ApiResponse, EoEvent, MyEoEventsData, CreateEventPayload } from '~/composables/types';

export const useEoEvents = () => {
  const { $api } = useNuxtApp();
  
  const { data: response, pending, error, refresh } = useAsyncData<ApiResponse<MyEoEventsData>>(
    'eo-events',
    () => $api('/events/my')
  );

  const createEvent = async (payload: CreateEventPayload) => {
    return await $api<ApiResponse<any>>('/events', {
      method: 'POST',
      body: payload,
    });
  };

  const updateEvent = async (id: number, payload: Partial<CreateEventPayload>) => {
    return await $api<ApiResponse<any>>(`/events/${id}`, {
      method: 'PUT',
      body: payload,
    });
  };

  const deleteEvent = async (id: number) => {
    return await $api<ApiResponse<any>>(`/events/${id}`, {
      method: 'DELETE',
    });
  };

  return {
    response,
    pending,
    error,
    refresh,
    createEvent,
    updateEvent,
    deleteEvent,
    data: computed<EoEvent[]>(() => response.value?.data?.events || []),
    pagination: computed(() => response.value?.data?.pagination || { current_page: 1, per_page: 15, total: 0, last_page: 1 }),
  };
};
