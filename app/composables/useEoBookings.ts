import type { BookingStatus, EoBooking, MyEoBookingsData, PaginationMeta } from '~/composables/types';

export const useEoBookings = () => {
  const api = useApiClient();

  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData('eo-bookings', () => api.get<MyEoBookingsData & { pagination?: PaginationMeta }>('/bookings/my'), {
    default: () => ({
      success: false,
      message: '',
      data: { bookings: [], pagination: undefined },
    }),
  });

  const completeBooking = (bookingId: number) => api.put<{ id: number; status: BookingStatus }>(`/bookings/${bookingId}/complete`);
  const cancelBooking = (bookingId: number) => api.put<null>(`/bookings/${bookingId}/cancel`);

  return {
    response,
    data: computed<EoBooking[]>(() => response.value?.data?.bookings ?? []),
    pagination: computed<PaginationMeta | undefined>(() => response.value?.data?.pagination),
    pending,
    error,
    refresh,
    completeBooking,
    cancelBooking,
  };
};
