import type { ApiResponse, Application, MyApplicationsData } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const applicationsPayload: ApiResponse<MyApplicationsData> = {
  success: true,
  message: 'Applications fetched successfully',
  data: {
    applications: [
      {
        id: 1,
        source: 'apply',
        event: {
          id: 1,
          title: 'Punk Night Vol. 3',
          event_date: '2026-04-15',
          venue_name: 'Kafe Kota Bandung',
          city: 'Bandung',
          latitude: -6.9175,
          longitude: 107.6191,
        },
        proposed_price: 1500000,
        status: 'pending',
        created_at: '2026-03-08T11:00:00Z',
      },
      {
        id: 2,
        source: 'apply',
        event: {
          id: 2,
          title: 'Alternative Friday Session',
          event_date: '2026-04-20',
          venue_name: 'Bandung Creative Space',
          city: 'Bandung',
        },
        proposed_price: 1750000,
        status: 'accepted',
        created_at: '2026-03-10T09:30:00Z',
      },
      {
        id: 3,
        source: 'apply',
        event: {
          id: 3,
          title: 'Indie Summer Showcase',
          event_date: '2026-04-28',
          venue_name: 'Jakarta Music Hall',
          city: 'Jakarta',
        },
        proposed_price: 1600000,
        status: 'rejected',
        created_at: '2026-03-11T08:15:00Z',
      },
    ],
  },
};

export const useApplications = () => {
  const resource = useMockResource('talent-applications', applicationsPayload);

  return {
    ...resource,
    data: computed<Application[]>(() => resource.data.value.applications),
  };
};
