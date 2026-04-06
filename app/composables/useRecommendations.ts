import type { ApiResponse, RecommendationsData, TalentRecommendation } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const recommendationsPayload: ApiResponse<RecommendationsData> = {
  success: true,
  message: 'OK',
  data: {
    event_id: 1,
    event_title: 'Punk Night Vol. 3',
    recommendations: [
      {
        rank: 1,
        score: 100,
        score_breakdown: { genre_score: 50, budget_score: 30, location_score: 20 },
        talent: {
          id: 3,
          stage_name: 'The Broken Strings',
          genre: ['Pop Punk', 'Alternative'],
          city: 'Bandung',
          verified: true,
          average_rating: 4.5,
        },
      },
      {
        rank: 2,
        score: 80,
        score_breakdown: { genre_score: 50, budget_score: 30, location_score: 0 },
        talent: {
          id: 7,
          stage_name: 'Riot Kids',
          genre: ['Pop Punk'],
          city: 'Jakarta',
          verified: true,
          average_rating: 4.2,
        },
      },
      {
        rank: 3,
        score: 70,
        score_breakdown: { genre_score: 50, budget_score: 0, location_score: 20 },
        talent: {
          id: 15,
          stage_name: 'Rebel Riff',
          genre: ['Hardcore', 'Pop Punk'],
          city: 'Bandung',
          verified: true,
          average_rating: 4.0,
        },
      },
      {
        rank: 4,
        score: 50,
        score_breakdown: { genre_score: 50, budget_score: 0, location_score: 0 },
        talent: {
          id: 22,
          stage_name: 'Night Voltage',
          genre: ['Pop Punk'],
          city: 'Surabaya',
          verified: false,
          average_rating: 3.8,
        },
      },
      {
        rank: 5,
        score: 30,
        score_breakdown: { genre_score: 0, budget_score: 30, location_score: 0 },
        talent: {
          id: 30,
          stage_name: 'The Static Crow',
          genre: ['Indie', 'Alternative'],
          city: 'Yogyakarta',
          verified: true,
          average_rating: 4.1,
        },
      },
    ],
  },
};

export const useRecommendations = (eventId?: number) => {
  const key = `eo-recommendations-${eventId ?? 'default'}`;
  const resource = useMockResource<RecommendationsData>(key, recommendationsPayload);

  return {
    ...resource,
    data: computed<TalentRecommendation[]>(() => resource.data.value.recommendations),
    eventTitle: computed(() => resource.data.value.event_title),
  };
};
