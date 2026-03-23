import type { ApiResponse, TalentProfile } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const profilePayload: ApiResponse<TalentProfile> = {
  success: true,
  message: 'Talent profile fetched successfully',
  data: {
    id: 1,
    stage_name: 'The Broken Strings',
    genre: ['Pop Punk', 'Alternative'],
    verified: true,
    average_rating: 4.5,
  },
};

export const useProfile = () => useMockResource('talent-profile', profilePayload);
