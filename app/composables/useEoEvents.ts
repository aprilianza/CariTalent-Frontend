import type { EoEvent, MyEoEventsData, CreateEventPayload, PaginationMeta } from '~/composables/types';

export const useEoEvents = () => {
  const api = useApiClient();

  const { data: response, pending, error, refresh } = useAsyncData(
    'eo-events',
    () => api.get<MyEoEventsData & { pagination?: PaginationMeta }>('/events/my'),
    {
      default: () => ({
        success: false,
        message: '',
        data: { events: [], pagination: undefined },
      }),
    },
  );

  const createEvent = async (payload: CreateEventPayload) => {
    const response = await api.post('/events', payload);
    await refresh();
    return response;
  };

  const updateEvent = async (id: number, payload: Partial<CreateEventPayload>) => {
    const response = await api.put(`/events/${id}`, payload);
    await refresh();
    return response;
  };

  const deleteEvent = async (id: number) => {
    const response = await api.delete(`/events/${id}`);
    await refresh();
    return response;
  };

  return {
    response,
    pending,
    error,
    refresh,
    createEvent,
    updateEvent,
    deleteEvent,
    data: computed<EoEvent[]>(() => response.value?.data?.events ?? []),
    pagination: computed(() => response.value?.data?.pagination ?? { current_page: 1, per_page: 15, total: 0, last_page: 1 }),
  };
};
