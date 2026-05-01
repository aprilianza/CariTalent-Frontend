import type { TalentReviewsData, PaginationMeta } from '~/composables/types';

export interface TalentReviewsFilters {
  page?: number;
  per_page?: number;
}

export const useTalentReviews = (talentId: Ref<number | null> | number | null, filters?: TalentReviewsFilters) => {
  const api = useApiClient();

  // Convert talentId to a ref if it's not already
  const talentIdRef = isRef(talentId) ? talentId : ref(talentId);

  // Build query parameters
  const queryParams: Record<string, any> = {};
  if (filters?.page) queryParams.page = filters.page;
  if (filters?.per_page) queryParams.per_page = filters.per_page;

  // Create dynamic cache key
  const filterKey = JSON.stringify(queryParams);
  const cacheKey = () => `talent-reviews-${talentIdRef.value}-${filterKey}`;

  // Default empty data structure
  const defaultData: TalentReviewsData = {
    talent_id: 0,
    stage_name: '',
    average_rating: 0,
    total_reviews: 0,
    reviews: [],
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 0,
      last_page: 1,
    },
  };

  // Use useAsyncData with conditional execution based on talent_id availability
  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData(
    cacheKey,
    async () => {
      // Only fetch if talent_id is available
      if (!talentIdRef.value) {
        return {
          success: true,
          message: 'Waiting for talent ID',
          data: defaultData,
        };
      }

      try {
        const result = await api.get<TalentReviewsData>(`/talents/${talentIdRef.value}/reviews`, queryParams);
        return result;
      } catch (err: any) {
        throw err;
      }
    },
    {
      lazy: false,
      server: true,
      default: () => ({
        success: false,
        message: '',
        data: defaultData,
      }),
      // Watch talent_id and refetch when it changes
      watch: [talentIdRef],
    },
  );

  // Transform data for easier consumption
  const data = computed(() => response.value?.data?.reviews ?? []);

  const meta = computed(() => ({
    talentId: response.value?.data?.talent_id ?? 0,
    stageName: response.value?.data?.stage_name ?? '',
    averageRating: response.value?.data?.average_rating ?? 0,
    totalReviews: response.value?.data?.total_reviews ?? 0,
  }));

  const pagination = computed<PaginationMeta | undefined>(() => response.value?.data?.pagination);

  return {
    data,
    meta,
    pagination,
    pending,
    error,
    refresh,
  };
};
