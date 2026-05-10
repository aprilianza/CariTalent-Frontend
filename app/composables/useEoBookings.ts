import type { ApiResponse, EoBooking, MyEoBookingsData } from '~/composables/types';

export const useEoBookings = () => {
  const { $api } = useNuxtApp();
  
  const { data: response, pending, error, refresh } = useAsyncData<ApiResponse<MyEoBookingsData>>(
    'eo-bookings',
    () => $api('/bookings/my')
  );

  const completeBooking = async (id: number) => {
    return await $api<ApiResponse<any>>(`/bookings/${id}/complete`, { method: 'PUT' });
  };

  const cancelBooking = async (id: number) => {
    return await $api<ApiResponse<any>>(`/bookings/${id}/cancel`, { method: 'PUT' });
  };

  const submitReview = async (bookingId: number, rating: number, comment: string) => {
    return await $api<ApiResponse<any>>('/reviews', {
      method: 'POST',
      body: {
        booking_id: bookingId,
        rating,
        comment,
      },
    });
  };

  return {
    response,
    pending,
    error,
    refresh,
    completeBooking,
    cancelBooking,
    submitReview,
    data: computed<EoBooking[]>(() => response.value?.data?.bookings || []),
  };
};
