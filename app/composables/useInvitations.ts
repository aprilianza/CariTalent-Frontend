import type { ApiResponse, Invitation, MyInvitationsData } from '~/composables/types';

export const useInvitations = () => {
  const { $api } = useNuxtApp();
  
  const { data: response, pending, error, refresh } = useAsyncData<ApiResponse<MyInvitationsData>>(
    'talent-invitations',
    () => $api('/invitations/my')
  );

  const inviteTalent = async (eventId: number, talentId: number, offeredPrice: number) => {
    return await $api<ApiResponse<any>>('/invitations', {
      method: 'POST',
      body: {
        event_id: eventId,
        talent_id: talentId,
        offered_price: offeredPrice,
      },
    });
  };

  const respondInvitation = async (id: number, status: 'accepted' | 'rejected') => {
    return await $api<ApiResponse<any>>(`/invitations/${id}/respond`, {
      method: 'PUT',
      body: { status },
    });
  };

  return {
    response,
    pending,
    error,
    refresh,
    inviteTalent,
    respondInvitation,
    data: computed<Invitation[]>(() => response.value?.data?.invitations || []),
  };
};
