<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="space-y-3">
        <p class="text-sm font-medium text-neutral-light/70">Talent Workspace</p>
        <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">Profile Settings</h1>
        <p class="text-sm text-neutral-light/80">Kelola profil, password, dan media portofolio.</p>
      </div>
    </UiCard>

    <UiCard>
      <template #header>
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="space-y-1">
            <h3 class="text-base font-semibold text-ui-light">Profile Overview</h3>
            <p class="text-sm text-neutral-light/70">Ringkasan data profil aktif.</p>
          </div>

          <div class="flex items-center gap-2">
            <UiButton v-if="isEditingOverview" color="neutral" variant="ghost" size="sm" @click="cancelOverviewEdit">Batal</UiButton>
            <UiButton :color="isEditingOverview ? 'primary' : 'secondary'" variant="soft" size="sm" :loading="isSavingOverview" @click="isEditingOverview ? handleUpdateOverview() : toggleOverviewEdit()">
              {{ isEditingOverview ? 'Simpan' : 'Edit' }}
            </UiButton>
          </div>
        </div>
      </template>

      <div v-if="pending" class="space-y-3">
        <USkeleton class="h-6 w-1/3 rounded-lg" />
        <USkeleton class="h-20 w-full rounded-xl" />
      </div>

      <form v-else-if="isEditingOverview" class="space-y-5" @submit.prevent="handleUpdateOverview">
        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Name" required class="w-full">
            <UInput v-model="profileForm.name" size="lg" placeholder="Masukkan nama lengkap" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>

          <UFormField label="Phone" required class="w-full">
            <UInput v-model="profileForm.phone" size="lg" placeholder="08xxxxxxxxxx" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Stage Name" required class="w-full">
            <UInput v-model="talentForm.stage_name" size="lg" placeholder="Nama panggung" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>

          <UFormField label="City" class="w-full">
            <UInput v-model="talentForm.city" size="lg" placeholder="Bandung" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <UFormField label="Price Min" class="w-full">
            <UInput v-model="talentForm.price_min" type="number" size="lg" placeholder="500000" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>

          <UFormField label="Price Max" class="w-full">
            <UInput v-model="talentForm.price_max" type="number" size="lg" placeholder="2000000" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
          </UFormField>
        </div>

        <UFormField label="Genres" class="w-full">
          <USelectMenu v-model="selectedTalentGenreIds" :items="genreOptions" multiple value-key="value" placeholder="Pilih genre" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
        </UFormField>

        <UFormField label="Portfolio Link" class="w-full">
          <UInput v-model="talentForm.portfolio_link" size="lg" placeholder="https://..." class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
        </UFormField>

        <UFormField label="Bio" class="w-full">
          <UTextarea v-model="talentForm.bio" :rows="4" placeholder="Ceritakan profil talent..." class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
        </UFormField>

        <div class="flex justify-end">
          <UiButton type="submit" color="primary" :loading="isSavingOverview">Simpan Perubahan</UiButton>
        </div>
      </form>

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

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">City</p>
            <p class="mt-1 text-base font-semibold text-ui-light">{{ profile.city || '-' }}</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Portfolio</p>
            <p class="mt-1 truncate text-base font-semibold text-ui-light">{{ profile.portfolio_link || '-' }}</p>
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Price Min</p>
            <p class="mt-1 text-base font-semibold text-ui-light">{{ profile.price_min ? formatCurrency(profile.price_min) : '-' }}</p>
          </div>
          <div class="rounded-xl border border-white/10 bg-white/5 p-4">
            <p class="text-xs uppercase tracking-wide text-neutral-light/70">Price Max</p>
            <p class="mt-1 text-base font-semibold text-ui-light">{{ profile.price_max ? formatCurrency(profile.price_max) : '-' }}</p>
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
            <p class="mt-2 text-lg font-semibold text-ui-light">{{ averageRatingLabel }}</p>
          </div>
        </div>

        <div class="rounded-xl border border-white/10 bg-white/5 p-4">
          <p class="text-xs uppercase tracking-wide text-neutral-light/70">Bio</p>
          <p class="mt-2 text-sm leading-relaxed text-neutral-light/80">{{ profile.bio || '-' }}</p>
        </div>
      </div>
    </UiCard>

    <section class="grid gap-5">
      <UiCard title="Change Password" description="Ubah password akunmu dengan aman." card-class="h-full">
        <form class="flex h-full flex-col gap-5" @submit.prevent="handleChangePassword">
          <div class="grid gap-4">
            <UFormField label="Current Password" required class="w-full">
              <UInput v-model="passwordForm.current_password" type="password" size="lg" placeholder="Password saat ini" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
            </UFormField>

            <UFormField label="New Password" required class="w-full">
              <UInput v-model="passwordForm.new_password" type="password" size="lg" placeholder="Password baru" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
            </UFormField>

            <UFormField label="Confirm New Password" required class="w-full">
              <UInput v-model="passwordForm.new_password_confirmation" type="password" size="lg" placeholder="Konfirmasi password baru" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
            </UFormField>
          </div>

          <UiButton type="submit" color="secondary" block class="mt-auto" :loading="isChangingPassword">Update Password</UiButton>
        </form>
      </UiCard>
    </section>

    <UiCard title="Portfolio Media" description="Kelola media portofoliomu dari satu tempat.">
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
import { useTalentReviews } from '~/composables/useTalentReviews';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Profile';

const toast = useToast();
const { formatCurrency } = useFormatters();

const { data: profile, pending, refresh: refreshProfile } = useProfile();
const talentId = computed(() => profile.value?.talent_id ?? null);
const { meta: reviewMeta, pending: reviewPending, error: reviewError } = useTalentReviews({ page: 1, per_page: 1 });
const { updateProfile, updateTalentProfile, changePassword, uploadMedia, deleteMedia } = useProfileSettings();

const profileForm = reactive({
  name: '',
  phone: '',
});

const talentForm = reactive({
  stage_name: '',
  price_min: '',
  price_max: '',
  city: '',
  bio: '',
  portfolio_link: '',
});

const selectedTalentGenreIds = ref<number[]>([]);

const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

const uploadForm = reactive<{ file: File | null; type: TalentMediaType }>({
  file: null,
  type: 'image',
});

const mediaList = ref<TalentMedia[]>([]);

const isEditingOverview = ref(false);
const isSavingOverview = ref(false);
const isChangingPassword = ref(false);
const isUploadingMedia = ref(false);
const deletingMediaId = ref<number | null>(null);

const mediaTypeOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
];

const { data: genres } = useGenres();

const genreOptions = computed(() => genres.value.map((genre) => ({ label: genre.name, value: genre.id })));

const averageRatingLabel = computed(() => {
  if (pending.value && reviewPending.value) {
    return '-';
  }

  const ratingSource = reviewPending.value || reviewError.value ? profile.value.average_rating : reviewMeta.value.averageRating;
  const rating = Number(ratingSource);

  if (!Number.isFinite(rating)) {
    return '-';
  }

  return `${rating.toFixed(1)} / 5`;
});

const syncOverviewForm = () => {
  const value = profile.value;
  profileForm.name = value.name || '';
  profileForm.phone = value.phone || '';
  talentForm.stage_name = value.stage_name || '';
  talentForm.price_min = value.price_min ? String(value.price_min) : '';
  talentForm.price_max = value.price_max ? String(value.price_max) : '';
  talentForm.city = value.city || '';
  talentForm.bio = value.bio || '';
  talentForm.portfolio_link = value.portfolio_link || '';
  selectedTalentGenreIds.value = value.genre_ids?.length ? [...value.genre_ids] : value.genre.map((genreName) => genres.value.find((genre) => genre.name === genreName)?.id).filter((id): id is number => Boolean(id));
};

watch(
  profile,
  () => {
    syncOverviewForm();
    mediaList.value = profile.value.media ? profile.value.media.map((item) => ({ ...item })) : [];
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
  uploadForm.file = file || null;
};

const toggleOverviewEdit = () => {
  syncOverviewForm();
  isEditingOverview.value = true;
};

const cancelOverviewEdit = () => {
  syncOverviewForm();
  isEditingOverview.value = false;
};

const handleUpdateOverview = async () => {
  if (!talentId.value) {
    toast.add({
      title: 'Profil talent belum tersedia',
      description: 'Backend belum mengirim data talent untuk akun ini.',
      color: 'warning',
    });
    return;
  }

  if (!profileForm.name.trim() || !profileForm.phone.trim()) {
    toast.add({
      title: 'Data belum lengkap',
      description: 'Name dan phone wajib diisi.',
      color: 'warning',
    });
    return;
  }

  if (!talentForm.stage_name.trim()) {
    toast.add({
      title: 'Data belum lengkap',
      description: 'Stage name wajib diisi.',
      color: 'warning',
    });
    return;
  }

  isSavingOverview.value = true;

  try {
    await updateProfile({
      name: profileForm.name.trim(),
      phone: profileForm.phone.trim(),
    });

    const response = await updateTalentProfile(talentId.value, {
      stage_name: talentForm.stage_name.trim(),
      price_min: talentForm.price_min ? Number(talentForm.price_min) : undefined,
      price_max: talentForm.price_max ? Number(talentForm.price_max) : undefined,
      city: talentForm.city.trim() || undefined,
      bio: talentForm.bio.trim() || undefined,
      portfolio_link: talentForm.portfolio_link.trim() || undefined,
      genre_ids: selectedTalentGenreIds.value,
    });

    await refreshProfile();
    isEditingOverview.value = false;

    toast.add({
      title: 'Profile updated',
      description: response.message,
      color: 'success',
    });
  } catch (error) {
    toast.add({
      title: 'Update gagal',
      description: error instanceof Error ? error.message : 'Terjadi kendala saat memperbarui profil.',
      color: 'error',
    });
  } finally {
    isSavingOverview.value = false;
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
  if (!uploadForm.file) {
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
      file: uploadForm.file,
      type: uploadForm.type,
    });

    mediaList.value = [response.data, ...mediaList.value];

    // Refresh profile data from server
    await refreshProfile();

    uploadForm.file = null;

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
    const talentId = profile.value.talent_id || profile.value.id;
    const response = await deleteMedia(talentId, mediaId);

    mediaList.value = mediaList.value.filter((item) => item.id !== mediaId);

    // Refresh profile data from server
    await refreshProfile();

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
