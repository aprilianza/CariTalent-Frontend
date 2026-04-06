<template>
  <UiCard
    title="Bookings"
    :description="detailed ? 'Detail booking event beserta talent, harga deal, dan status' : 'Ringkasan booking terkini'"
    card-class="h-full"
  >
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="`booking-skeleton-${n}`" class="h-24 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada booking.">
      <template #item="{ item }">
        <div class="space-y-3">
          <!-- Header row -->
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.eventTitle }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ item.eventDate }} · {{ item.venue }}</p>
            </div>
            <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" />
          </div>

          <!-- Talent & price info -->
          <div v-if="detailed" class="grid gap-2 text-xs text-neutral-600 dark:text-neutral-300 sm:grid-cols-2">
            <p>Talent: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.talentName }}</span></p>
            <p>Harga Deal: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.agreedPrice }}</span></p>
            <p>Sumber: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.sourceLabel }}</span></p>
            <p>Dibuat: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.createdAt }}</span></p>
          </div>

          <!-- Actions -->
          <div v-if="item.canComplete || item.canCancel" class="flex flex-wrap gap-2">
            <UiButton
              v-if="item.canComplete"
              size="sm"
              color="primary"
              variant="soft"
              icon="mdi:check-circle-outline"
              :loading="completingId === item.rawId"
              @click="emit('complete', item.rawId)"
            >
              Tandai Selesai
            </UiButton>
            <UiButton
              v-if="item.canCancel"
              size="sm"
              color="error"
              variant="ghost"
              icon="mdi:close-circle-outline"
              @click="emit('cancel', item.rawId)"
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
import type { EoBooking, BookingStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    bookings: EoBooking[];
    loading?: boolean;
    detailed?: boolean;
    completingId?: number | null;
  }>(),
  {
    loading: false,
    detailed: true,
    completingId: null,
  },
);

const emit = defineEmits<{
  complete: [bookingId: number];
  cancel: [bookingId: number];
}>();

const { formatCurrency, formatDate } = useFormatters();
const detailed = computed(() => props.detailed);
const completingId = computed(() => props.completingId);

const statusMap: Record<BookingStatus, { label: string; color: 'success' | 'primary' }> = {
  confirmed: { label: 'Confirmed', color: 'success' },
  completed: { label: 'Completed', color: 'primary' },
};

const sourceMap = { apply: 'Apply Langsung', invitation: 'Via Invitation' } as const;

const formatDateSafe = (value?: string) => {
  if (!value) return '-';
  try { return formatDate(value); } catch { return value; }
};

const mappedItems = computed(() =>
  props.bookings.map((b) => {
    const status = statusMap[b.status];
    return {
      id: String(b.id),
      rawId: b.id,
      eventTitle: b.event.title,
      eventDate: formatDateSafe(b.event.event_date),
      venue: b.event.venue_name,
      talentName: b.talent.stage_name,
      agreedPrice: formatCurrency(b.agreed_price),
      sourceLabel: b.source ? sourceMap[b.source] : '-',
      createdAt: formatDateSafe(b.created_at),
      statusLabel: status.label,
      statusColor: status.color,
      canComplete: b.status === 'confirmed',
      canCancel: b.status === 'confirmed',
    };
  }),
);
</script>
