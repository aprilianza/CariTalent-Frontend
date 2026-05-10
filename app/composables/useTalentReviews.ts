import type { TalentReviewsData, PaginationMeta } from '~/composables/types';

export interface TalentReviewsFilters {
  page?: number;
  per_page?: number;
}

export const useTalentReviews = (filters?: MaybeRef<TalentReviewsFilters | undefined>) => {
  const api = useApiClient();

  const queryParams = computed<Record<string, any>>(() => {
    const activeFilters = unref(filters);
    const params: Record<string, any> = {};

    if (activeFilters?.page) params.page = activeFilters.page;
    if (activeFilters?.per_page) params.per_page = activeFilters.per_page;

    return params;
  });

  // Create dynamic cache key
  const filterKey = computed(() => JSON.stringify(queryParams.value));
  const cacheKey = computed(() => `my-reviews-${filterKey.value}`);

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

  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData(
    cacheKey,
    async () => {
      try {
        const result = await api.get<TalentReviewsData>('/reviews/my', queryParams.value);
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
      watch: [queryParams],
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
