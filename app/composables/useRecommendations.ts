import type { ApiResponse, RecommendationsData, TalentRecommendation } from '~/composables/types';

export const useRecommendations = (eventId?: number) => {
  const { $api } = useNuxtApp();
  const key = `eo-recommendations-${eventId ?? 'default'}`;
  
  const { data: response, pending, error, refresh } = useAsyncData<ApiResponse<RecommendationsData>>(
    key,
    () => $api(`/events/${eventId}/recommendations`),
    {
      immediate: !!eventId,
    }
  );

  return {
    response,
    pending,
    error,
    refresh,
    data: computed<TalentRecommendation[]>(() => response.value?.data?.recommendations || []),
    eventTitle: computed(() => response.value?.data?.event_title || ''),
  };
};
