import type { ApiResponse, TalentProfile } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const profilePayload: ApiResponse<TalentProfile> = {
  success: true,
  message: 'Talent profile fetched successfully',
  data: {
    id: 1,
    talent_id: 3,
    name: 'Budi Santoso',
    email: 'budi@email.com',
    phone: '081234567890',
    role: 'talent',
    stage_name: 'The Broken Strings',
    genre: ['Pop Punk', 'Alternative'],
    verified: true,
    average_rating: 4.5,
    media: [
      {
        id: 1,
        media_url: 'https://storage.caritalent.id/media/1.jpg',
        type: 'image',
      },
      {
        id: 2,
        media_url: 'https://storage.caritalent.id/media/2.mp4',
        type: 'video',
      },
    ],
  },
};

export const useProfile = () => useMockResource('talent-profile', profilePayload);
