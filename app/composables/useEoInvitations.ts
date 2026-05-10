import type { Invitation, MyInvitationsData, PaginationMeta } from '~/composables/types';

export const useEoInvitations = () => {
  const api = useApiClient();

  const { data: response, pending, error, refresh } = useAsyncData(
    'eo-sent-invitations',
    () => api.get<MyInvitationsData & { pagination?: PaginationMeta }>('/invitations/sent'),
    {
      default: () => ({
        success: false,
        message: '',
        data: { invitations: [], pagination: undefined },
      }),
    },
  );

  return {
    response,
    pending,
    error,
    refresh,
    data: computed<Invitation[]>(() => response.value?.data?.invitations ?? []),
    pagination: computed<PaginationMeta | undefined>(() => response.value?.data?.pagination),
  };
};
