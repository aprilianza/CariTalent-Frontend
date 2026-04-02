<template>
  <UiCard id="events" title="Open Events" :description="detailed ? 'Daftar event sesuai API spec dengan status, budget, genre, dan lokasi lengkap' : 'Ringkasan event terbaru'" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="`event-skeleton-${n}`" class="h-20 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada event tersedia.">
      <template #item="{ item }">
        <div class="space-y-3">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0">
              <p class="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ item.organizer }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" />
              <UiBadge :label="item.budget" color="primary" variant="outline" />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span
              >Jadwal: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.eventDate }}</span></span
            >
            <span
              >Lokasi: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.location }}</span></span
            >
          </div>

          <p v-if="detailed" class="text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
            {{ item.description }}
          </p>

          <div v-if="detailed" class="flex flex-wrap items-center gap-2">
            <UiBadge v-for="genre in item.genres" :key="`${item.id}-${genre}`" :label="genre" color="secondary" variant="soft" />
          </div>

          <div class="flex justify-end">
            <UiButton size="sm" color="primary" :variant="item.canApply ? 'soft' : 'outline'" :loading="item.isApplying" :disabled="!item.canApply" @click="emit('apply', Number(item.id))">
              {{ item.applyLabel }}
            </UiButton>
          </div>
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { Event } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    events: Event[];
    loading?: boolean;
    detailed?: boolean;
    appliedEventIds?: number[];
    applyingEventIds?: number[];
  }>(),
  {
    loading: false,
    detailed: true,
    appliedEventIds: () => [],
    applyingEventIds: () => [],
  },
);

const emit = defineEmits<{
  apply: [eventId: number];
}>();

const { formatCurrency, formatDate } = useFormatters();

const statusMeta: Record<Event['status'], { label: string; color: 'success' | 'warning' | 'error' | 'neutral' | 'primary' }> = {
  draft: { label: 'Draft', color: 'neutral' },
  open: { label: 'Open', color: 'success' },
  closed: { label: 'Closed', color: 'warning' },
  completed: { label: 'Completed', color: 'primary' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

const mappedItems = computed(() =>
  props.events.map((event) => {
    const status = statusMeta[event.status] ?? { label: event.status, color: 'neutral' as const };
    const alreadyApplied = props.appliedEventIds.includes(event.id);
    const isApplying = props.applyingEventIds.includes(event.id);
    const canApply = event.status === 'open' && !alreadyApplied && !isApplying;

    let applyLabel = 'Melamar';
    if (alreadyApplied) {
      applyLabel = 'Sudah Dilamar';
    } else if (event.status !== 'open') {
      applyLabel = 'Event Ditutup';
    } else if (isApplying) {
      applyLabel = 'Memproses...';
    }

    return {
      id: event.id,
      title: event.title,
      organizer: event.organizer_name ? `Organizer: ${event.organizer_name}` : 'Organizer: -',
      description: event.description || 'Deskripsi event belum tersedia.',
      genres: event.genre_needed && event.genre_needed.length > 0 ? event.genre_needed : ['General'],
      budget: formatCurrency(event.budget),
      eventDate: formatDateSafe(event.event_date),
      location: [event.venue_name, event.city].filter(Boolean).join(' • '),
      statusLabel: status.label,
      statusColor: status.color,
      canApply,
      isApplying,
      applyLabel,
    };
  }),
);

const formatDateSafe = (value: string) => {
  if (!value) {
    return '-';
  }

  try {
    return formatDate(value);
  } catch {
    return value;
  }
};
</script>
