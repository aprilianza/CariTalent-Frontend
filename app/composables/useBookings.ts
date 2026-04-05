import type { ApiResponse, Booking, MyBookingsData } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const bookingsPayload: ApiResponse<MyBookingsData> = {
  success: true,
  message: 'Bookings fetched successfully',
  data: {
    bookings: [
      {
        id: 1,
        source: 'apply',
        event: {
          id: 1,
          title: 'Rock Festival',
          event_date: '2026-04-15',
          venue_name: 'Bandung Hall',
          latitude: -6.9175,
          longitude: 107.6191,
        },
        agreed_price: 1800000,
        status: 'confirmed',
        created_at: '2026-03-12T10:00:00Z',
      },
      {
        id: 2,
        source: 'invitation',
        event: {
          id: 2,
          title: 'Alternative Crowd',
          event_date: '2026-04-21',
          venue_name: 'Jakarta Hall',
        },
        agreed_price: 2000000,
        status: 'completed',
        created_at: '2026-03-10T12:00:00Z',
      },
      {
        id: 3,
        source: 'apply',
        event: {
          id: 3,
          title: 'Indie Stage',
          event_date: '2026-04-27',
          venue_name: 'Bandung Creative Space',
        },
        agreed_price: 1700000,
        status: 'completed',
        created_at: '2026-03-09T09:00:00Z',
      },
    ],
  },
};

export const useBookings = () => {
  const resource = useMockResource('talent-bookings', bookingsPayload);

  return {
    ...resource,
    data: computed<Booking[]>(() => resource.data.value.bookings),
  };
};
