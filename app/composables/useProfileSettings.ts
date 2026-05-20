import type { TalentProfile, UpdateTalentProfilePayload } from '~/composables/types';

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

  const updateTalentProfile = async (talentId: number, payload: UpdateTalentProfilePayload) => {
    const response = await api.put<TalentProfile>(`/talents/${talentId}`, payload);
    return response;
  };

  return {
    updateProfile,
    updateTalentProfile,
    changePassword,
  };
};
