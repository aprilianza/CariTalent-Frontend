<template>
  <UiCard id="bookings" title="Booking Mendatang" :description="detailed ? 'Detail booking event, harga deal, dan metadata jadwal' : 'Ringkasan jadwal booking terdekat'" card-class="h-full">
    <!-- Skeleton loader when loading is true -->
    <div v-if="loading" class="space-y-3 mt-4">
      <USkeleton v-for="n in 3" :key="`booking-skeleton-${n}`" class="h-16 w-full rounded-xl" />
    </div>

    <!-- Empty state when no bookings available -->
    <div v-else-if="displayedItems.length === 0" class="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center text-sm text-neutral-light/50 mt-4">
      <Icon name="mdi:calendar-blank-outline" class="mx-auto h-12 w-12 text-neutral-light/30 animate-pulse" />
      <p class="mt-3 font-medium">Belum ada booking terjadwal saat ini.</p>
    </div>

    <!-- Simple vertical list (Max 3) for home dashboard summary -->
    <div v-else-if="!detailed" class="mt-4 flex flex-col divide-y divide-white/5">
      <div v-for="item in displayedItems" :key="item.id" class="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-neutral-200 truncate">{{ item.title }}</p>
          <p class="mt-1 text-xs text-neutral-light/50 truncate">
            {{ item.date }} • {{ item.venue }} • <span class="text-violet-400 font-semibold">{{ item.agreedPrice }}</span>
          </p>
        </div>
        <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" class="shrink-0 font-bold tracking-wide" />
      </div>
    </div>

    <!-- Grid / List rendering of Full Premium Booking Cards (detailed mode) -->
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
              <!-- Agreed Price / Deal -->
              <div class="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-2.5 py-1 border border-violet-500/20 text-violet-300 text-xs font-semibold">
                <Icon name="mdi:cash-usd-outline" class="h-3.5 w-3.5" />
                <span>{{ item.agreedPrice }}</span>
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
                  <p class="truncate font-medium text-neutral-200">{{ item.date }}</p>
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
              
              <!-- Source & Created Date if detailed is true -->
              <div v-if="detailed" class="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-white/[0.06] text-[11px] text-neutral-light/50">
                <div>
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Sumber</p>
                  <p class="font-medium text-neutral-300">{{ item.sourceLabel }}</p>
                </div>
                <div>
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Dibuat</p>
                  <p class="font-medium text-neutral-300">{{ item.createdAt }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Bottom Row: Detail Action (End-aligned) -->
          <div class="mt-2 flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
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
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Booking Modal -->
    <UModal
      v-model:open="showDetailModal"
      :ui="{
        content: 'w-[calc(100vw-2rem)] max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[#12121a]/95 p-0 shadow-2xl ring-0 backdrop-blur-xl mx-auto my-auto',
      }"
    >
      <template #content>
        <div v-if="selectedDetailBooking" class="overflow-hidden rounded-[28px]">
          <!-- Header -->
          <div class="border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold uppercase text-violet-400">Detail Booking Event</span>
                </div>
                <h3 class="mt-2 font-display text-xl font-bold text-neutral-100 line-clamp-2">
                  {{ selectedDetailBooking.title }}
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
                      {{ selectedDetailBooking.organizerName }}
                    </p>
                  </div>
                </div>
                
                <!-- Status Badge -->
                <UiBadge :label="selectedDetailBooking.statusLabel" :color="selectedDetailBooking.statusColor" variant="soft" class="font-bold tracking-wide" />
              </div>

              <!-- Key details grid -->
              <div class="grid gap-3 text-sm text-neutral-light/70 sm:grid-cols-2 mt-2">
                <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Harga Deal</p>
                  <p class="mt-1 text-base font-bold text-violet-300">{{ selectedDetailBooking.agreedPrice }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Tanggal & Waktu</p>
                  <p class="mt-1 text-base font-bold text-neutral-100">{{ selectedDetailBooking.date }}</p>
                </div>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Deskripsi Acara</h4>
              <p class="text-sm leading-relaxed text-neutral-300 whitespace-pre-line bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                {{ selectedDetailBooking.description }}
              </p>
            </div>

            <!-- Location Details -->
            <div class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Lokasi & Venue</h4>
              <div class="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
                <div class="flex items-start gap-3">
                  <Icon name="mdi:map-marker-outline" class="mt-0.5 h-4.5 w-4.5 text-violet-400 shrink-0" />
                  <div>
                    <h5 class="text-sm font-semibold text-neutral-200">{{ selectedDetailBooking.venue }}</h5>
                    <p v-if="selectedDetailBooking.fullAddress" class="mt-1 text-xs text-neutral-light/60 leading-relaxed">
                      {{ selectedDetailBooking.fullAddress }}
                    </p>
                    <p v-else-if="selectedDetailBooking.city" class="mt-0.5 text-xs text-neutral-light/60">
                      Kota: {{ selectedDetailBooking.city }}
                    </p>
                  </div>
                </div>

                <!-- Leaflet Map directly displayed -->
                <div v-if="selectedDetailBooking.hasLocation" class="relative w-full h-44 rounded-xl border border-white/10 overflow-hidden bg-white/5 z-0 mt-2">
                  <div ref="detailMapContainer" class="w-full h-full"></div>
                  <!-- Floating Google Maps Button -->
                  <UiButton
                    size="xs"
                    color="primary"
                    variant="solid"
                    icon="mdi:google-maps"
                    class="absolute bottom-2 right-2 z-[1000] rounded-lg shadow-lg border border-violet-500/20 font-semibold bg-[#1a0b2e] hover:bg-[#2e1454] text-violet-200"
                    @click="openGoogleMaps(selectedDetailBooking.latitude, selectedDetailBooking.longitude)"
                  >
                    Buka di Google Maps
                  </UiButton>
                </div>
              </div>
            </div>

            <!-- Genres Needed -->
            <div v-if="selectedDetailBooking.genres.length" class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Genre yang Dibutuhkan</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="genre in selectedDetailBooking.genres"
                  :key="`modal-${selectedDetailBooking.id}-${genre}`"
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
import type { Booking, BookingStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';
import EoLocationModal from '~/components/eo/EoLocationModal.vue';

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

const openGoogleMaps = (latitude?: number, longitude?: number) => {
  if (latitude === undefined || longitude === undefined) {
    return;
  }

  window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank', 'noopener,noreferrer');
};

const statusMap: Record<BookingStatus, { label: string; color: 'success' | 'warning' | 'error' | 'neutral' | 'primary' }> = {
  confirmed: { label: 'Dikonfirmasi', color: 'success' },
  completed: { label: 'Selesai', color: 'primary' },
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

const mappedItems = computed(() =>
  props.bookings.map((booking) => {
    const status = statusMap[booking.status] ?? { label: booking.status, color: 'neutral' as const };
    const event = booking.event || {};
    return {
      id: booking.id,
      title: event.title || 'Event Booking',
      description: (event as any).description || 'Deskripsi event belum tersedia.',
      genres: (event as any).genre_needed && (event as any).genre_needed.length > 0 ? (event as any).genre_needed : ['General'],
      organizerName: (event as any).organizer_name || 'Event Organizer',
      fullAddress: (event as any).full_address || event.venue_name || '',
      date: formatDateSafe(event.event_date),
      venue: event.venue_name || '-',
      city: (event as any).city || '-',
      latitude: event.latitude,
      longitude: event.longitude,
      hasLocation: event.latitude !== undefined && event.longitude !== undefined,
      agreedPrice: booking.agreed_price ? formatCurrency(booking.agreed_price) : '-',
      sourceLabel: booking.source ? sourceMap[booking.source] : '-',
      createdAt: formatDateSafe(booking.created_at),
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
      fullAddress: item?.fullAddress || '',
      eventName: item?.title || ''
    };
    locationModalOpen.value = true;
  }
};

// Detail Modal state and handlers
const showDetailModal = ref(false);
const selectedDetailBooking = ref<any | null>(null);

const openDetail = (item: any) => {
  selectedDetailBooking.value = {
    ...item,
  };
  showDetailModal.value = true;
};

// Direct Detail Map Preview logic inside modal
const detailMapContainer = ref<HTMLElement | null>(null);
let detailL: any = null;
let detailMap: any = null;
let detailMarker: any = null;

const initDetailMap = async () => {
  if (process.server || !detailMapContainer.value || !selectedDetailBooking.value?.latitude || !selectedDetailBooking.value?.longitude) return;

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
    }).setView([selectedDetailBooking.value.latitude, selectedDetailBooking.value.longitude], 15);

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

    detailMarker = detailL.marker([selectedDetailBooking.value.latitude, selectedDetailBooking.value.longitude], { icon: customIcon }).addTo(detailMap);
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
