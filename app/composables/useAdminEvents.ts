import type { AdminModeratePayload, ApiResponse, Event, EventsData } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const eventsPayload: ApiResponse<EventsData> = {
  success: true,
  message: 'OK',
  data: {
    events: [
      {
        id: 1,
        organizer_id: 2,
        organizer_name: 'Kafe Kota',
        title: 'Punk Night Vol. 3',
        description: 'Malam punk rock terbaik di Bandung.',
        genre_needed: ['Pop Punk', 'Hardcore'],
        budget: 3000000,
        event_date: '2026-04-15',
        venue_name: 'Kafe Kota Bandung',
        city: 'Bandung',
        status: 'open',
        created_at: '2026-03-01T09:00:00Z',
      },
      {
        id: 2,
        organizer_id: 4,
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
        id: 3,
        organizer_id: 6,
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
        id: 4,
        organizer_id: 8,
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
      {
        id: 5,
        organizer_id: 2,
        organizer_name: 'Kafe Kota',
        title: 'Jazz & Chill Night',
        description: 'Malam santai dengan live jazz dan minuman hangat.',
        genre_needed: ['Jazz'],
        budget: 4000000,
        event_date: '2026-05-05',
        venue_name: 'Kafe Kota Bandung',
        city: 'Bandung',
        status: 'draft',
        created_at: '2026-03-20T10:00:00Z',
      },
      {
        id: 6,
        organizer_id: 4,
        organizer_name: 'Jakarta Music Hall',
        title: 'Festival Musik Nusantara',
        description: 'Festival musik dengan akar budaya lokal.',
        genre_needed: ['Folk', 'Acoustic', 'Street Performer'],
        budget: 8000000,
        event_date: '2026-06-01',
        venue_name: 'Lapangan JMH',
        city: 'Jakarta',
        status: 'open',
        created_at: '2026-03-25T08:00:00Z',
      },
    ],
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 6,
      last_page: 1,
    },
  },
};

export const useAdminEvents = () => {
  const resource = useMockResource<EventsData>('admin-events', eventsPayload);
  const events = ref<Event[]>([]);

  watch(
    resource.data,
    (value) => {
      events.value = value.events.map((e) => ({ ...e }));
    },
    { immediate: true },
  );

  const moderateEvent = (id: number, payload: AdminModeratePayload) => {
    const idx = events.value.findIndex((e) => e.id === id);
    if (idx !== -1) {
      events.value[idx] = { ...events.value[idx]!, status: payload.status };
    }
  };

  return {
    ...resource,
    events,
    moderateEvent,
    pagination: computed(() => resource.data.value.pagination),
  };
};
