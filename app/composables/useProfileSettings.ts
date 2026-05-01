import type { ApiResponse, TalentMedia, TalentMediaType } from '~/composables/types';

export const useProfileSettings = () => {
  const api = useApiClient();

  const updateProfile = async (payload: { name: string; phone: string }) => {
    const response = await api.put<{ name: string; phone: string }>('/users/profile', payload);
    return response;
  };

  const changePassword = async (payload: { current_password: string; new_password: string; new_password_confirmation: string }) => {
    const response = await api.put<null>('/users/password', payload);
    return response;
  };

  const uploadMedia = async (payload: { file: File; type: TalentMediaType }) => {
    // Get talent_id from profile
    const { data: profile } = useProfile();
    const talentId = profile.value?.talent_id;

    if (!talentId) {
      throw new Error('Talent ID not available');
    }

    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    formData.append('file', payload.file);
    formData.append('type', payload.type);

    // Use the API client with custom headers for multipart/form-data
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBase as string;
    const token = useCookie<string | null>('auth_token');

    const response = await $fetch<ApiResponse<TalentMedia>>(`/talents/${talentId}/media`, {
      baseURL,
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
      body: formData,
    });

    if (!response.success) {
      throw new Error(response.message || 'Upload failed');
    }

    return response;
  };

  const deleteMedia = async (talent_id: number, media_id: number) => {
    const response = await api.delete<null>(`/talents/${talent_id}/media/${media_id}`);
    return response;
  };

  return {
    updateProfile,
    changePassword,
    uploadMedia,
    deleteMedia,
  };
};
