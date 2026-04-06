<template>
  <div class="space-y-6">
    <!-- Welcome Card -->
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-violet-500/12 via-white/5 to-fuchsia-500/12 shadow-md">
      <div class="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div class="space-y-3">
          <p class="text-sm font-medium text-neutral-light/70">Selamat datang kembali,</p>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent md:text-3xl">
            {{ userName }}
          </h1>
          <p class="text-sm text-neutral-light/60 max-w-sm">
            Kelola event, lihat pelamar, dan temukan talent terbaik untuk penampilan kamu.
          </p>
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

    <!-- Stats Cards -->
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <EoStatsCard
        v-for="stat in statsCards"
        :key="stat.title"
        :title="stat.title"
        :value="stat.value"
        :hint="stat.hint"
        :icon="stat.icon"
      />
    </section>

    <!-- Main content -->
    <section class="flex flex-col gap-4 xl:grid xl:grid-cols-3 xl:items-start">
      <!-- My Events (latest 3) -->
      <div class="min-w-0 space-y-4 xl:col-span-2">
        <EoEventList
          :events="latestEvents"
          :loading="eventsPending"
          :detailed="false"
          @view-applicants="(id) => navigateTo(`/dashboard/eo/events/${id}/applicants`)"
          @view-recommendations="(id) => navigateTo(`/dashboard/eo/events/${id}/recommendations`)"
          @edit="handleEditEvent"
          @cancel="handleCancelEvent"
        >
          <template #actions>
            <UiButton size="sm" color="primary" variant="soft" icon="mdi:arrow-right" @click="goTo('/dashboard/eo/events')">
              Lihat Semua
            </UiButton>
          </template>
        </EoEventList>
      </div>

      <!-- Bookings summary -->
      <div class="min-w-0 space-y-4">
        <EoBookingList
          :bookings="latestBookings"
          :loading="bookingsPending"
          :detailed="false"
          @complete="handleCompleteBooking"
          @cancel="handleCancelBooking"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import EoStatsCard from '~/components/eo/EoStatsCard.vue';
import EoEventList from '~/components/eo/EoEventList.vue';
import EoBookingList from '~/components/eo/EoBookingList.vue';
import { useEoEvents } from '~/composables/useEoEvents';
import { useEoBookings } from '~/composables/useEoBookings';

definePageMeta({
  layout: 'eo',
});

const pageTitle = useState('eo-layout-title');
const userName = useState('eo-layout-username');
pageTitle.value = 'Dashboard';

const toast = useToast();

const { data: events, pending: eventsPending } = useEoEvents();
const { data: bookings, pending: bookingsPending } = useEoBookings();

const latestEvents = computed(() => events.value.slice(0, 3));
const latestBookings = computed(() => bookings.value.slice(0, 3));

const statsCards = computed(() => [
  {
    title: 'Total Events',
    value: events.value.length,
    hint: 'Semua event yang dibuat',
    icon: 'mdi:calendar-star-outline',
  },
  {
    title: 'Active Events',
    value: events.value.filter((e) => e.status === 'open').length,
    hint: 'Event yang sedang buka lamaran',
    icon: 'mdi:calendar-check-outline',
  },
  {
    title: 'Total Bookings',
    value: bookings.value.length,
    hint: 'Booking terkonfirmasi & selesai',
    icon: 'mdi:handshake-outline',
  },
  {
    title: 'Completed',
    value: bookings.value.filter((b) => b.status === 'completed').length,
    hint: 'Booking yang telah selesai',
    icon: 'mdi:check-decagram-outline',
  },
]);

const quickActions = [
  { label: 'Buat Event Baru', icon: 'mdi:plus-circle-outline', color: 'primary' as const, to: '/dashboard/eo/events' },
  { label: 'Lihat Semua Event', icon: 'mdi:calendar-star-outline', color: 'secondary' as const, to: '/dashboard/eo/events' },
  { label: 'Kelola Bookings', icon: 'mdi:calendar-check-outline', color: 'primary' as const, to: '/dashboard/eo/bookings' },
] as const;

const goTo = async (to: string) => {
  await navigateTo(to);
};

const handleEditEvent = (id: number) => {
  toast.add({
    title: 'Edit Event',
    description: `Fitur edit event #${id} akan segera tersedia.`,
    color: 'info',
  });
};

const handleCancelEvent = (id: number) => {
  toast.add({
    title: 'Event dibatalkan',
    description: `Event #${id} berhasil dibatalkan (dummy).`,
    color: 'warning',
  });
};

const handleCompleteBooking = (id: number) => {
  toast.add({
    title: 'Booking selesai',
    description: `Booking #${id} ditandai selesai. Kamu bisa memberikan review sekarang.`,
    color: 'success',
  });
};

const handleCancelBooking = (id: number) => {
  toast.add({
    title: 'Booking dibatalkan',
    description: `Booking #${id} berhasil dibatalkan.`,
    color: 'warning',
  });
};
</script>
