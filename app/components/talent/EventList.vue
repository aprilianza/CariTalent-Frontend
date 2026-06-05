<template>
  <UiCard 
    id="events" 
    :title="detailed ? 'Daftar Event Tersedia' : 'Open Events'" 
    :description="detailed ? 'Jelajahi event musik dan hiburan menarik. Kirim penawaran terbaikmu sekarang.' : 'Ringkasan event terbaru'" 
    card-class="h-full"
  >
    <!-- Skeleton loader when loading is true -->
    <div v-if="loading" class="grid gap-6 mt-4" :class="detailed ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'">
      <div v-for="n in 3" :key="`event-skeleton-${n}`" class="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-5">
        <div class="flex items-center justify-between gap-4">
          <USkeleton class="h-6 w-24 rounded-lg" />
          <USkeleton class="h-6 w-16 rounded-full" />
        </div>
        <USkeleton class="mt-4 h-4 w-full rounded-lg" />
        <USkeleton class="mt-2 h-4 w-2/3 rounded-lg" />
        <div class="mt-6 flex items-center justify-between gap-4">
          <USkeleton class="h-8 w-24 rounded-xl" />
          <USkeleton class="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>

    <!-- Empty state when no events available -->
    <div v-else-if="mappedItems.length === 0" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-neutral-light/50 mt-4">
      <Icon name="mdi:calendar-blank-outline" class="mx-auto h-12 w-12 text-neutral-light/30 animate-pulse" />
      <p class="mt-3 font-medium">Belum ada event tersedia saat ini.</p>
    </div>

    <!-- Grid / List rendering of Event Cards -->
    <div v-else class="mt-4" :class="detailed ? 'grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'flex flex-col gap-4'">
      <div
        v-for="item in mappedItems"
        :key="item.id"
        class="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-white/[0.02] p-5 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 hover:shadow-violet-500/5"
      >
        <!-- Card glowing overlay -->
        <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-violet-500/5 blur-3xl transition-opacity duration-300 group-hover:bg-violet-500/10 pointer-events-none" />
        
        <div class="relative z-10 flex flex-col h-full justify-between gap-4">
          <!-- Top Row: Badges / Info -->
          <div class="space-y-3">
            <div class="flex items-center justify-between gap-3">
              <!-- Budget -->
              <div class="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1 border border-violet-500/20 text-violet-300 text-xs font-semibold">
                <Icon name="mdi:cash-usd-outline" class="h-3.5 w-3.5" />
                <span>{{ item.budget }}</span>
              </div>
              
              <!-- Status Badge -->
              <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" class="font-bold tracking-wide shrink-0" />
            </div>

            <!-- Event Title -->
            <h3 class="font-display text-base font-bold text-neutral-50 dark:text-neutral-100 group-hover:text-violet-300 transition-colors line-clamp-1">
              {{ item.title }}
            </h3>

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
                  <p class="truncate font-medium text-neutral-200">{{ item.location }}</p>
                </div>
                <button
                  v-if="item.hasLocation"
                  type="button"
                  class="ml-2 text-violet-400 hover:text-violet-300 text-xs hover:underline flex items-center gap-0.5 shrink-0"
                  @click="handleViewLocation(item.latitude, item.longitude)"
                >
                  <span class="text-[11px]">Peta</span>
                  <Icon name="mdi:launch" class="h-3 w-3" />
                </button>
              </div>
            </div>

            <!-- Description (if detailed) -->
            <p v-if="detailed" class="text-xs text-neutral-light/60 line-clamp-3 leading-relaxed mt-3 pt-3 border-t border-white/[0.06]">
              {{ item.description }}
            </p>

            <!-- Genre Badges (if detailed) -->
            <div v-if="detailed && item.genres.length" class="flex flex-wrap gap-1 pt-2">
              <span
                v-for="genre in item.genres"
                :key="`${item.id}-${genre}`"
                class="rounded bg-white/[0.04] border border-white/5 px-2 py-0.5 text-[9px] font-semibold text-neutral-light/70 tracking-wide"
              >
                {{ genre }}
              </span>
            </div>
          </div>

          <!-- Bottom Row: Apply Action (End-aligned, no description text) -->
          <div class="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
            <div class="flex items-center gap-2">
              <!-- Detail Button -->
              <UiButton
                size="sm"
                color="neutral"
                variant="ghost"
                icon="mdi:eye-outline"
                @click="openDetail(item)"
                class="rounded-xl px-3 text-neutral-300 hover:text-white hover:bg-white/5 font-semibold"
              >
                Detail
              </UiButton>

              <!-- Apply Button -->
              <UiButton
                size="sm"
                :color="item.canApply ? 'primary' : 'neutral'"
                :variant="item.canApply ? 'soft' : 'outline'"
                :loading="item.isApplying"
                :disabled="!item.canApply"
                @click="emit('apply', Number(item.id))"
                class="rounded-xl px-4 font-semibold tracking-wide"
              >
                {{ item.applyLabel }}
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Event Modal -->
    <UModal
      v-model:open="showDetailModal"
      :ui="{
        content: 'w-[calc(100vw-2rem)] max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[#12121a]/95 p-0 shadow-2xl ring-0 backdrop-blur-xl mx-auto my-auto',
      }"
    >
      <template #content>
        <div v-if="selectedDetailEvent" class="overflow-hidden rounded-[28px]">
          <!-- Header -->
          <div class="border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold uppercase text-violet-400">Detail Event</span>
                </div>
                <h3 class="mt-2 font-display text-xl font-bold text-neutral-100 line-clamp-2">
                  {{ selectedDetailEvent.title }}
                </h3>
              </div>
              <UButton 
                color="neutral" 
                variant="ghost" 
                icon="i-lucide-x" 
                class="-mr-2 -mt-2 shrink-0 rounded-full text-neutral-light/75 hover:text-white" 
                aria-label="Tutup modal" 
                @click="showDetailModal = false" 
              />
            </div>
          </div>

          <!-- Body Content -->
          <div class="space-y-5 px-5 py-5 sm:px-6 max-h-[50vh] overflow-y-auto">
            <!-- Event Card Summary -->
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <!-- Organizer Info -->
                <div class="flex items-center gap-2.5">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                    <Icon name="mdi:office-building-outline" class="h-5 w-5" />
                  </div>
                  <div>
                    <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Penyelenggara (EO)</p>
                    <p class="text-sm font-semibold text-neutral-200">
                      {{ selectedDetailEvent.organizerName || 'Event Organizer' }}
                    </p>
                  </div>
                </div>
                
                <!-- Status Badge -->
                <UiBadge :label="selectedDetailEvent.statusLabel" :color="selectedDetailEvent.statusColor" variant="soft" class="font-bold tracking-wide" />
              </div>

              <!-- Key details grid -->
              <div class="grid gap-3 text-sm text-neutral-light/70 sm:grid-cols-2 mt-2">
                <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Anggaran (Budget)</p>
                  <p class="mt-1 text-base font-bold text-violet-300">{{ selectedDetailEvent.budget }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Tanggal & Waktu</p>
                  <p class="mt-1 text-base font-bold text-neutral-100">{{ selectedDetailEvent.eventDate }}</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Deskripsi Acara</h4>
              <p class="text-sm leading-relaxed text-neutral-300 whitespace-pre-line bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                {{ selectedDetailEvent.description }}
              </p>
            </div>

            <!-- Location Details -->
            <div class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Lokasi & Venue</h4>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div class="flex items-start gap-3">
                  <Icon name="mdi:map-marker-outline" class="mt-0.5 h-4.5 w-4.5 text-violet-400 shrink-0" />
                  <div>
                    <h5 class="text-sm font-semibold text-neutral-200">{{ selectedDetailEvent.venue }}</h5>
                    <p v-if="selectedDetailEvent.fullAddress" class="mt-1 text-xs text-neutral-light/60 leading-relaxed">
                      {{ selectedDetailEvent.fullAddress }}
                    </p>
                    <p v-else-if="selectedDetailEvent.city" class="mt-0.5 text-xs text-neutral-light/60">
                      Kota: {{ selectedDetailEvent.city }}
                    </p>
                  </div>
                </div>

                <!-- Leaflet Map directly displayed -->
                <div v-if="selectedDetailEvent.hasLocation" class="relative w-full h-44 rounded-xl border border-white/10 overflow-hidden bg-white/5 z-0 mt-2">
                  <div ref="detailMapContainer" class="w-full h-full"></div>
                  <!-- Floating Google Maps Button -->
                  <UiButton
                    size="xs"
                    color="primary"
                    variant="solid"
                    icon="mdi:google-maps"
                    class="absolute bottom-2 right-2 z-[1000] rounded-lg shadow-lg border border-violet-500/20 font-semibold bg-[#1a0b2e] hover:bg-[#2e1454] text-violet-200"
                    @click="openGoogleMaps(selectedDetailEvent.latitude, selectedDetailEvent.longitude)"
                  >
                    Buka di Google Maps
                  </UiButton>
                </div>
              </div>
            </div>

            <!-- Genres Needed -->
            <div v-if="selectedDetailEvent.genres.length" class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Genre yang Dibutuhkan</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="genre in selectedDetailEvent.genres"
                  :key="`modal-${selectedDetailEvent.id}-${genre}`"
                  class="rounded-xl bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 tracking-wide"
                >
                  {{ genre }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex flex-col-reverse gap-3 border-t border-white/10 bg-white/[0.03] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <UButton 
              color="neutral" 
              variant="soft" 
              class="rounded-xl px-5" 
              @click="showDetailModal = false"
            > 
              Tutup 
            </UButton>
            
            <UiButton
              v-if="selectedDetailEvent.canApply"
              size="sm"
              color="primary"
              variant="soft"
              :loading="selectedDetailEvent.isApplying"
              @click="handleApplyFromModal"
              class="rounded-xl px-6 font-semibold tracking-wide"
            >
              {{ selectedDetailEvent.applyLabel }}
            </UiButton>
            <span v-else class="flex items-center px-4 text-xs font-semibold text-neutral-light/50 border border-white/10 rounded-xl bg-white/[0.02]">
              {{ selectedDetailEvent.applyLabel }}
            </span>
          </div>
        </div>
      </template>
    </UModal>

    <!-- Map Preview Modal -->
    <EoLocationModal 
      v-model:open="locationModalOpen"
      v-bind="selectedLocation"
    />
  </UiCard>
</template>

<script setup lang="ts">
import type { Event } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';
import EoLocationModal from '~/components/eo/EoLocationModal.vue';

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

const openGoogleMaps = (latitude?: number, longitude?: number) => {
  if (latitude === undefined || longitude === undefined) {
    return;
  }

  window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank', 'noopener,noreferrer');
};

const statusMeta: Record<Event['status'], { label: string; color: 'success' | 'warning' | 'error' | 'neutral' | 'primary' }> = {
  dibuka: { label: 'Buka', color: 'success' },
  ditutup: { label: 'Tutup', color: 'error' },
  selesai: { label: 'Selesai', color: 'primary' },
  dibatalkan: { label: 'Batal', color: 'error' },
};

const mappedItems = computed(() =>
  props.events.map((event) => {
    const status = statusMeta[event.status] ?? { label: event.status, color: 'neutral' as const };
    const alreadyApplied = props.appliedEventIds.includes(event.id);
    const isApplying = props.applyingEventIds.includes(event.id);
    const canApply = event.status === 'dibuka' && !alreadyApplied && !isApplying;

    let applyLabel = 'Melamar';
    if (alreadyApplied) {
      applyLabel = 'Sudah Dilamar';
    } else if (event.status === 'selesai') {
      applyLabel = 'Event Selesai';
    } else if (event.status !== 'dibuka') {
      applyLabel = 'Event Ditutup';
    } else if (isApplying) {
      applyLabel = 'Memproses...';
    }

    return {
      id: event.id,
      title: event.title,
      description: event.description || 'Deskripsi event belum tersedia.',
      genres: event.genre_needed && event.genre_needed.length > 0 ? event.genre_needed : ['General'],
      budget: formatCurrency(event.budget),
      eventDate: formatDateSafe(event.event_date),
      location: [event.venue_name, event.city].filter(Boolean).join(' • '),
      venue: event.venue_name,
      city: event.city || '',
      latitude: event.latitude,
      longitude: event.longitude,
      hasLocation: event.latitude !== undefined && event.longitude !== undefined,
      statusLabel: status.label,
      statusColor: status.color,
      canApply,
      isApplying,
      applyLabel,
      rawEvent: event,
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
      venueName: item?.venue || item?.venue_name || '',
      city: item?.city || '',
      fullAddress: item?.fullAddress || item?.full_address || '',
      eventName: item?.title || ''
    };
    locationModalOpen.value = true;
  }
};

// Detail Modal state and handlers
const showDetailModal = ref(false);
const selectedDetailEvent = ref<any | null>(null);

const openDetail = (item: any) => {
  const raw = item.rawEvent;
  selectedDetailEvent.value = {
    ...item,
    organizerName: raw?.organizer_name || 'Event Organizer',
    fullAddress: raw?.full_address || raw?.venue_name || '',
  };
  showDetailModal.value = true;
};

const handleApplyFromModal = () => {
  if (!selectedDetailEvent.value) return;
  const id = selectedDetailEvent.value.id;
  showDetailModal.value = false;
  emit('apply', Number(id));
};

// Direct Detail Map Preview logic inside modal
const detailMapContainer = ref<HTMLElement | null>(null);
let detailL: any = null;
let detailMap: any = null;
let detailMarker: any = null;

const initDetailMap = async () => {
  if (process.server || !detailMapContainer.value || !selectedDetailEvent.value?.latitude || !selectedDetailEvent.value?.longitude) return;

  try {
    if (!detailL) {
      detailL = await import('leaflet');
    }

    if (detailMap) {
      detailMap.remove();
      detailMap = null;
    }

    detailMap = detailL.map(detailMapContainer.value, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false
    }).setView([selectedDetailEvent.value.latitude, selectedDetailEvent.value.longitude], 15);

    detailL.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(detailMap);

    const markerHtmlStyles = `
      background-color: #7c3aed;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 2px solid #ffffff;
      box-shadow: 0 0 8px rgba(124, 58, 237, 0.6);
    `;

    const innerDot = `
      width: 6px;
      height: 6px;
      background-color: white;
      border-radius: 50%;
    `;

    const customIcon = detailL.divIcon({
      className: 'custom-pin-marker',
      iconSize: [20, 20],
      iconAnchor: [10, 20],
      html: `<div style="${markerHtmlStyles}"><div style="${innerDot}"></div></div>`
    });

    detailMarker = detailL.marker([selectedDetailEvent.value.latitude, selectedDetailEvent.value.longitude], { icon: customIcon }).addTo(detailMap);
  } catch (error) {
    console.error('Error initializing Leaflet detail map:', error);
  }
};

watch(showDetailModal, async (val) => {
  if (val) {
    await nextTick();
    setTimeout(() => {
      initDetailMap();
    }, 300);
  } else {
    if (detailMap) {
      detailMap.remove();
      detailMap = null;
    }
  }
});
</script>
