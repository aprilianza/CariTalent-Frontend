import type { ApiResponse, Invitation, MyInvitationsData } from '~/composables/types';

export const useEoInvitations = () => {
  const { $api } = useNuxtApp();
  
  const { data: response, pending, error, refresh } = useAsyncData<ApiResponse<MyInvitationsData>>(
    'eo-sent-invitations',
    () => $api('/invitations/sent')
  );

  return {
    response,
    pending,
    error,
    refresh,
    data: computed<Invitation[]>(() => response.value?.data?.invitations || []),
  };
};
