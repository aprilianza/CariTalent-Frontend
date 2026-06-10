<template>
  <div class="space-y-6">
    <!-- Error Alert for Debugging -->
    <UAlert v-if="error" color="red" variant="soft" title="API Error" :description="error.message || String(error)" class="mb-4" />

    <!-- Welcome Card -->
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="space-y-2">
          <p class="text-sm font-medium text-neutral-light/70">Selamat datang,</p>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">
            {{ user?.name || 'Admin CariTalent' }}
          </h1>
          <p class="text-sm text-neutral-light/60">
            Kelola pengguna, talent, dan event dari satu panel.
          </p>
        </div>
      </div>
    </UiCard>

    <!-- Unified Stats Grid -->
    <section class="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <AdminStatsCard
        v-for="stat in allStats"
        :key="stat.title"
        :title="stat.title"
        :value="pending ? '...' : stat.value"
        :hint="stat.hint"
        :icon="stat.icon"
        :color-class="stat.colorClass"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import AdminStatsCard from '~/components/admin/AdminStatsCard.vue';
import { useAdminDashboard } from '~/composables/useAdminDashboard';
import { useAuth } from '~/composables/useAuth';

definePageMeta({
  layout: 'admin',
});

const pageTitle = useState('admin-layout-title');
pageTitle.value = 'Ringkasan';

const { user } = useAuth();
const { data: stats, pending, error } = useAdminDashboard();

const allStats = computed(() => [
  {
    title: 'Total Pengguna',
    value: stats.value.total_users,
    hint: 'Semua akun yang terdaftar',
    icon: 'mdi:account-group',
    colorClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  {
    title: 'Total Talent',
    value: stats.value.total_talents,
    hint: 'Seniman / performer terdaftar',
    icon: 'mdi:music-clef-treble',
    colorClass: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  },
  {
    title: 'Event Organizer',
    value: stats.value.total_eo,
    hint: 'Penyelenggara event aktif',
    icon: 'mdi:domain',
    colorClass: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  },
  {
    title: 'Total Event',
    value: stats.value.total_events,
    hint: 'Semua event di dalam platform',
    icon: 'mdi:calendar-star',
    colorClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    title: 'Event Aktif',
    value: stats.value.active_events,
    hint: 'Event yang sedang berjalan',
    icon: 'mdi:calendar-clock',
    colorClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  },
  {
    title: 'Total Booking',
    value: stats.value.total_bookings,
    hint: 'Keseluruhan booking yang dibuat',
    icon: 'mdi:book-check-outline',
    colorClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    title: 'Booking Selesai',
    value: stats.value.completed_bookings,
    hint: 'Booking yang telah terlaksana',
    icon: 'mdi:check-decagram',
    colorClass: 'text-green-400 bg-green-500/10 border-green-500/20',
  },
  {
    title: 'Total Review',
    value: stats.value.total_reviews,
    hint: 'Ulasan diberikan oleh organizer',
    icon: 'mdi:star-circle',
    colorClass: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  },
]);
</script>
