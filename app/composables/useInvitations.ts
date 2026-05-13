import type { Invitation, MyInvitationsData, PaginationMeta } from '~/composables/types';

export interface InvitationsFilters {
  page?: number;
  per_page?: number;
}

export const useInvitations = (filters?: InvitationsFilters) => {
  const api = useApiClient();

  // Build query parameters
  const queryParams: Record<string, any> = {};
  if (filters?.page) queryParams.page = filters.page;
  if (filters?.per_page) queryParams.per_page = filters.per_page;

  // Create dynamic cache key based on filters
  const filterKey = JSON.stringify(queryParams);
  const cacheKey = `talent-invitations-${filterKey}`;

  // Fetch invitations from API
  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData(
    cacheKey,
    async () => {
      const result = await api.get<MyInvitationsData & { pagination?: PaginationMeta }>('/invitations/my', queryParams);
      return result;
    },
    {
      default: () => ({
        success: false,
        message: '',
        data: { invitations: [], pagination: undefined },
      }),
    },
  );

  // Transform data to return invitations array
  const data = computed<Invitation[]>(() => response.value?.data?.invitations ?? []);
  const pagination = computed<PaginationMeta | undefined>(() => response.value?.data?.pagination);

  // Action method to respond to invitation
  const respondToInvitation = async (id: number, status: 'accepted' | 'rejected') => {
    try {
      await api.put(`/invitations/${id}/respond`, { status });
      // Refresh data to sync with server state
      await refresh();
    } catch (err) {
      // Re-throw error to be handled by caller
      throw err;
    }
  };

  // Action method to invite a talent (EO only)
  const inviteTalent = async (eventId: number, talentId: number, offeredPrice: number) => {
    try {
      const result = await api.post('/invitations', {
        event_id: eventId,
        talent_id: talentId,
        offered_price: offeredPrice,
      });
      return { success: true, data: result };
    } catch (err: any) {
      return { 
        success: false, 
        message: err?.data?.message || err?.message || 'Gagal mengirim undangan.' 
      };
    }
  };

  return {
    data,
    pagination,
    pending,
    error,
    refresh,
    respondToInvitation,
    inviteTalent,
  };
};
