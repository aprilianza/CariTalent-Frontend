import type { ApiResponse, TalentProfile } from '~/composables/types';
import { ApiError } from '~/utils/api-client';

export const useProfile = () => {
  const api = useApiClient();

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

      // Step 2: Get talent profile data using user_id or talent_id
      // The API spec shows that /auth/me returns user data with id
      // We need to call /talents/{id} to get the full talent profile
      const talentId = userData.id;
      let talentData: any = null;

      try {
        const talentResponse = await api.get<any>(`/talents/${talentId}`);
        talentData = talentResponse.data;
      } catch (error) {
        if (!(error instanceof ApiError && error.statusCode === 404)) {
          throw error;
        }
      }

      // Step 3: Combine both responses into TalentProfile
      const profile: TalentProfile = {
        id: talentData?.id ?? userData.id,
        talent_id: talentData?.id ?? userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        stage_name: talentData?.stage_name ?? userData.name ?? '',
        genre: talentData?.genre ?? [],
        verified: Boolean(talentData?.verified),
        average_rating: Number(talentData?.average_rating ?? 0),
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
