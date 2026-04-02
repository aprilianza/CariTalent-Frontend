<template>
  <UiCard title="Recent Applications" :description="detailed ? 'Riwayat lamaran event dengan detail status, lokasi, dan harga' : 'Ringkasan lamaran event terbaru'" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="n" class="h-20 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada lamaran terbaru.">
      <template #item="{ item }">
        <div class="space-y-3">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ item.subtitle }}</p>
              <p class="mt-1 text-xs font-medium text-primary">{{ item.meta }}</p>
            </div>
            <UiBadge class="shrink-0" :label="item.statusLabel" :color="item.statusColor" variant="soft" />
          </div>

          <div v-if="detailed" class="grid gap-2 text-xs text-neutral-600 dark:text-neutral-300 md:grid-cols-2">
            <p>
              Jadwal event: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.eventDate }}</span>
            </p>
            <p>
              Venue: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.venue }}</span>
            </p>
            <p>
              Kota: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.city }}</span>
            </p>
            <p>
              Sumber: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.sourceLabel }}</span>
            </p>
            <p>
              Koordinat: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.coordinates }}</span>
            </p>
            <p>
              Dikirim: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.createdAt }}</span>
            </p>
          </div>
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { Application, ApplicationStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    applications: Application[];
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

const statusMap: Record<ApplicationStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

const sourceMap = {
  apply: 'Apply langsung',
  invitation: 'Invitation',
} as const;

const statusSubtitleMap: Record<ApplicationStatus, string> = {
  pending: 'Menunggu respons organizer',
  accepted: 'Lamaran diterima organizer',
  rejected: 'Lamaran ditolak organizer',
};

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
  props.applications.map((application) => ({
    id: application.id,
    title: application.event.title,
    subtitle: statusSubtitleMap[application.status],
    meta: `Harga tawaran: ${formatCurrency(application.proposed_price)}`,
    eventDate: formatDateSafe(application.event.event_date),
    venue: application.event.venue_name || '-',
    city: application.event.city || '-',
    sourceLabel: application.source ? sourceMap[application.source] : '-',
    coordinates: formatCoordinates(application.event.latitude, application.event.longitude),
    createdAt: formatDateSafe(application.created_at),
    statusLabel: statusMap[application.status].label,
    statusColor: statusMap[application.status].color,
  })),
);
</script>
