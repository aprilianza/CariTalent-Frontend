<template>
  <UiCard id="bookings" title="Upcoming Bookings" :description="detailed ? 'Detail booking event, harga deal, dan metadata jadwal' : 'Ringkasan jadwal booking terdekat'" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 2" :key="n" class="h-24 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada booking terjadwal.">
      <template #item="{ item }">
        <div class="space-y-3">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ item.date }} • {{ item.venue }}</p>
            </div>
            <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" />
          </div>

          <div v-if="detailed" class="grid gap-2 text-xs text-neutral-600 dark:text-neutral-300 md:grid-cols-2">
            <p>
              Harga deal: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.agreedPrice }}</span>
            </p>
            <p>
              Sumber: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.sourceLabel }}</span>
            </p>
            <p>
              Koordinat: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.coordinates }}</span>
            </p>
            <p>
              Dibuat: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.createdAt }}</span>
            </p>
          </div>
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
    detailed?: boolean;
  }>(),
  {
    loading: false,
    detailed: true,
  },
);

const detailed = computed(() => props.detailed);

const { formatCurrency, formatDate } = useFormatters();

const statusMap: Record<BookingStatus, { label: string; color: string }> = {
  confirmed: { label: 'Confirmed', color: 'success' },
  completed: { label: 'Completed', color: 'primary' },
};

const sourceMap = {
  apply: 'Apply langsung',
  invitation: 'Dari invitation',
} as const;

const formatDateSafe = (value?: string) => {
  if (!value) {
    return '-';
  }

  return formatDate(value);
};

const formatCoordinates = (latitude?: number, longitude?: number) => {
  if (latitude === undefined || longitude === undefined) {
    return '-';
  }

  return `${latitude}, ${longitude}`;
};

const mappedItems = computed(() =>
  props.bookings.map((booking) => ({
    id: booking.id,
    title: booking.event.title,
    date: formatDateSafe(booking.event.event_date),
    venue: booking.event.venue_name,
    agreedPrice: booking.agreed_price ? formatCurrency(booking.agreed_price) : '-',
    sourceLabel: booking.source ? sourceMap[booking.source] : '-',
    coordinates: formatCoordinates(booking.event.latitude, booking.event.longitude),
    createdAt: formatDateSafe(booking.created_at),
    statusLabel: statusMap[booking.status].label,
    statusColor: statusMap[booking.status].color,
  })),
);
</script>
