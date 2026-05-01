import type { RecommendationsData, TalentRecommendation } from '~/composables/types';

export const useRecommendations = (eventId?: number) => {
  const api = useApiClient();

  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData(
    () => `recommendations-${eventId}`,
    async () => {
      if (!eventId) {
        return {
          success: false,
          message: 'Event ID is required',
          data: {
            event_id: 0,
            event_title: '',
            recommendations: [],
          },
        };
      }

      const result = await api.get<RecommendationsData>(`/events/${eventId}/recommendations`);
      return result;
    },
    {
      default: () => ({
        success: false,
        message: '',
        data: {
          event_id: 0,
          event_title: '',
          recommendations: [],
        },
      }),
      watch: [() => eventId],
    }
  );

  const data = computed<TalentRecommendation[]>(() => response.value?.data?.recommendations ?? []);
  const eventTitle = computed(() => response.value?.data?.event_title ?? '');

  return {
    data,
    eventTitle,
    pending,
    error,
    refresh,
  };
};
