import type { ApiResponse, TalentMedia, TalentMediaType } from '~/composables/types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useProfileSettings = () => {
  const updateProfile = async (payload: { name: string; phone: string }) => {
    await wait(360);

    const response: ApiResponse<{ name: string; phone: string }> = {
      success: true,
      message: 'Profil berhasil diperbarui',
      data: {
        name: payload.name,
        phone: payload.phone,
      },
    };

    return response;
  };

  const changePassword = async (payload: { current_password: string; new_password: string; new_password_confirmation: string }) => {
    await wait(360);

    if (payload.new_password !== payload.new_password_confirmation) {
      throw new Error('Konfirmasi password baru tidak cocok.');
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Password berhasil diubah',
      data: null,
    };

    return response;
  };

  const uploadMedia = async (payload: { talentId: number; fileName: string; type: TalentMediaType }) => {
    await wait(400);

    const media: TalentMedia = {
      id: Date.now(),
      media_url: `https://storage.caritalent.id/media/${encodeURIComponent(payload.fileName)}`,
      type: payload.type,
    };

    const response: ApiResponse<TalentMedia> = {
      success: true,
      message: 'Media berhasil diunggah',
      data: media,
    };

    return response;
  };

  const deleteMedia = async (payload: { talentId: number; mediaId: number }) => {
    await wait(300);

    const response: ApiResponse<null> = {
      success: true,
      message: 'Media berhasil dihapus',
      data: null,
    };

    return response;
  };

  return {
    updateProfile,
    changePassword,
    uploadMedia,
    deleteMedia,
  };
};
