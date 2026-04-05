import type { ApiResponse, Invitation, MyInvitationsData } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const invitationsPayload: ApiResponse<MyInvitationsData> = {
  success: true,
  message: 'Invitations fetched successfully',
  data: {
    invitations: [
      {
        id: 1,
        event: {
          id: 10,
          title: 'Jazz Night',
          event_date: '2026-04-18',
          venue_name: 'Cafe Jazz Bandung',
          city: 'Bandung',
          budget: 3000000,
          latitude: -6.9175,
          longitude: 107.6191,
        },
        organizer_name: 'Cafe Jazz',
        offered_price: 2000000,
        status: 'pending',
        created_at: '2026-03-08T12:00:00Z',
      },
      {
        id: 2,
        event: {
          id: 11,
          title: 'Blues Session',
          event_date: '2026-04-22',
          venue_name: 'Blue Note Jakarta',
          city: 'Jakarta',
          budget: 2500000,
        },
        organizer_name: 'Blue Note',
        offered_price: 1500000,
        status: 'pending',
        created_at: '2026-03-09T10:20:00Z',
      },
    ],
  },
};

export const useInvitations = () => {
  const resource = useMockResource('talent-invitations', invitationsPayload);

  return {
    ...resource,
    data: computed<Invitation[]>(() => resource.data.value.invitations),
  };
};
