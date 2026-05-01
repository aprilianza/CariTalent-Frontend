import type { Application, MyApplicationsData, PaginationMeta } from '~/composables/types';

export interface ApplicationsFilters {
  page?: number;
  per_page?: number;
}

export const useApplications = (filters?: ApplicationsFilters) => {
  const api = useApiClient();

  // Build query parameters
  const queryParams: Record<string, any> = {};
  if (filters?.page) queryParams.page = filters.page;
  if (filters?.per_page) queryParams.per_page = filters.per_page;

  // Create dynamic cache key based on filters
  const filterKey = JSON.stringify(queryParams);
  const cacheKey = `talent-applications-${filterKey}`;

  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData(
    cacheKey,
    async () => {
      const result = await api.get<MyApplicationsData & { pagination?: PaginationMeta }>('/applications/my', queryParams);
      return result;
    },
    {
      default: () => ({
        success: false,
        message: '',
        data: { applications: [], pagination: undefined },
      }),
    },
  );

  const data = computed<Application[]>(() => response.value?.data?.applications ?? []);
  const pagination = computed<PaginationMeta | undefined>(() => response.value?.data?.pagination);

  // Action to apply to an event
  const applyToEvent = async (eventId: number, payload: { message: string; proposed_price: number }) => {
    try {
      await api.post('/applications', {
        event_id: eventId,
        ...payload,
      });
      await refresh();
    } catch (err) {
      throw err;
    }
  };

  // Action to cancel an application
  const cancelApplication = async (applicationId: number) => {
    try {
      await api.delete(`/applications/${applicationId}`);
      await refresh();
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    pagination,
    pending,
    error,
    refresh,
    applyToEvent,
    cancelApplication,
  };
};
