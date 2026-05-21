<template>
  <UModal v-model:open="modelOpen" :ui="{
    content: 'bg-transparent ring-0 shadow-none sm:max-w-xl w-full mx-auto',
    overlay: { background: 'bg-neutral-950/70 backdrop-blur-sm' }
  }">
    <template #content>
      <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-6 shadow-2xl">
        <!-- Background decoration -->
        <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-4">
          <!-- Header -->
          <div class="flex items-center gap-3 border-b border-white/5 pb-3">
            <div class="flex-1 min-w-0 px-1">
              <h3 class="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent leading-none">
                {{ eventName || 'Lokasi Event' }}
              </h3>
              <p class="mt-1 text-xs text-neutral-light/40 truncate">
                {{ venueName }} · {{ city }}
              </p>
            </div>
            <UButton
              color="neutral"
              variant="ghost"
              icon="mdi:close"
              class="rounded-xl h-9 w-9 p-0 hover:bg-white/5 text-neutral-light/70"
              @click="modelOpen = false"
            />
          </div>

          <!-- Map Container -->
          <div class="relative w-full h-72 rounded-xl border border-white/10 overflow-hidden bg-white/5 z-0">
            <div ref="mapContainer" class="w-full h-full"></div>
            <!-- Overlay when leaflet is loading or not initialized -->
            <div v-if="!mapInitialized" class="absolute inset-0 flex items-center justify-center bg-neutral-900/80 z-10">
              <span class="text-sm text-neutral-light/50 flex items-center gap-2">
                <Icon name="svg-spinners:180-ring-with-bg" class="h-4 w-4 text-violet-400" />
                Memuat Peta...
              </span>
            </div>
          </div>

          <!-- Location Info -->
          <div class="flex items-start gap-3 px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/20">
            <Icon name="mdi:map-marker-radius" class="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
            <div class="flex flex-col gap-0.5">
              <span class="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">Detail Lokasi</span>
              <span class="text-xs text-neutral-light/90 leading-relaxed">{{ fullAddress || venueName }}</span>
            </div>
          </div>

          <!-- Action -->
          <div class="flex justify-end pt-2">
            <UiButton
              color="primary"
              variant="soft"
              class="bg-gradient-to-r from-violet-500 to-indigo-500 text-white"
              @click="openInGoogleMaps"
            >
              Buka di Google Maps
            </UiButton>
          </div>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import { ref, watch, nextTick } from 'vue';

const props = defineProps<{
  latitude?: number;
  longitude?: number;
  venueName?: string;
  city?: string;
  fullAddress?: string;
  eventName?: string;
}>();

const modelOpen = defineModel<boolean>('open', { default: false });

const mapContainer = ref<HTMLElement | null>(null);
const mapInitialized = ref(false);
let L: any = null;
let map: any = null;
let marker: any = null;

const initMap = async () => {
  if (process.server || !mapContainer.value || !props.latitude || !props.longitude) return;

  try {
    if (!L) {
      L = await import('leaflet');
    }

    if (map) {
      map.remove();
      map = null;
    }

    map = L.map(mapContainer.value, {
      zoomControl: true,
      scrollWheelZoom: true,
      attributionControl: false
    }).setView([props.latitude, props.longitude], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    const markerHtmlStyles = `
      background-color: #7c3aed;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      border: 3px solid #ffffff;
      box-shadow: 0 0 12px rgba(124, 58, 237, 0.6), 0 2px 8px rgba(0,0,0,0.4);
    `;

    const innerDot = `
      width: 8px;
      height: 8px;
      background-color: white;
      border-radius: 50%;
    `;

    const pulseRing = `
      position: absolute;
      width: 40px;
      height: 40px;
      left: -8px;
      top: 4px;
      border-radius: 50%;
      background: rgba(124, 58, 237, 0.2);
      animation: pulse-ring 1.5s ease-out infinite;
      z-index: -1;
    `;

    const customIcon = L.divIcon({
      className: 'custom-pin-marker',
      iconSize: [24, 24],
      iconAnchor: [12, 24],
      html: `<div style="position:relative; width:100%; height:100%;"><span style="${pulseRing}"></span><div style="${markerHtmlStyles}"><div style="${innerDot}"></div></div></div>`
    });

    marker = L.marker([props.latitude, props.longitude], { icon: customIcon }).addTo(map);
    mapInitialized.value = true;
  } catch (error) {
    console.error('Error initializing Leaflet preview map:', error);
  }
};

const openInGoogleMaps = () => {
  if (props.latitude && props.longitude) {
    window.open(`https://www.google.com/maps/search/?api=1&query=${props.latitude},${props.longitude}`, '_blank');
  }
};

watch(modelOpen, async (val) => {
  if (val) {
    await nextTick();
    setTimeout(() => {
      initMap();
    }, 400);
  } else {
    if (map) {
      map.remove();
      map = null;
    }
    mapInitialized.value = false;
  }
});
</script>

<style>
@keyframes pulse-ring {
  0% { transform: scale(0.6); opacity: 1; }
  100% { transform: scale(1.8); opacity: 0; }
}
.custom-pin-marker { background: transparent !important; border: none !important; }
</style>
