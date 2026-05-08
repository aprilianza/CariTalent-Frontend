import type { ApiResponse, TalentProfile } from '~/composables/types';
import { ApiError } from '~/utils/api-client';

export const useProfile = () => {
  const api = useApiClient();

  const normalizeGenres = (talentData: any) => {
    const rawGenres = talentData?.genres ?? talentData?.genre ?? [];
    const genreNames = Array.isArray(rawGenres)
      ? rawGenres
          .map((genre) => (typeof genre === 'string' ? genre : genre?.name))
          .filter((genre): genre is string => Boolean(genre))
      : [];
    const genreIds = Array.isArray(rawGenres)
      ? rawGenres
          .map((genre) => (typeof genre === 'object' ? Number(genre?.id) : undefined))
          .filter((id): id is number => Number.isFinite(id))
      : [];

    return { genreNames, genreIds };
  };

  const {
    data: response,
    pending,
    error,
    refresh,
  } = useAsyncData<TalentProfile>(
    'talent-profile',
    async () => {
      // Step 1: Get current user data
      const userResponse = await api.get<any>('/auth/me');
      const userData = userResponse.data;

      let talentData: any = null;

      try {
        const talentResponse = await api.get<any>('/talents/my');
        talentData = talentResponse.data;
      } catch (error) {
        if (!(error instanceof ApiError && error.statusCode === 404)) {
          throw error;
        }
      }

      const { genreNames, genreIds } = normalizeGenres(talentData);

      // Step 3: Combine both responses into TalentProfile
      const profile: TalentProfile = {
        id: talentData?.id ?? userData.id,
        talent_id: talentData?.id,
        user_id: talentData?.user_id ?? userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        stage_name: talentData?.stage_name ?? userData.name ?? '',
        genre: genreNames,
        genre_ids: genreIds,
        price_min: talentData?.price_min,
        price_max: talentData?.price_max,
        city: talentData?.city,
        bio: talentData?.bio,
        portfolio_link: talentData?.portfolio_link,
        verified: Boolean(talentData?.verified),
        average_rating: Number(talentData?.average_rating ?? 0),
        total_reviews: Number(talentData?.total_reviews ?? 0),
        media: talentData?.media || [],
      };

      return profile;
    },
    {
      default: () => ({
        id: 0,
        stage_name: '',
        genre: [],
        verified: false,
        average_rating: 0,
      }),
    },
  );

  return {
    data: response,
    pending,
    error,
    refresh,
  };
};
