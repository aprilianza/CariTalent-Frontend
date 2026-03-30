import type { ApiResponse, Application } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const applicationsPayload: ApiResponse<Application[]> = {
  success: true,
  message: 'Applications fetched successfully',
  data: [
    {
      id: 1,
      event: { title: 'Punk Night Vol. 3' },
      proposed_price: 1500000,
      status: 'pending',
    },
    {
      id: 2,
      event: { title: 'Punk Night Vol. 3' },
      proposed_price: 1500000,
      status: 'pending',
    },
    {
      id: 3,
      event: { title: 'Punk Night Vol. 3' },
      proposed_price: 1500000,
      status: 'pending',
    },
  ],
};

export const useApplications = () => useMockResource('talent-applications', applicationsPayload);
