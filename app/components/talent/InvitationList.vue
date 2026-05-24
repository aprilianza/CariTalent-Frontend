<template>
  <UiCard id="invitations" title="Invitations" :description="detailed ? 'Detail undangan event, harga offer, dan informasi organizer' : 'Ringkasan undangan event masuk'" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 2" :key="n" class="h-24 w-full rounded-xl" />
    </div>

    <UiList v-else :items="displayedItems" :list-class="listClass" empty-text="Belum ada undangan masuk.">
      <template #item="{ item }">
        <div class="space-y-3">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Organizer: {{ item.organizer }}</p>
              <p class="mt-1 text-xs font-medium text-primary">Offer: {{ item.offer }}</p>
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
              Budget event: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.budget }}</span>
            </p>
            <p>
              Dikirim: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.createdAt }}</span>
            </p>
            <div class="md:col-span-2 flex justify-start">
              <UiButton v-if="item.hasLocation" size="xs" color="secondary" variant="soft" icon="mdi:map-marker-outline" @click="handleViewLocation(item.latitude, item.longitude)"> Lihat Lokasi </UiButton>
            </div>
          </div>

          <div v-if="detailed && item.isPending" class="flex flex-wrap gap-2">
            <UiButton size="sm" color="success" variant="soft" @click="emit('accept', item.id as number)"> Terima </UiButton>
            <UiButton size="sm" color="error" variant="soft" @click="emit('reject', item.id as number)"> Tolak </UiButton>
          </div>
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { Invitation, InvitationStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    invitations: Invitation[];
    loading?: boolean;
    detailed?: boolean;
  }>(),
  {
    loading: false,
    detailed: true,
  },
);

const detailed = computed(() => props.detailed);
const listClass = computed(() => (detailed.value ? '' : 'max-h-[26rem] overflow-y-auto pr-1'));

const emit = defineEmits<{
  accept: [id: number];
  reject: [id: number];
}>();

const { formatCurrency, formatDate } = useFormatters();

const openGoogleMaps = (latitude?: number, longitude?: number) => {
  if (latitude === undefined || longitude === undefined) {
    return;
  }

  window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank', 'noopener,noreferrer');
};

const statusMap: Record<InvitationStatus, { label: string; color: string }> = {
  pending: { label: 'Menunggu', color: 'warning' },
  accepted: { label: 'Diterima', color: 'success' },
  rejected: { label: 'Ditolak', color: 'error' },
};

const formatDateSafe = (value?: string) => {
  if (!value) {
    return '-';
  }

  return formatDate(value);
};

const mappedItems = computed(() =>
  props.invitations.map((invitation) => ({
    id: invitation.id,
    title: invitation.event.title,
    organizer: invitation.organizer_name,
    offer: formatCurrency(invitation.offered_price),
    eventDate: formatDateSafe(invitation.event.event_date),
    venue: invitation.event.venue_name || '-',
    city: invitation.event.city || '-',
    budget: invitation.event.budget ? formatCurrency(invitation.event.budget) : '-',
    latitude: invitation.event.latitude,
    longitude: invitation.event.longitude,
    hasLocation: invitation.event.latitude !== undefined && invitation.event.longitude !== undefined,
    createdAt: formatDateSafe(invitation.created_at),
    isPending: invitation.status === 'pending',
    statusLabel: statusMap[invitation.status].label,
    statusColor: statusMap[invitation.status].color,
  })),
);

const displayedItems = computed(() => {
  if (detailed.value) {
    return mappedItems.value;
  }

  return mappedItems.value.slice(0, 3);
});

const handleViewLocation = (latitude?: number, longitude?: number) => {
  openGoogleMaps(latitude, longitude);
};
</script>
