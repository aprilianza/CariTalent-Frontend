import type { ApiResponse, EoBooking, MyEoBookingsData } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const eoBookingsPayload: ApiResponse<MyEoBookingsData> = {
  success: true,
  message: 'Bookings fetched successfully',
  data: {
    bookings: [
      {
        id: 5,
        application_id: 16,
        source: 'apply',
        event: {
          id: 1,
          title: 'Punk Night Vol. 3',
          event_date: '2026-04-15',
          venue_name: 'Kafe Kota Bandung',
          latitude: -6.9175,
          longitude: 107.6191,
        },
        talent: {
          id: 9,
          stage_name: 'Electric Storm',
        },
        agreed_price: 2500000,
        status: 'confirmed',
        created_at: '2026-03-11T10:00:00Z',
      },
      {
        id: 6,
        application_id: 15,
        source: 'invitation',
        event: {
          id: 2,
          title: 'Jazz & Soul Evening',
          event_date: '2026-04-22',
          venue_name: 'Kafe Kota Rooftop',
        },
        talent: {
          id: 21,
          stage_name: 'Velvet Jazz Quartet',
        },
        agreed_price: 2000000,
        status: 'confirmed',
        created_at: '2026-03-12T09:00:00Z',
      },
      {
        id: 7,
        application_id: 9,
        source: 'apply',
        event: {
          id: 5,
          title: 'Indie Showcase March',
          event_date: '2026-03-20',
          venue_name: 'Kafe Kota Bandung',
        },
        talent: {
          id: 5,
          stage_name: 'The Sunday Lads',
        },
        agreed_price: 1800000,
        status: 'completed',
        created_at: '2026-02-15T11:00:00Z',
      },
      {
        id: 8,
        application_id: 8,
        source: 'invitation',
        event: {
          id: 3,
          title: 'Acoustic Sunday Session',
          event_date: '2026-04-07',
          venue_name: 'Kafe Kota Garden',
        },
        talent: {
          id: 18,
          stage_name: 'Clara Acoustic',
        },
        agreed_price: 1400000,
        status: 'completed',
        created_at: '2026-02-22T10:00:00Z',
      },
    ],
  },
};

export const useEoBookings = () => {
  const resource = useMockResource<MyEoBookingsData>('eo-bookings', eoBookingsPayload);

  return {
    ...resource,
    data: computed<EoBooking[]>(() => resource.data.value.bookings),
  };
};
