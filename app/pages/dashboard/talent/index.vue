<template>
  <div class="space-y-6">
    <!-- Welcome Card with Theme Colors -->
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="space-y-3" id="profile">
          <p class="text-sm font-medium text-neutral-light/70">Selamat datang kembali,</p>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">
            {{ profile?.stage_name || 'Talent User' }}
          </h1>
          <div class="flex flex-wrap items-center gap-2">
            <UiBadge v-for="genre in profile?.genre || []" :key="genre" :label="genre" color="success" variant="outline" />
            <UiBadge v-if="profile?.verified" label="Verified Talent" color="success" variant="soft" dot />
          </div>
        </div>

        <div class="grid w-full gap-2 sm:max-w-xs">
          <UiButton v-for="action in quickActions" :key="action.label" :icon="action.icon" :color="action.color" variant="soft" class="justify-start" @click="goTo(action.to)">
            {{ action.label }}
          </UiButton>
        </div>
      </div>
    </UiCard>

    <!-- Stats Cards Section -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <TalentStatsCard v-for="stat in statsCards" :key="stat.title" :title="stat.title" :value="stat.value" :hint="stat.hint" :icon="stat.icon" />
    </section>

    <!-- Main Content Section -->
    <section class="grid gap-4 xl:grid-cols-2 xl:items-start">
      <div class="min-w-0 xl:h-[25rem]" id="bookings">
        <BookingList :bookings="bookings" :loading="bookingsPending" :detailed="false" />
      </div>

      <div class="min-w-0 xl:h-[25rem]">
        <InvitationList :invitations="invitations" :loading="invitationsPending" :detailed="false" @accept="handleInvitation('accept', $event)" @reject="handleInvitation('reject', $event)" />
      </div>

      <div class="min-w-0 xl:col-span-2 xl:h-[23rem]" id="applications">
        <ApplicationList :applications="applications" :loading="applicationsPending" :detailed="false" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import ApplicationList from '~/components/talent/ApplicationList.vue';
import BookingList from '~/components/talent/BookingList.vue';
import InvitationList from '~/components/talent/InvitationList.vue';
import TalentStatsCard from '~/components/talent/TalentStatsCard.vue';
import type { Invitation } from '~/composables/types';
import { useApplications } from '~/composables/useApplications';
import { useBookings } from '~/composables/useBookings';
import { useInvitations } from '~/composables/useInvitations';
import { useProfile } from '~/composables/useProfile';
import { useTalentReviews } from '~/composables/useTalentReviews';

definePageMeta({
  layout: 'talent',
});

const toast = useToast();

const { data: profile, pending: profilePending } = useProfile();
const { meta: reviewMeta, pending: reviewPending, error: reviewError } = useTalentReviews({ page: 1, per_page: 1 });
const { data: applications, pending: applicationsPending } = useApplications();
const { data: bookings, pending: bookingsPending } = useBookings();
const { data: invitationsRaw, pending: invitationsPending, respondToInvitation } = useInvitations();

const invitations = ref<Invitation[]>([]);

watch(
  invitationsRaw,
  (value) => {
    invitations.value = value.map((item) => ({ ...item }));
  },
  { immediate: true },
);

const averageRatingLabel = computed(() => {
  if (profilePending.value && reviewPending.value) {
    return '-';
  }

  const ratingSource = reviewPending.value || reviewError.value ? profile.value.average_rating : reviewMeta.value.averageRating;
  const rating = Number(ratingSource);

  if (!Number.isFinite(rating)) {
    return '-';
  }

  return `${rating.toFixed(1)} / 5`;
});

const statsCards = computed(() => [
  {
    title: 'Total Lamaran',
    value: applications.value.length,
    hint: 'Lamaran yang sudah dikirim',
    icon: 'mdi:file-document-multiple-outline',
  },
  {
    title: 'Total Undangan',
    value: invitations.value.length,
    hint: 'Undangan dari organizer',
    icon: 'mdi:email-fast-outline',
  },
  {
    title: 'Total Booking',
    value: bookings.value.length,
    hint: 'Booking terkonfirmasi dan selesai',
    icon: 'mdi:calendar-check-outline',
  },
  {
    title: 'Rating Rata-rata',
    value: averageRatingLabel.value,
    hint: 'Berdasarkan perform terakhir',
    icon: 'mdi:star-circle-outline',
  },
]);

const quickActions = [
  {
    label: 'Edit Profil',
    icon: 'mdi:account-edit-outline',
    color: 'primary',
    to: '/dashboard/talent/profile',
  },
  {
    label: 'Lihat Undangan',
    icon: 'mdi:folder-multiple-image',
    color: 'secondary',
    to: '/dashboard/talent/invitations',
  },
  {
    label: 'Cari Event',
    icon: 'mdi:compass-outline',
    color: 'primary',
    to: '/dashboard/talent/events',
  },
] as const;

const goTo = async (to: string) => {
  await navigateTo(to);
};

const handleInvitation = async (action: 'accept' | 'reject', invitationId: number) => {
  const invitationIndex = invitations.value.findIndex((item) => item.id === invitationId);
  const current = invitations.value[invitationIndex];

  if (!current) {
    return;
  }

  try {
    const status = action === 'accept' ? 'accepted' : 'rejected';
    await respondToInvitation(invitationId, status);

    toast.add({
      title: action === 'accept' ? 'Undangan diterima' : 'Undangan ditolak',
      description: `${current.event.title} telah berhasil ${action === 'accept' ? 'diterima' : 'ditolak'}.`,
      color: action === 'accept' ? 'success' : 'error',
    });
  } catch (error: any) {
    toast.add({
      title: 'Aksi gagal',
      description: error.message || 'Gagal menanggapi undangan',
      color: 'error',
    });
  }
};
</script>
