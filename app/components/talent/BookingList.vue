<template>
  <UiCard id="bookings" title="Upcoming Bookings" description="Jadwal booking event terdekat" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 2" :key="n" class="h-24 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada booking terjadwal.">
      <template #item="{ item }">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ item.date }} • {{ item.venue }}</p>
          </div>
          <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" />
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { Booking, BookingStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    bookings: Booking[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const { formatDate } = useFormatters();

const statusMap: Record<BookingStatus, { label: string; color: string }> = {
  confirmed: { label: 'Confirmed', color: 'success' },
  completed: { label: 'Completed', color: 'primary' },
};

const mappedItems = computed(() =>
  props.bookings.map((booking) => ({
    id: booking.id,
    title: booking.event.title,
    date: formatDate(booking.event.event_date),
    venue: booking.event.venue_name,
    statusLabel: statusMap[booking.status].label,
    statusColor: statusMap[booking.status].color,
  })),
);
</script>
