import type { Event, EventsData, PaginationMeta } from '~/composables/types';

/**
 * Filter parameters for events
 */
export interface EventFilters {
  status?: string;
  genre?: string;
  city?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Composable for fetching and managing events
 * Supports filtering by status, genre, city, search term, and pagination
 */
export const useEvents = (filters?: EventFilters) => {
  const api = useApiClient();

  // Build query parameters, filtering out undefined values
  const queryParams: Record<string, any> = {};
  if (filters?.status) queryParams.status = filters.status;
  if (filters?.genre) queryParams.genre = filters.genre;
  if (filters?.city) queryParams.city = filters.city;
  if (filters?.search) queryParams.search = filters.search;
  if (filters?.page) queryParams.page = filters.page;
  if (filters?.per_page) queryParams.per_page = filters.per_page;

  // Create a dynamic key based on filter params for proper caching
  const filterKey = JSON.stringify(queryParams);
  const cacheKey = `talent-events-${filterKey}`;

  // Fetch events with filters
  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData(
    cacheKey,
    async () => {
      const result = await api.get<EventsData>('/events', queryParams);
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
