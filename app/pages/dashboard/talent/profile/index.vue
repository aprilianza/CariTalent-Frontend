<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="space-y-3">
        <p class="text-sm font-medium text-neutral-light/70">Talent Workspace</p>
        <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">Profile Settings</h1>
        <p class="text-sm text-neutral-light/80">Kelola profil, password, dan media portofolio sesuai API spec user dan talent profile.</p>
      </div>
    </UiCard>

    <UiCard title="Profile Overview" description="Ringkasan data profil aktif.">
      <div v-if="pending" class="space-y-3">
        <USkeleton class="h-6 w-1/3 rounded-lg" />
        <USkeleton class="h-20 w-full rounded-xl" />
      </div>

      <div v-else class="space-y-5">
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Name</p>
            <p class="mt-1 text-base font-semibold text-ui-light">{{ profile.name || '-' }}</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Phone</p>
            <p class="mt-1 text-base font-semibold text-ui-light">{{ profile.phone || '-' }}</p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Stage Name</p>
            <p class="mt-1 text-base font-semibold text-ui-light">{{ profile.stage_name }}</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Email</p>
            <p class="mt-1 text-base font-semibold text-ui-light">{{ profile.email || '-' }}</p>
          </div>
        </div>

        <div>
          <p class="text-xs uppercase tracking-wide text-neutral-light/70">Genres</p>
          <div class="mt-2 flex flex-wrap gap-2">
            <UiBadge v-for="genre in profile.genre" :key="genre" :label="genre" color="secondary" variant="soft" />
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Verification</p>
            <UiBadge class="mt-2" :label="profile.verified ? 'Verified' : 'Unverified'" :color="profile.verified ? 'success' : 'warning'" variant="soft" />
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Average Rating</p>
            <p class="mt-2 text-lg font-semibold text-ui-light">{{ profile.average_rating.toFixed(1) }} / 5</p>
          </div>
        </div>
      </div>
    </UiCard>

    <section class="grid gap-4 xl:grid-cols-2">
      <UiCard title="Update Profile" description="Implementasi endpoint PUT /users/profile.">
        <form class="space-y-4" @submit.prevent="handleUpdateProfile">
          <UFormField label="Name" required>
            <UInput v-model="profileForm.name" placeholder="Masukkan nama lengkap" :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>

          <UFormField label="Phone" required>
            <UInput v-model="profileForm.phone" placeholder="08xxxxxxxxxx" :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>

          <UiButton type="submit" color="primary" :loading="isSavingProfile">Simpan Perubahan</UiButton>
        </form>
      </UiCard>

      <UiCard title="Change Password" description="Implementasi endpoint PUT /users/password.">
        <form class="space-y-4" @submit.prevent="handleChangePassword">
          <UFormField label="Current Password" required>
            <UInput v-model="passwordForm.current_password" type="password" placeholder="Password saat ini" :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>

          <UFormField label="New Password" required>
            <UInput v-model="passwordForm.new_password" type="password" placeholder="Password baru" :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>

          <UFormField label="Confirm New Password" required>
            <UInput v-model="passwordForm.new_password_confirmation" type="password" placeholder="Konfirmasi password baru" :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>

          <UiButton type="submit" color="secondary" :loading="isChangingPassword">Update Password</UiButton>
        </form>
      </UiCard>
    </section>

    <UiCard title="Portfolio Media" description="Implementasi endpoint POST /talents/{id}/media dan DELETE /talents/{talent_id}/media/{media_id}.">
      <div class="space-y-5">
        <form class="grid gap-4 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-[1fr_180px_auto] md:items-end" @submit.prevent="handleUploadMedia">
          <UFormField label="Media File" required>
            <input
              type="file"
              class="w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 text-sm text-ui-light file:mr-3 file:rounded-md file:border-0 file:bg-highlight/20 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-accent"
              accept="image/*,video/*,audio/*"
              @change="handleFileChange"
            />
          </UFormField>

          <UFormField label="Type" required>
            <USelect v-model="uploadForm.type" :items="mediaTypeOptions" />
          </UFormField>

          <UiButton type="submit" color="primary" :loading="isUploadingMedia">Upload</UiButton>
        </form>

        <UiList :items="mediaItems" empty-text="Belum ada media portofolio.">
          <template #item="{ item }">
            <div class="flex flex-wrap items-start justify-between gap-3">
              <div class="min-w-0 flex-1">
                <p class="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.url }}</p>
                <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">ID: {{ item.id }}</p>
              </div>
              <div class="flex items-center gap-2">
                <UiBadge :label="item.type" color="secondary" variant="soft" />
                <UiButton size="xs" color="error" variant="soft" :loading="deletingMediaId === Number(item.id)" @click="handleDeleteMedia(Number(item.id))"> Delete </UiButton>
              </div>
            </div>
          </template>
        </UiList>
      </div>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { TalentMedia, TalentMediaType } from '~/composables/types';
import { useProfile } from '~/composables/useProfile';
import { useProfileSettings } from '~/composables/useProfileSettings';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Profile';

const toast = useToast();

const { data: profile, response: profileResponse, pending } = useProfile();
const { updateProfile, changePassword, uploadMedia, deleteMedia } = useProfileSettings();

const profileForm = reactive({
  name: '',
  phone: '',
});

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

const uploadForm = reactive<{ fileName: string; type: TalentMediaType }>({
  fileName: '',
  type: 'image',
});

const mediaList = ref<TalentMedia[]>([]);

const isSavingProfile = ref(false);
const isChangingPassword = ref(false);
const isUploadingMedia = ref(false);
const deletingMediaId = ref<number | null>(null);

const mediaTypeOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
];

watch(
  profile,
  (value) => {
    profileForm.name = value.name || '';
    profileForm.phone = value.phone || '';
    mediaList.value = value.media ? value.media.map((item) => ({ ...item })) : [];
  },
  { immediate: true },
);

const mediaItems = computed(() =>
  mediaList.value.map((media) => ({
    id: media.id,
    title: media.media_url,
    type: media.type.toUpperCase(),
    url: media.media_url,
  })),
);

const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  uploadForm.fileName = file?.name || '';
};

const handleUpdateProfile = async () => {
  if (!profileForm.name.trim() || !profileForm.phone.trim()) {
    toast.add({
      title: 'Data belum lengkap',
      description: 'Name dan phone wajib diisi.',
      color: 'warning',
    });
    return;
  }

  isSavingProfile.value = true;

  try {
    const response = await updateProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
    });

    if (profileResponse.value?.data) {
      profileResponse.value.data = {
        ...profileResponse.value.data,
        name: response.data.name,
        phone: response.data.phone,
      };
    }

    toast.add({
      title: 'Profile updated',
      description: response.message,
      color: 'success',
    });
  } catch {
    toast.add({
      title: 'Update gagal',
      description: 'Terjadi kendala saat memperbarui profil.',
      color: 'error',
    });
  } finally {
    isSavingProfile.value = false;
  }
};

const handleChangePassword = async () => {
  if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.new_password_confirmation) {
    toast.add({
      title: 'Data belum lengkap',
      description: 'Semua field password wajib diisi.',
      color: 'warning',
    });
    return;
  }

  isChangingPassword.value = true;

  try {
    const response = await changePassword({ ...passwordForm });

    passwordForm.current_password = '';
    passwordForm.new_password = '';
    passwordForm.new_password_confirmation = '';

    toast.add({
      title: 'Password updated',
      description: response.message,
      color: 'success',
    });
  } catch (error) {
    toast.add({
      title: 'Password gagal diubah',
      description: error instanceof Error ? error.message : 'Terjadi kendala saat mengubah password.',
      color: 'error',
    });
  } finally {
    isChangingPassword.value = false;
  }
};

const handleUploadMedia = async () => {
  if (!uploadForm.fileName) {
    toast.add({
      title: 'File belum dipilih',
      description: 'Pilih file sebelum upload media.',
      color: 'warning',
    });
    return;
  }

  isUploadingMedia.value = true;

  try {
    const response = await uploadMedia({
      talentId: profile.value.talent_id || profile.value.id,
      fileName: uploadForm.fileName,
      type: uploadForm.type,
    });

    mediaList.value = [response.data, ...mediaList.value];
    if (profileResponse.value?.data) {
      profileResponse.value.data = {
        ...profileResponse.value.data,
        media: mediaList.value as any, // Ignore strict typing here
      };
    }

    uploadForm.fileName = '';

    toast.add({
      title: 'Media uploaded',
      description: response.message,
      color: 'success',
    });
  } catch {
    toast.add({
      title: 'Upload gagal',
      description: 'Terjadi kendala saat upload media.',
      color: 'error',
    });
  } finally {
    isUploadingMedia.value = false;
  }
};

const handleDeleteMedia = async (mediaId: number) => {
  deletingMediaId.value = mediaId;

  try {
    const response = await deleteMedia({
      talentId: profile.value.talent_id || profile.value.id,
      mediaId,
    });

    mediaList.value = mediaList.value.filter((item) => item.id !== mediaId);
    if (profileResponse.value?.data) {
      profileResponse.value.data = {
        ...profileResponse.value.data,
        media: mediaList.value as any, // Ignore strict typing here
      };
    }

    toast.add({
      title: 'Media deleted',
      description: response.message,
      color: 'success',
    });
  } catch {
    toast.add({
      title: 'Delete gagal',
      description: 'Terjadi kendala saat menghapus media.',
      color: 'error',
    });
  } finally {
    deletingMediaId.value = null;
  }
};
</script>
