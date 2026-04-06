import type { ApiResponse, GenresData, Genre } from '~/composables/types';
import { useMockResource } from '~/composables/useMockResource';

const genresPayload: ApiResponse<GenresData> = {
  success: true,
  message: 'OK',
  data: {
    genres: [
      { id: 1, name: 'Pop Punk' },
      { id: 2, name: 'Heavy Metal' },
      { id: 3, name: 'DJ' },
      { id: 4, name: 'Solo Singer' },
      { id: 5, name: 'Hardcore' },
      { id: 6, name: 'Jazz' },
      { id: 7, name: 'Seniman Visual' },
      { id: 8, name: 'Street Performer' },
      { id: 9, name: 'Alternative' },
      { id: 10, name: 'Acoustic' },
      { id: 11, name: 'Folk' },
      { id: 12, name: 'Indie' },
      { id: 13, name: 'Soul' },
      { id: 14, name: 'Rock' },
    ],
  },
};

export const useGenres = () => {
  const resource = useMockResource<GenresData>('genres', genresPayload);

  return {
    ...resource,
    data: computed<Genre[]>(() => resource.data.value.genres),
  };
};
