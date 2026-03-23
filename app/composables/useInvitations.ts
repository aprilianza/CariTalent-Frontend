import type { ApiResponse, Invitation } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const invitationsPayload: ApiResponse<Invitation[]> = {
  success: true,
  message: 'Invitations fetched successfully',
  data: [
    {
      id: 1,
      event: { title: 'Jazz Night' },
      organizer_name: 'Cafe Jazz',
      offered_price: 2000000,
      status: 'pending',
    },
  ],
};

export const useInvitations = () => useMockResource('talent-invitations', invitationsPayload);
