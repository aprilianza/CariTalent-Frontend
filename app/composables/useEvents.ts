import type { Event, EventsData, PaginationMeta } from '~/composables/types';

/**
 * Filter parameters for events
 */
export interface EventFilters {
  status?: string;
  genre?: string;
  city?: string;
  budget_min?: number;
  budget_max?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Composable for fetching and managing events
 * Supports filtering by status, genre, city, search term, and pagination
 */
export const useEvents = (filters?: MaybeRef<EventFilters | undefined>) => {
  const api = useApiClient();

  const queryParams = computed<Record<string, any>>(() => {
    const activeFilters = unref(filters);
    const params: Record<string, any> = {};

    if (activeFilters?.status) params.status = activeFilters.status;
    if (activeFilters?.genre) params.genre = activeFilters.genre;
    if (activeFilters?.city) params.city = activeFilters.city;
    if (activeFilters?.budget_min) params.budget_min = activeFilters.budget_min;
    if (activeFilters?.budget_max) params.budget_max = activeFilters.budget_max;
    if (activeFilters?.date_from) params.date_from = activeFilters.date_from;
    if (activeFilters?.date_to) params.date_to = activeFilters.date_to;
    if (activeFilters?.search) params.search = activeFilters.search;
    if (activeFilters?.page) params.page = activeFilters.page;
    if (activeFilters?.per_page) params.per_page = activeFilters.per_page;

    return params;
  });

  // Create a dynamic key based on filter params for proper caching
  const filterKey = computed(() => JSON.stringify(queryParams.value));
  const cacheKey = computed(() => `talent-events-${filterKey.value}`);

  // Fetch events with filters
  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData(
    cacheKey,
    async () => {
      const result = await api.get<EventsData>('/events', queryParams.value);
      return result;
    },
    {
      lazy: false,
      server: true,
      default: () => ({
        success: false,
        message: '',
        data: { events: [], pagination: undefined },
      }),
      watch: [queryParams],
    },
  );

  // Extract events array from response
  const data = computed<Event[]>(() => response.value?.data?.events ?? []);

  // Extract pagination metadata from response
  const pagination = computed<PaginationMeta | undefined>(() => response.value?.data?.pagination);

  return {
    data,
    pagination,
    pending,
    error,
    refresh,
  };
};
