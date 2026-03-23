import type { ApiResponse, Booking } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const bookingsPayload: ApiResponse<Booking[]> = {
  success: true,
  message: 'Bookings fetched successfully',
  data: [
    {
      id: 1,
      event: {
        title: 'Rock Festival',
        event_date: '2026-04-15',
        venue_name: 'Bandung Hall',
      },
      status: 'confirmed',
    },
  ],
};

export const useBookings = () => useMockResource('talent-bookings', bookingsPayload);
