import type { ApiResponse, TalentReviewsData } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const reviewsPayload: ApiResponse<TalentReviewsData> = {
  success: true,
  message: 'Talent reviews fetched successfully',
  data: {
    talent_id: 3,
    stage_name: 'The Broken Strings',
    average_rating: 4.5,
    total_reviews: 12,
    reviews: [
      {
        id: 8,
        organizer_name: 'Kafe Kota',
        event_title: 'Punk Night Vol. 3',
        rating: 5,
        comment: 'The Broken Strings tampil luar biasa, penonton sangat antusias. Sangat profesional dan tepat waktu.',
        created_at: '2026-04-16T10:00:00Z',
      },
      {
        id: 9,
        organizer_name: 'Bandung Creative Space',
        event_title: 'Alternative Friday Session',
        rating: 4,
        comment: 'Performance rapi dan energi panggung bagus. Komunikasi saat persiapan juga cepat.',
        created_at: '2026-04-02T20:00:00Z',
      },
      {
        id: 10,
        organizer_name: 'Jakarta Music Hall',
        event_title: 'Indie Summer Showcase',
        rating: 5,
        comment: 'Setlist sangat cocok dengan audiens, teknis soundcheck lancar, dan tampil sangat solid.',
        created_at: '2026-03-22T18:30:00Z',
      },
    ],
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 3,
      last_page: 1,
    },
  },
};

export const useTalentReviews = () => {
  const resource = useMockResource('talent-reviews', reviewsPayload);

  return {
    ...resource,
    data: computed(() => resource.data.value.reviews),
    meta: computed(() => ({
      talentId: resource.data.value.talent_id,
      stageName: resource.data.value.stage_name,
      averageRating: resource.data.value.average_rating,
      totalReviews: resource.data.value.total_reviews,
      pagination: resource.data.value.pagination,
    })),
  };
};
