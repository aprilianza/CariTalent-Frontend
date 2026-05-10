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

  const completeBooking = async (bookingId: number) => {
    const response = await api.put<{ id: number; status: BookingStatus }>(`/bookings/${bookingId}/complete`);
    await refresh();
    return response;
  };

  const cancelBooking = async (bookingId: number) => {
    const response = await api.put<null>(`/bookings/${bookingId}/cancel`);
    await refresh();
    return response;
  };

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
