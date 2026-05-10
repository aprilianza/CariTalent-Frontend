import type { Booking, MyBookingsData, PaginationMeta } from '~/composables/types';

export interface BookingsFilters {
  page?: number;
  per_page?: number;
}

export const useBookings = (filters?: BookingsFilters) => {
  const api = useApiClient();

  // Build query parameters
  const queryParams: Record<string, any> = {};
  if (filters?.page) queryParams.page = filters.page;
  if (filters?.per_page) queryParams.per_page = filters.per_page;

  // Create dynamic cache key based on filters
  const filterKey = JSON.stringify(queryParams);
  const cacheKey = `talent-bookings-${filterKey}`;

  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData(
    cacheKey,
    async () => {
      const result = await api.get<MyBookingsData & { pagination?: PaginationMeta }>('/bookings/my', queryParams);
      return result;
    },
    {
      default: () => ({
        success: false,
        message: '',
        data: { bookings: [], pagination: undefined },
      }),
    },
  );

  const data = computed<Booking[]>(() => response.value?.data?.bookings ?? []);
  const pagination = computed<PaginationMeta | undefined>(() => response.value?.data?.pagination);

  return {
    data,
    pagination,
    pending,
    error,
    refresh,
  };
};
