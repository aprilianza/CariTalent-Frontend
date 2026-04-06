import type { ApiResponse, EoApplication, EventApplicationsData } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

// Mock data: applications for event id=1 (Punk Night Vol. 3)
const eoApplicationsPayload: ApiResponse<EventApplicationsData> = {
  success: true,
  message: 'Applications fetched successfully',
  data: {
    applications: [
      {
        id: 10,
        talent: {
          id: 3,
          stage_name: 'The Broken Strings',
          genre: ['Pop Punk', 'Alternative'],
          city: 'Bandung',
          verified: true,
          average_rating: 4.5,
        },
        source: 'apply',
        message: 'Kami band pop punk dari Bandung dengan pengalaman 5 tahun, siap tampil di acara ini.',
        proposed_price: 1500000,
        status: 'pending',
        created_at: '2026-03-08T11:00:00Z',
      },
      {
        id: 11,
        talent: {
          id: 7,
          stage_name: 'Riot Kids',
          genre: ['Pop Punk'],
          city: 'Jakarta',
          verified: true,
          average_rating: 4.2,
        },
        source: 'apply',
        message: 'Band kami berpengalaman tampil di berbagai festival nasional.',
        proposed_price: 1800000,
        status: 'pending',
        created_at: '2026-03-09T09:00:00Z',
      },
      {
        id: 15,
        talent: {
          id: 12,
          stage_name: 'Dead Static',
          genre: ['Hardcore', 'Metal'],
          city: 'Bandung',
          verified: false,
          average_rating: 3.8,
        },
        source: 'invitation',
        proposed_price: 2000000,
        status: 'pending',
        created_at: '2026-03-10T14:30:00Z',
      },
      {
        id: 16,
        talent: {
          id: 9,
          stage_name: 'Electric Storm',
          genre: ['Pop Punk', 'Rock'],
          city: 'Surabaya',
          verified: true,
          average_rating: 4.7,
        },
        source: 'apply',
        message: 'Kami siap memberikan penampilan terbaik!',
        proposed_price: 2500000,
        status: 'accepted',
        created_at: '2026-03-07T10:00:00Z',
      },
      {
        id: 17,
        talent: {
          id: 14,
          stage_name: 'Noise Factory',
          genre: ['Hardcore'],
          city: 'Bandung',
          verified: false,
          average_rating: 3.5,
        },
        source: 'apply',
        message: 'Siap beraksi!',
        proposed_price: 1200000,
        status: 'rejected',
        created_at: '2026-03-06T08:00:00Z',
      },
    ],
  },
};

export const useEoApplications = (eventId?: number) => {
  const key = `eo-applications-${eventId ?? 'all'}`;
  const resource = useMockResource<EventApplicationsData>(key, eoApplicationsPayload);

  return {
    ...resource,
    data: computed<EoApplication[]>(() => resource.data.value.applications),
  };
};
