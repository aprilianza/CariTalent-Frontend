<template>
  <UModal v-model:open="modelOpen" :ui="{
    content: 'bg-transparent ring-0 shadow-none sm:max-w-2xl w-full mx-auto',
    overlay: { background: 'bg-neutral-950/70 backdrop-blur-sm' }
  }">
    <template #content>
      <div class="relative max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <!-- Background decoration -->
        <div class="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-6">
          <!-- Header -->
          <div class="border-b border-white/5 pb-4">
            <h3 class="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {{ mode === 'edit' ? 'Edit Event' : 'Buat Event Baru' }}
            </h3>
            <p class="mt-1.5 text-sm text-neutral-light/70">
              {{ mode === 'edit' ? 'Perbarui detail event yang sudah kamu buat.' : 'Isi detail event yang ingin kamu selenggarakan.' }}
            </p>
          </div>

          <!-- Form -->
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- Title -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-neutral-light">Judul Event <span class="text-error">*</span></label>
              <UInput
                v-model="form.title"
                placeholder="Contoh: Punk Night Vol. 4"
                :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
              />
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-neutral-light">Deskripsi</label>
              <UTextarea
                v-model="form.description"
                placeholder="Deskripsikan event kamu..."
                :rows="3"
                :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none' }"
              />
            </div>

            <!-- Grid: Genre & Budget -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Genre Dibutuhkan <span class="text-error">*</span></label>
                <USelectMenu
                  v-model="selectedGenreIds"
                  :items="genreOptions"
                  multiple
                  placeholder="Pilih genre..."
                  value-key="value"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Budget (Rp) <span class="text-error">*</span></label>
                <UInput
                  v-model="form.budget"
                  type="number"
                  placeholder="3000000"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
            </div>

            <!-- Grid: Date & Status -->
            <div :class="['grid grid-cols-1 gap-5', mode === 'edit' ? 'sm:grid-cols-2' : '']">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Tanggal Event <span class="text-error">*</span></label>
                <UInput
                  v-model="form.event_date"
                  type="date"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
              <div v-if="mode === 'edit'" class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Status Event</label>
                <USelectMenu
                  v-model="form.status"
                  :items="statusOptions"
                  value-key="value"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
            </div>

            <!-- Grid: Venue & City -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Nama Venue <span class="text-error">*</span></label>
                <UInput
                  v-model="form.venue_name"
                  placeholder="Kafe Kota Bandung"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Kota <span class="text-error">*</span></label>
                <UInput
                  v-model="form.city"
                  placeholder="Bandung"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
            </div>

            <!-- Map Location Pinning -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-neutral-light flex items-center justify-between">
                <span>Pilih Lokasi di Peta</span>
                <span v-if="geocoding" class="text-xs text-violet-400 flex items-center gap-1">
                  <Icon name="svg-spinners:180-ring-with-bg" class="h-3.5 w-3.5" />
                  Mendapatkan alamat...
                </span>
              </label>

              <!-- Map container -->
              <div class="relative w-full h-64 rounded-xl border border-white/10 overflow-hidden z-0">
                <div ref="mapContainer" class="w-full h-full cursor-crosshair"></div>
                <!-- Overlay when leaflet is loading or not initialized -->
                <div v-if="!mapInitialized" class="absolute inset-0 flex items-center justify-center bg-neutral-900/80 z-10">
                  <span class="text-sm text-neutral-light/50 flex items-center gap-2">
                    <Icon name="svg-spinners:180-ring-with-bg" class="h-4 w-4 text-violet-400" />
                    Memuat Peta...
                  </span>
                </div>
              </div>

              <!-- Generated Address Display -->
              <div v-if="generatedAddress" class="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-400/20">
                <Icon name="mdi:map-marker-check" class="h-5 w-5 text-violet-400 mt-0.5 shrink-0" />
                <div class="flex flex-col gap-0.5">
                  <span class="text-[10px] font-semibold text-violet-400 uppercase tracking-wider">Alamat Lokasi Terpilih</span>
                  <span class="text-xs text-neutral-light/90 leading-relaxed">{{ generatedAddress }}</span>
                </div>
              </div>
              <div v-else-if="form.latitude !== undefined && !geocoding" class="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                <Icon name="mdi:map-marker-question" class="h-4 w-4 text-neutral-light/30" />
                <span class="text-xs text-neutral-light/40 italic">Alamat belum terdeteksi</span>
              </div>


            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-white/5">
              <UiButton color="neutral" variant="ghost" type="button" class="hover:bg-white/5" @click="modelOpen = false">Batal</UiButton>
              <UiButton
                color="primary"
                variant="soft"
                type="submit"
                :loading="loading"
                :disabled="!isFormValid"
                :icon="mode === 'edit' ? 'mdi:content-save-outline' : 'mdi:plus-circle-outline'"
                class="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-lg shadow-violet-500/25 border-0"
              >
                {{ mode === 'edit' ? 'Simpan Perubahan' : 'Buat Event' }}
              </UiButton>
            </div>
          </form>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import 'leaflet/dist/leaflet.css';
import { ref, reactive, computed, watch, nextTick } from 'vue';
import type { CreateEventPayload, EventStatus, Genre } from '~/composables/types';

const props = withDefaults(
  defineProps<{
    genres?: Genre[];
    loading?: boolean;
    mode?: 'create' | 'edit';
    initialData?: Partial<CreateEventPayload>;
  }>(),
  {
    genres: () => [],
    loading: false,
    mode: 'create',
    initialData: () => ({}),
  },
);

const emit = defineEmits<{
  submit: [payload: CreateEventPayload];
}>();

const modelOpen = defineModel<boolean>('open', { default: false });

const genreOptions = computed(() =>
  props.genres.map((g) => ({ label: g.name, value: g.id })),
);

const statusOptions = [
  { label: 'Dibuka', value: 'dibuka' },
  { label: 'Ditutup', value: 'ditutup' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Dibatalkan', value: 'dibatalkan' },
];

const selectedGenreIds = ref<number[]>([]);

const form = reactive<{
  title: string;
  description: string;
  budget: string;
  event_date: string;
  venue_name: string;
  city: string;
  status: EventStatus;
  latitude?: number;
  longitude?: number;
  full_address?: string;
}>({
  title: '',
  description: '',
  budget: '',
  event_date: '',
  venue_name: '',
  city: '',
  status: 'dibuka',
  latitude: undefined,
  longitude: undefined,
  full_address: '',
});

const isFormValid = computed(() =>
  form.title.trim() !== '' &&
  form.budget !== '' &&
  Number(form.budget) > 0 &&
  form.event_date !== '' &&
  form.venue_name.trim() !== '' &&
  form.city.trim() !== '' &&
  selectedGenreIds.value.length > 0
);

const handleSubmit = () => {
  if (!isFormValid.value) return;

  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    genre_ids: selectedGenreIds.value,
    budget: Number(form.budget),
    event_date: form.event_date,
    venue_name: form.venue_name.trim(),
    city: form.city.trim(),
    status: form.status,
    latitude: form.latitude,
    longitude: form.longitude,
    full_address: form.full_address,
  });
};

// Map Pinning State and logic
const mapContainer = ref<HTMLElement | null>(null);
const mapInitialized = ref(false);
const geocoding = ref(false);
const generatedAddress = ref<string>('');

const mapTouched = ref(false);
let skipCityWatcher = false;

let L: any = null;
let map: any = null;
let marker: any = null;
let customIconInstance: any = null;

const getCustomIcon = () => {
  if (customIconInstance) return customIconInstance;
  
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

  customIconInstance = L.divIcon({
    className: 'custom-pin-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    html: `<div style="position:relative; width:100%; height:100%;"><span style="${pulseRing}"></span><div style="${markerHtmlStyles}"><div style="${innerDot}"></div></div></div>`
  });
  
  return customIconInstance;
};

const initMap = async () => {
  if (process.server || !mapContainer.value) return;

  try {
    if (!L) {
      L = await import('leaflet');
    }

    if (map) {
      map.remove();
      map = null;
      marker = null;
    }

    const defaultLat = -6.9175; // Bandung
    const defaultLng = 107.6191;

    const lat = form.latitude !== undefined ? form.latitude : defaultLat;
    const lng = form.longitude !== undefined ? form.longitude : defaultLng;
    const hasCoords = form.latitude !== undefined && form.longitude !== undefined;

    map = L.map(mapContainer.value, { attributionControl: false }).setView([lat, lng], hasCoords ? 15 : 13);

    // Colorful tiles similar to Google Maps
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    const customIcon = getCustomIcon();

    if (hasCoords) {
      marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);
    }

    map.on('click', async (e: any) => {
      mapTouched.value = true;
      const clickLat = Number(e.latlng.lat.toFixed(6));
      const clickLng = Number(e.latlng.lng.toFixed(6));

      form.latitude = clickLat;
      form.longitude = clickLng;

      if (marker) {
        marker.setLatLng(e.latlng);
      } else {
        marker = L.marker(e.latlng, { icon: customIcon }).addTo(map);
      }

      await reverseGeocode(clickLat, clickLng);
    });

    mapInitialized.value = true;
  } catch (error) {
    console.error('Error initializing Leaflet map:', error);
  }
};

const reverseGeocode = async (lat: number, lng: number) => {
  geocoding.value = true;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
      headers: {
        'Accept-Language': 'id, en',
        'User-Agent': 'CariTalent-App-Geocoding'
      }
    });
    if (res.ok) {
      const data = await res.json();
      // Store full display name for generated address
      if (data && data.display_name) {
        generatedAddress.value = data.display_name;
        form.full_address = data.display_name;
      }
      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.municipality || data.address.county || data.address.state || '';
        if (city) {
          skipCityWatcher = true;
          form.city = city.replace(/Kota /gi, '');
          setTimeout(() => { skipCityWatcher = false; }, 200);
        }
      }
    }
  } catch (err) {
    console.error('Reverse geocoding error:', err);
  } finally {
    geocoding.value = false;
  }
};

let citySearchTimeout: NodeJS.Timeout | null = null;
watch(() => form.city, (newCity) => {
  if (skipCityWatcher || mapTouched.value) return;

  if (citySearchTimeout) clearTimeout(citySearchTimeout);
  if (!newCity || newCity.trim() === '') return;

  citySearchTimeout = setTimeout(async () => {
    if (!map || !L) return;
    try {
      geocoding.value = true;
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(newCity)}, Indonesia&limit=1`, {
        headers: {
          'Accept-Language': 'id, en',
          'User-Agent': 'CariTalent-App-Geocoding'
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = Number(data[0].lat);
          const lon = Number(data[0].lon);
          
          map.setView([lat, lon], 12);
          form.latitude = lat;
          form.longitude = lon;
          
          const icon = getCustomIcon();
          if (marker) {
            marker.setLatLng([lat, lon]);
          } else {
            marker = L.marker([lat, lon], { icon }).addTo(map);
          }
          
          form.full_address = data[0].display_name;
          generatedAddress.value = data[0].display_name;
        }
      }
    } catch (err) {
      console.error('Forward geocoding error:', err);
    } finally {
      geocoding.value = false;
    }
  }, 1000);
});

// Reset or populate form when modal opens/closes
watch(modelOpen, async (isOpen) => {
  if (isOpen) {
    mapTouched.value = false;
    skipCityWatcher = false;
    if (props.mode === 'edit' && props.initialData) {
      form.title = props.initialData.title || '';
      form.description = props.initialData.description || '';
      form.budget = props.initialData.budget ? String(props.initialData.budget) : '';
      form.event_date = props.initialData.event_date || '';
      form.venue_name = props.initialData.venue_name || '';
      form.city = props.initialData.city || '';
      form.status = props.initialData.status || 'dibuka';
      selectedGenreIds.value = props.initialData.genre_ids ? [...props.initialData.genre_ids] : [];
      form.latitude = props.initialData.latitude;
      form.longitude = props.initialData.longitude;
      form.full_address = props.initialData.full_address || '';
      generatedAddress.value = props.initialData.full_address || '';
    } else {
      // Create mode
      form.title = '';
      form.description = '';
      form.budget = '';
      form.event_date = '';
      form.venue_name = '';
      form.city = '';
      form.status = 'dibuka';
      selectedGenreIds.value = [];
      form.latitude = undefined;
      form.longitude = undefined;
      form.full_address = '';
      generatedAddress.value = '';
    }

    await nextTick();
    setTimeout(() => {
      initMap();
    }, 300);
  } else {
    if (map) {
      map.remove();
      map = null;
      marker = null;
    }
    mapInitialized.value = false;
  }
});
</script>

<style>
@keyframes pulse-ring {
  0% {
    transform: scale(0.6);
    opacity: 1;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

.custom-pin-marker {
  background: transparent !important;
  border: none !important;
}
</style>
