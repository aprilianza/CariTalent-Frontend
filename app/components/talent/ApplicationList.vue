<template>
  <UiCard title="Lamaran Terbaru" :description="detailed ? 'Riwayat lamaran event dengan detail status, lokasi, dan harga' : 'Ringkasan lamaran event terbaru'" card-class="h-full">
    <!-- Skeleton loader when loading is true -->
    <div v-if="loading" class="space-y-3 mt-4">
      <USkeleton v-for="n in 3" :key="`app-skeleton-${n}`" class="h-16 w-full rounded-xl" />
    </div>

    <!-- Empty state when no applications available -->
    <div v-else-if="displayedItems.length === 0" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-neutral-light/50 mt-4">
      <Icon name="mdi:calendar-blank-outline" class="mx-auto h-12 w-12 text-neutral-light/30 animate-pulse" />
      <p class="mt-3 font-medium">Belum ada lamaran terbaru saat ini.</p>
    </div>

    <!-- Simple vertical list (Max 3) for home dashboard summary -->
    <div v-else-if="!detailed" class="mt-4 flex flex-col divide-y divide-white/5">
      <div v-for="item in displayedItems" :key="item.id" class="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-neutral-200 truncate">{{ item.title }}</p>
          <p class="mt-1 text-xs text-neutral-light/50 truncate">
            {{ item.eventDate }} • {{ item.venue }} • <span class="text-violet-400 font-semibold">{{ item.meta }}</span>
          </p>
        </div>
        <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" class="shrink-0 font-bold tracking-wide" />
      </div>
    </div>

    <!-- Grid rendering of Full Premium Application Cards (detailed mode) -->
    <div v-else class="mt-4 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="item in displayedItems"
        :key="item.id"
        class="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-violet-500/5"
      >
        <!-- Card glowing overlay -->
        <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl transition-opacity duration-300 group-hover:bg-violet-500/10 pointer-events-none" />
        
        <div class="relative z-10 flex flex-col h-full justify-between gap-4">
          <!-- Top Row: Badges / Info -->
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-3">
              <!-- Proposed Price -->
              <div class="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1 border border-violet-500/20 text-violet-300 text-xs font-semibold">
                <Icon name="mdi:cash-usd-outline" class="h-3.5 w-3.5" />
                <span>{{ item.meta }}</span>
              </div>
              
              <!-- Status Badge -->
              <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" class="font-bold tracking-wide shrink-0" />
            </div>

            <!-- Event Title -->
            <h3 class="font-display text-base font-bold text-neutral-50 dark:text-neutral-100 group-hover:text-violet-300 transition-colors line-clamp-1">
              {{ item.title }}
            </h3>
            
            <!-- Subtitle -->
            <p class="text-xs text-neutral-light/60 font-medium">
              {{ item.subtitle }}
            </p>

            <!-- Date and Location info -->
            <div class="space-y-2 mt-3">
              <div class="flex items-center gap-2 text-xs text-neutral-light/75">
                <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-violet-400">
                  <Icon name="mdi:calendar-range-outline" class="h-3.5 w-3.5" />
                </div>
                <div class="min-w-0">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Jadwal Acara</p>
                  <p class="truncate font-medium text-neutral-200">{{ item.eventDate }}</p>
                </div>
              </div>

              <div class="flex items-center gap-2 text-xs text-neutral-light/75">
                <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] text-violet-400">
                  <Icon name="mdi:map-marker-outline" class="h-3.5 w-3.5" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Lokasi Venue</p>
                  <p class="truncate font-medium text-neutral-200">{{ item.venue }} • {{ item.city }}</p>
                </div>
                <button
                  v-if="item.hasLocation"
                  type="button"
                  class="ml-2 text-violet-400 hover:text-violet-300 text-xs hover:underline flex items-center gap-0.5 shrink-0"
                  @click="handleViewLocation(item.latitude, item.longitude, item)"
                >
                  <span class="text-[11px]">Peta</span>
                  <Icon name="mdi:launch" class="h-3 w-3" />
                </button>
              </div>
              
              <!-- Source & Date Created if detailed is true -->
              <div v-if="detailed" class="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-white/[0.06] text-[11px] text-neutral-light/50">
                <div>
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Sumber</p>
                  <p class="font-medium text-neutral-300">{{ item.sourceLabel }}</p>
                </div>
                <div>
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Dikirim</p>
                  <p class="font-medium text-neutral-300">{{ item.createdAt }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Actions -->
          <div v-if="detailed && item.canCancel" class="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
            <UiButton
              size="sm"
              color="error"
              variant="soft"
              @click="emit('cancel', Number(item.id))"
              class="rounded-xl px-4 font-semibold tracking-wide"
            >
              Batalkan Lamaran
            </UiButton>
          </div>
        </div>
      </div>
    </div>

    <!-- Map Preview Modal -->
    <EoLocationModal 
      v-model:open="locationModalOpen"
      v-bind="selectedLocation"
    />
  </UiCard>
</template>

<script setup lang="ts">
import type { Application, ApplicationStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';
import EoLocationModal from '~/components/eo/EoLocationModal.vue';

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

const emit = defineEmits<{
  cancel: [id: number];
}>();

const { formatCurrency, formatDate } = useFormatters();

const statusMap: Record<ApplicationStatus, { label: string; color: 'success' | 'warning' | 'error' | 'neutral' | 'primary' }> = {
  pending: { label: 'Menunggu', color: 'warning' },
  accepted: { label: 'Diterima', color: 'success' },
  rejected: { label: 'Ditolak', color: 'error' },
};

const sourceMap = {
  apply: 'Lamar langsung',
  invitation: 'Via Undangan',
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

const mappedItems = computed(() =>
  props.applications.map((application) => {
    const status = statusMap[application.status] ?? { label: application.status, color: 'neutral' as const };
    return {
      id: application.id,
      title: application.event.title,
      subtitle: statusSubtitleMap[application.status],
      meta: formatCurrency(application.proposed_price),
      eventDate: formatDateSafe(application.event.event_date),
      venue: application.event.venue_name || '-',
      city: application.event.city || '-',
      latitude: application.event.latitude,
      longitude: application.event.longitude,
      hasLocation: application.event.latitude !== undefined && application.event.longitude !== undefined,
      sourceLabel: application.source ? sourceMap[application.source] : '-',
      createdAt: formatDateSafe(application.created_at),
      canCancel: application.status === 'pending',
      statusLabel: status.label,
      statusColor: status.color,
    };
  }),
);

const displayedItems = computed(() => {
  if (detailed.value) {
    return mappedItems.value;
  }

  return mappedItems.value.slice(0, 3);
});

// Map Preview Modal state and handlers
const locationModalOpen = ref(false);
const selectedLocation = ref({
  latitude: undefined as number | undefined,
  longitude: undefined as number | undefined,
  venueName: '',
  city: '',
  fullAddress: '',
  eventName: ''
});

const handleViewLocation = (latitude?: number, longitude?: number, item?: any) => {
  if (latitude !== undefined && longitude !== undefined) {
    selectedLocation.value = {
      latitude,
      longitude,
      venueName: item?.venue || '',
      city: item?.city || '',
      fullAddress: item?.venue || '',
      eventName: item?.title || ''
    };
    locationModalOpen.value = true;
  }
};
</script>
