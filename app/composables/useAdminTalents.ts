import type { AdminTalent, AdminTalentsData, ApiResponse } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const talentsPayload: ApiResponse<AdminTalentsData> = {
  success: true,
  message: 'OK',
  data: {
    talents: [
      {
        id: 1,
        user_id: 1,
        stage_name: 'The Broken Strings',
        genre: ['Pop Punk', 'Alternative'],
        price_min: 500000,
        price_max: 2000000,
        city: 'Bandung',
        bio: 'Band pop punk asal Bandung dengan 5 tahun pengalaman.',
        verified: true,
        average_rating: 4.5,
        total_reviews: 12,
      },
      {
        id: 2,
        user_id: 3,
        stage_name: 'Riot Kids',
        genre: ['Pop Punk'],
        price_min: 800000,
        price_max: 2500000,
        city: 'Jakarta',
        bio: 'Energetik dan penuh semangat, siap panggung.',
        verified: true,
        average_rating: 4.2,
        total_reviews: 8,
      },
      {
        id: 3,
        user_id: 5,
        stage_name: 'Ayu Pratiwi',
        genre: ['Solo Singer', 'Jazz'],
        price_min: 1000000,
        price_max: 3000000,
        city: 'Surabaya',
        bio: 'Penyanyi solo dengan suara memesona.',
        verified: false,
        average_rating: 0,
        total_reviews: 0,
      },
      {
        id: 4,
        user_id: 7,
        stage_name: 'Dimas Akustik',
        genre: ['Acoustic', 'Folk'],
        price_min: 600000,
        price_max: 1800000,
        city: 'Yogyakarta',
        bio: 'Akustik folk yang intimate dan menyentuh.',
        verified: false,
        average_rating: 0,
        total_reviews: 0,
      },
      {
        id: 5,
        user_id: 9,
        stage_name: 'DJ Volta',
        genre: ['DJ', 'Electronic'],
        price_min: 1500000,
        price_max: 5000000,
        city: 'Bali',
        bio: 'DJ dengan pengalaman 7 tahun di berbagai festival.',
        verified: true,
        average_rating: 4.8,
        total_reviews: 25,
      },
      {
        id: 6,
        user_id: 11,
        stage_name: 'Street Vibes Crew',
        genre: ['Street Performer', 'Hip-Hop'],
        price_min: 300000,
        price_max: 1000000,
        city: 'Bandung',
        bio: 'Kolektif seniman jalanan yang keren.',
        verified: false,
        average_rating: 0,
        total_reviews: 0,
      },
    ],
    pagination: {
      current_page: 1,
      per_page: 15,
      total: 6,
      last_page: 1,
    },
  },
};

export const useAdminTalents = () => {
  const resource = useMockResource<AdminTalentsData>('admin-talents', talentsPayload);
  const talents = ref<AdminTalent[]>([]);

  watch(
    resource.data,
    (value) => {
      talents.value = value.talents.map((t) => ({ ...t }));
    },
    { immediate: true },
  );

  const verifyTalent = (id: number, verified: boolean) => {
    const idx = talents.value.findIndex((t) => t.id === id);
    if (idx !== -1) {
      talents.value[idx] = { ...talents.value[idx]!, verified };
    }
  };

  return {
    ...resource,
    talents,
    verifyTalent,
    pagination: computed(() => resource.data.value.pagination),
  };
};
