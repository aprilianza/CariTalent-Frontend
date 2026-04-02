import type { ApiResponse, Event, EventsData } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const eventsPayload: ApiResponse<EventsData> = {
  success: true,
  message: 'Events fetched successfully',
  data: {
    events: [
      {
        id: 11,
        organizer_id: 2,
        organizer_name: 'Kafe Kota',
        title: 'Punk Night Vol. 3',
        description: 'Malam punk rock terbaik di Bandung.',
        genre_needed: ['Pop Punk', 'Hardcore'],
        budget: 3000000,
        event_date: '2026-04-15',
        venue_name: 'Kafe Kota Bandung',
        latitude: -6.9175,
        longitude: 107.6191,
        city: 'Bandung',
        status: 'open',
        created_at: '2026-03-01T09:00:00Z',
      },
      {
        id: 12,
        organizer_id: 5,
        organizer_name: 'Bandung Creative Space',
        title: 'Alternative Friday Session',
        description: 'Live session mingguan untuk band alternative lokal.',
        genre_needed: ['Alternative', 'Indie Rock'],
        budget: 2500000,
        event_date: '2026-04-20',
        venue_name: 'Bandung Creative Space',
        city: 'Bandung',
        status: 'open',
        created_at: '2026-03-03T14:20:00Z',
      },
      {
        id: 13,
        organizer_id: 9,
        organizer_name: 'Jakarta Music Hall',
        title: 'Indie Summer Showcase',
        description: 'Showcase musisi indie untuk penonton urban.',
        genre_needed: ['Indie', 'Pop'],
        budget: 3500000,
        event_date: '2026-04-28',
        venue_name: 'Jakarta Music Hall',
        city: 'Jakarta',
        status: 'open',
        created_at: '2026-03-05T10:10:00Z',
      },
      {
        id: 14,
        organizer_id: 7,
        organizer_name: 'Rooftop Echo',
        title: 'City Lights Acoustic Set',
        description: 'Acoustic showcase intimate dengan kapasitas terbatas.',
        genre_needed: ['Acoustic', 'Folk'],
        budget: 1800000,
        event_date: '2026-04-10',
        venue_name: 'Rooftop Echo Jakarta',
        city: 'Jakarta',
        status: 'closed',
        created_at: '2026-02-26T07:30:00Z',
      },
    ],
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 4,
      last_page: 1,
    },
  },
};

export const useEvents = () => {
  const resource = useMockResource('talent-events', eventsPayload);

  return {
    ...resource,
    data: computed<Event[]>(() => resource.data.value.events),
    pagination: computed(() => resource.response.value?.data.pagination ?? eventsPayload.data.pagination),
  };
};
