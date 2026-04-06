<template>
  <UiCard
    title="My Events"
    :description="detailed ? 'Semua event yang kamu buat — kelola status, pelamar, dan rekomendasi talent' : 'Ringkasan event terbaru'"
    card-class="h-full"
  >
    <template #header>
      <div class="flex items-start justify-between gap-3 px-5 pt-5 pb-3">
        <div class="space-y-1">
          <h3 class="text-base font-semibold text-ui-light">My Events</h3>
          <p class="text-sm text-neutral-light/70">
            {{ detailed ? 'Semua event yang kamu buat — kelola status, pelamar, dan rekomendasi talent' : 'Ringkasan event terbaru' }}
          </p>
        </div>
        <slot name="actions" />
      </div>
    </template>

    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="`event-skeleton-${n}`" class="h-24 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada event yang dibuat. Buat event pertamamu!">
      <template #item="{ item }">
        <div class="space-y-3">
          <!-- Title row -->
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                {{ item.eventDate }} · {{ item.venue }}
              </p>
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-2">
              <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" />
              <UiBadge :label="item.budget" color="primary" variant="outline" />
            </div>
          </div>

          <!-- Meta row -->
          <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span class="flex items-center gap-1">
              <Icon name="mdi:account-group-outline" class="h-3.5 w-3.5" />
              {{ item.applicantsLabel }}
            </span>
            <span class="flex items-center gap-1">
              <Icon name="mdi:map-marker-outline" class="h-3.5 w-3.5" />
              {{ item.city }}
            </span>
          </div>

          <!-- Genre badges -->
          <div v-if="detailed && item.genres.length" class="flex flex-wrap gap-1.5">
            <UiBadge
              v-for="genre in item.genres"
              :key="`${item.id}-${genre}`"
              :label="genre"
              color="secondary"
              variant="soft"
              size="sm"
            />
          </div>

          <!-- Action buttons -->
          <div class="flex flex-wrap gap-2">
            <UiButton
              size="sm"
              color="primary"
              variant="soft"
              icon="mdi:account-multiple-outline"
              @click="emit('view-applicants', Number(item.id))"
            >
              Pelamar ({{ item.totalApplicants }})
            </UiButton>
            <UiButton
              size="sm"
              color="secondary"
              variant="soft"
              icon="mdi:star-shooting-outline"
              @click="emit('view-recommendations', Number(item.id))"
            >
              Rekomendasi
            </UiButton>
            <UiButton
              v-if="item.canEdit"
              size="sm"
              color="neutral"
              variant="outline"
              icon="mdi:pencil-outline"
              @click="emit('edit', Number(item.id))"
            >
              Edit
            </UiButton>
            <UiButton
              v-if="item.canCancel"
              size="sm"
              color="error"
              variant="ghost"
              icon="mdi:close-circle-outline"
              @click="emit('cancel', Number(item.id))"
            >
              Batalkan
            </UiButton>
          </div>
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { EoEvent } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    events: EoEvent[];
    loading?: boolean;
    detailed?: boolean;
  }>(),
  {
    loading: false,
    detailed: true,
  },
);

const emit = defineEmits<{
  'view-applicants': [eventId: number];
  'view-recommendations': [eventId: number];
  edit: [eventId: number];
  cancel: [eventId: number];
}>();

const { formatCurrency, formatDate } = useFormatters();

const statusMeta: Record<EoEvent['status'], { label: string; color: 'success' | 'warning' | 'error' | 'neutral' | 'primary' }> = {
  draft: { label: 'Draft', color: 'neutral' },
  open: { label: 'Open', color: 'success' },
  closed: { label: 'Closed', color: 'warning' },
  completed: { label: 'Completed', color: 'primary' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

const formatDateSafe = (value?: string) => {
  if (!value) return '-';
  try {
    return formatDate(value);
  } catch {
    return value;
  }
};

const mappedItems = computed(() =>
  props.events.map((event) => {
    const status = statusMeta[event.status] ?? { label: event.status, color: 'neutral' as const };
    const canEdit = event.status !== 'completed' && event.status !== 'cancelled';
    const canCancel = event.status !== 'completed' && event.status !== 'cancelled';

    return {
      id: event.id,
      title: event.title,
      eventDate: formatDateSafe(event.event_date),
      venue: event.venue_name,
      city: event.city || '-',
      budget: formatCurrency(event.budget),
      genres: event.genre_needed ?? [],
      totalApplicants: event.total_applicants ?? 0,
      applicantsLabel: `${event.total_applicants ?? 0} pelamar`,
      statusLabel: status.label,
      statusColor: status.color,
      canEdit,
      canCancel,
    };
  }),
);
</script>
