<template>
  <div class="space-y-6">
    <!-- Welcome Card -->
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <p class="text-sm font-medium text-neutral-light/70">Selamat datang,</p>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">
            Admin CariTalent
          </h1>
          <p class="text-sm text-neutral-light/60">
            Kelola pengguna, talent, dan event dari satu panel.
          </p>
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <UiBadge label="Platform Admin" color="primary" variant="soft" dot />
          </div>
        </div>

        <div class="grid w-full gap-2 sm:max-w-xs">
          <UiButton
            v-for="action in quickActions"
            :key="action.label"
            :icon="action.icon"
            :color="action.color"
            variant="soft"
            class="justify-start"
            @click="goTo(action.to)"
          >
            {{ action.label }}
          </UiButton>
        </div>
      </div>
    </UiCard>

    <!-- Stats Grid -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatsCard
        v-for="stat in statsCards"
        :key="stat.title"
        :title="stat.title"
        :value="pending ? '...' : stat.value"
        :hint="stat.hint"
        :icon="stat.icon"
      />
    </section>

    <!-- Secondary Stats -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatsCard
        v-for="stat in statsCards2"
        :key="stat.title"
        :title="stat.title"
        :value="pending ? '...' : stat.value"
        :hint="stat.hint"
        :icon="stat.icon"
      />
    </section>

    <!-- Summary Cards -->
    <section class="grid gap-4 xl:grid-cols-3">
      <!-- Platform Health -->
      <UiCard title="Kesehatan Platform" description="Ringkasan status aktif" card-class="xl:col-span-1">
        <div class="space-y-3 pt-2">
          <div
            v-for="item in platformHealth"
            :key="item.label"
            class="flex items-center justify-between rounded-xl border border-white/8 bg-white/4 px-4 py-3"
          >
            <div class="flex items-center gap-3">
              <div class="rounded-lg border border-white/10 bg-white/5 p-1.5">
                <Icon :name="item.icon" class="h-4 w-4 text-accent" />
              </div>
              <span class="text-sm text-neutral-light/80">{{ item.label }}</span>
            </div>
            <span class="text-sm font-bold text-ui-light">{{ pending ? '...' : item.value }}</span>
          </div>
        </div>
      </UiCard>

      <!-- Quick Actions Panel -->
      <UiCard title="Aksi Cepat" description="Tugas admin yang umum" card-class="xl:col-span-2">
        <div class="grid gap-3 pt-2 sm:grid-cols-2">
          <button
            v-for="action in adminActions"
            :key="action.label"
            class="flex items-start gap-4 rounded-xl border border-white/10 bg-white/4 p-4 text-left transition-all hover:border-highlight/40 hover:bg-white/8"
            @click="goTo(action.to)"
          >
            <div class="rounded-xl border border-highlight/20 bg-highlight/10 p-2.5 text-accent shrink-0">
              <Icon :name="action.icon" class="h-5 w-5" />
            </div>
            <div>
              <p class="text-sm font-semibold text-ui-light">{{ action.label }}</p>
              <p class="mt-0.5 text-xs text-neutral-light/60">{{ action.description }}</p>
            </div>
          </button>
        </div>
      </UiCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue';
import { useAdminDashboard } from '~/composables/useAdminDashboard';

definePageMeta({
  layout: 'admin',
});

const pageTitle = useState('admin-layout-title');
pageTitle.value = 'Overview';

const { data: stats, pending } = useAdminDashboard();

const statsCards = computed(() => [
  {
    title: 'Total Pengguna',
    value: stats.value.total_users,
    hint: 'Semua akun terdaftar',
    icon: 'mdi:account-group-outline',
  },
  {
    title: 'Total Talent',
    value: stats.value.total_talents,
    hint: 'Seniman terdaftar',
    icon: 'mdi:music-note-outline',
  },
  {
    title: 'Event Organizer',
    value: stats.value.total_eo,
    hint: 'Penyelenggara event',
    icon: 'mdi:briefcase-outline',
  },
  {
    title: 'Total Event',
    value: stats.value.total_events,
    hint: 'Semua event di platform',
    icon: 'mdi:calendar-star-outline',
  },
]);

const statsCards2 = computed(() => [
  {
    title: 'Event Aktif',
    value: stats.value.active_events,
    hint: 'Event sedang berjalan / open',
    icon: 'mdi:calendar-clock-outline',
  },
  {
    title: 'Total Booking',
    value: stats.value.total_bookings,
    hint: 'Booking terbuat',
    icon: 'mdi:calendar-check-outline',
  },
  {
    title: 'Booking Selesai',
    value: stats.value.completed_bookings,
    hint: 'Event yang sudah terlaksana',
    icon: 'mdi:check-decagram-outline',
  },
  {
    title: 'Total Review',
    value: stats.value.total_reviews,
    hint: 'Ulasan oleh organizer',
    icon: 'mdi:star-circle-outline',
  },
]);

const platformHealth = computed(() => [
  { label: 'Event Berjalan', value: stats.value.active_events, icon: 'mdi:lightning-bolt' },
  { label: 'Booking Pending', value: stats.value.total_bookings - stats.value.completed_bookings, icon: 'mdi:clock-outline' },
  { label: 'Review Masuk', value: stats.value.total_reviews, icon: 'mdi:star-outline' },
]);

const quickActions = [
  { label: 'Kelola User', icon: 'mdi:account-group-outline', color: 'primary' as const, to: '/dashboard/admin/users' },
  { label: 'Verifikasi Talent', icon: 'mdi:music-note-outline', color: 'secondary' as const, to: '/dashboard/admin/talents' },
  { label: 'Moderasi Event', icon: 'mdi:calendar-star-outline', color: 'primary' as const, to: '/dashboard/admin/events' },
];

const adminActions = [
  {
    label: 'Manajemen User',
    description: 'Lihat dan kelola semua akun pengguna',
    icon: 'mdi:account-group-outline',
    to: '/dashboard/admin/users',
  },
  {
    label: 'Verifikasi Talent',
    description: 'Setujui atau cabut verifikasi talent',
    icon: 'mdi:music-note-outline',
    to: '/dashboard/admin/talents',
  },
  {
    label: 'Moderasi Event',
    description: 'Tinjau dan moderasi event aktif',
    icon: 'mdi:calendar-star-outline',
    to: '/dashboard/admin/events',
  },
  {
    label: 'Lihat Semua Event',
    description: 'Histori seluruh event di platform',
    icon: 'mdi:calendar-multiple-check',
    to: '/dashboard/admin/events',
  },
];

const goTo = async (to: string) => {
  await navigateTo(to);
};
</script>
