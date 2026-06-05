<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">Moderasi Event</h1>
      <p class="mt-1 text-sm text-neutral-light/60">Tinjau dan moderasi semua event di platform.</p>
    </div>

    <!-- Filter Bar -->
    <UiCard>
      <div class="flex flex-wrap items-center gap-2">
        <UiButton
          v-for="tab in statusTabs"
          :key="tab.value"
          :label="tab.label"
          :variant="statusFilter === tab.value ? 'solid' : 'soft'"
          :color="statusFilter === tab.value ? 'primary' : 'neutral'"
          size="sm"
          @click="statusFilter = tab.value"
        />
        <div class="ml-auto relative">
          <Icon name="mdi:magnify" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-light/40" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari judul event..."
            class="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-ui-light placeholder-neutral-light/40 outline-none transition focus:border-highlight/50 focus:bg-white/8 sm:w-56"
          />
        </div>
      </div>
    </UiCard>

    <!-- Event List -->
    <div class="space-y-3">
      <!-- Loading -->
      <div v-if="pending || status === 'idle'" class="flex flex-col items-center justify-center gap-3 py-16">
        <Icon name="mdi:loading" class="h-8 w-8 animate-spin text-highlight" />
        <p class="text-sm text-neutral-light/60">Memuat data event...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="filteredEvents.length === 0" class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-16">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Icon name="mdi:calendar-remove-outline" class="h-10 w-10 text-neutral-light/40" />
        </div>
        <p class="text-sm font-medium text-neutral-light/60">Tidak ada event ditemukan.</p>
      </div>

      <!-- Cards -->
      <UiCard v-for="event in filteredEvents" :key="event.id" card-class="transition-all hover:border-highlight/30">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <!-- Event Info -->
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                class="group/btn flex items-center gap-0.5 text-sm font-bold text-ui-light hover:text-primary-400 hover:underline transition-colors text-left focus:outline-none"
                @click="openDetail(event)"
              >
                <span>{{ event.title }}</span>
                <Icon name="mdi:chevron-right" class="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 text-neutral-light/50" />
              </button>
              <UiBadge :label="statusLabel(event.status)" :color="statusColor(event.status)" variant="soft" dot />
            </div>
            <p class="text-xs text-neutral-light/60 line-clamp-2">{{ event.description || 'Tidak ada deskripsi' }}</p>
            <div class="flex flex-wrap gap-1.5">
              <UiBadge v-for="g in event.genre_needed" :key="g" :label="g" color="info" size="sm" variant="subtle" />
            </div>
            <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-light/60">
              <span class="flex items-center gap-1">
                <Icon name="mdi:map-marker-outline" class="h-3.5 w-3.5" />
                {{ event.venue_name }}, {{ event.city }}
              </span>
              <span class="flex items-center gap-1">
                <Icon name="mdi:calendar-outline" class="h-3.5 w-3.5" />
                {{ formatDate(event.event_date) }}
              </span>
              <span class="flex items-center gap-1">
                <Icon name="mdi:cash-multiple" class="h-3.5 w-3.5" />
                {{ formatCurrency(event.budget) }}
              </span>
            </div>
          </div>

          <!-- Actions -->
          <div class="shrink-0">
            <UiButton label="Moderasi" icon="mdi:gavel" color="primary" variant="soft" size="sm" :disabled="event.status === 'cancelled'" @click="openModerateModal(event)" />
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Moderate Modal -->
    <UModal v-model:open="showModerateModal" :ui="{ content: 'rounded-2xl border border-white/10 bg-neutral-dark shadow-xl overflow-hidden sm:rounded-2xl sm:p-0 ring-0' }">
      <template #content>
        <div class="p-6 space-y-5">
          <div class="flex items-start gap-4">
            <div class="rounded-xl border border-highlight/30 bg-highlight/10 p-3 text-accent">
              <Icon name="mdi:gavel" class="h-6 w-6" />
            </div>
            <div>
              <h3 class="text-base font-bold text-ui-light">Moderasi Event</h3>
              <p class="mt-0.5 text-sm text-neutral-light/70">
                {{ eventToModerate?.title }}
              </p>
            </div>
          </div>

          <div class="space-y-3">
            <label class="block text-xs font-semibold uppercase tracking-wide text-neutral-light/60"> Ubah Status </label>
            <div class="flex flex-wrap gap-2">
              <UiButton
                v-for="s in moderateStatuses"
                :key="s.value"
                :label="s.label"
                :color="moderateStatus === s.value ? s.activeColor : 'neutral'"
                :variant="moderateStatus === s.value ? 'solid' : 'soft'"
                size="sm"
                @click="moderateStatus = s.value"
              />
            </div>

            <label class="block text-xs font-semibold uppercase tracking-wide text-neutral-light/60 mt-4"> Alasan (opsional) </label>
            <textarea
              v-model="moderateReason"
              rows="3"
              placeholder="Tuliskan alasan moderasi..."
              class="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-ui-light placeholder-neutral-light/40 outline-none transition focus:border-highlight/50 focus:bg-white/8 resize-none"
            />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <UiButton label="Batal" color="neutral" variant="soft" @click="showModerateModal = false" />
            <UiButton label="Terapkan" color="primary" variant="solid" :loading="moderating" :disabled="!moderateStatus" @click="doModerate" />
          </div>
        </div>
      </template>
    </UModal>

    <!-- Detail Event Modal -->
    <UModal
      v-model:open="showDetailModal"
      :ui="{
        content: 'w-[calc(100vw-2rem)] max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[#12121a]/95 p-0 shadow-2xl ring-0 backdrop-blur-xl mx-auto my-auto',
      }"
    >
      <template #content>
        <div v-if="selectedEvent" class="overflow-hidden rounded-[28px]">
          <!-- Header -->
          <div class="border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold uppercase text-primary-400">Detail Informasi Event</span>
                </div>
                <h3 class="mt-2 font-display text-xl font-bold text-neutral-100 line-clamp-2">
                  {{ selectedEvent.title }}
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
          <div class="space-y-5 px-5 py-5 sm:px-6 max-h-[60vh] overflow-y-auto">
            <!-- Basic Info & Status -->
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-500/10 text-primary-400 border border-primary-500/20 font-bold">
                    <Icon name="mdi:domain" class="h-5 w-5" />
                  </div>
                  <div>
                    <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Penyelenggara</p>
                    <p class="text-sm font-semibold text-neutral-200">
                      {{ selectedEvent.organizer_name || 'Event Organizer' }}
                    </p>
                  </div>
                </div>
                <UiBadge 
                  :label="statusLabel(selectedEvent.status)" 
                  :color="statusColor(selectedEvent.status)" 
                  variant="soft" 
                  class="font-bold tracking-wide" 
                />
              </div>

              <!-- Time & Budget -->
              <div class="grid gap-3 text-sm text-neutral-light/70 sm:grid-cols-2 mt-2">
                <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Tanggal Event</p>
                  <p class="mt-1 text-sm font-bold text-neutral-200">{{ formatDate(selectedEvent.event_date) }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Budget Event</p>
                  <p class="mt-1 text-sm font-bold text-primary-300">{{ formatCurrency(selectedEvent.budget) }}</p>
                </div>
              </div>
            </div>

            <!-- Location Grid -->
            <div class="grid gap-3 text-sm text-neutral-light/70 sm:grid-cols-2">
              <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Nama Venue</p>
                <p class="mt-1 text-sm font-bold text-neutral-100">{{ selectedEvent.venue_name || '-' }}</p>
              </div>
              <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Kota</p>
                <p class="mt-1 text-sm font-bold text-neutral-100">{{ selectedEvent.city || '-' }}</p>
              </div>
              <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 sm:col-span-2" v-if="selectedEvent.full_address">
                <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Alamat Lengkap</p>
                <p class="mt-1 text-sm text-neutral-200">{{ selectedEvent.full_address }}</p>
              </div>
            </div>

            <!-- Description -->
            <div class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Deskripsi Event</h4>
              <p class="text-sm leading-relaxed text-neutral-300 whitespace-pre-line bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                {{ selectedEvent.description || 'Penyelenggara belum menambahkan deskripsi.' }}
              </p>
            </div>

            <!-- Genres -->
            <div v-if="selectedEvent.genre_needed && selectedEvent.genre_needed.length" class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Genre yang Dicari</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="genre in selectedEvent.genre_needed"
                  :key="genre"
                  class="rounded-xl bg-primary-500/10 border border-primary-500/20 px-3 py-1 text-xs font-semibold text-primary-300 tracking-wide"
                >
                  {{ genre }}
                </span>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex gap-3 border-t border-white/10 bg-white/[0.03] px-5 py-4 justify-end sm:px-6">
            <UButton 
              color="neutral" 
              variant="soft" 
              class="rounded-xl px-5" 
              @click="showDetailModal = false"
            > 
              Tutup 
            </UButton>
            <UiButton
              label="Moderasi Event"
              icon="mdi:gavel"
              color="primary"
              class="rounded-xl px-4"
              :disabled="selectedEvent.status === 'cancelled'"
              @click="openModerateModalFromDetail"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Event, EventStatus } from '~/composables/types';
import { useAdminEvents } from '~/composables/useAdminEvents';
import { useFormatters } from '~/composables/useFormatters';

definePageMeta({
  layout: 'admin',
});

const pageTitle = useState('admin-layout-title');
pageTitle.value = 'Moderasi Event';

const toast = useToast();
const { events, pending, status, moderateEvent } = useAdminEvents();
const { formatCurrency, formatDate } = useFormatters();

const search = ref('');
const statusFilter = ref<'all' | EventStatus>('all');
const showModerateModal = ref(false);
const eventToModerate = ref<Event | null>(null);
const moderateStatus = ref<EventStatus | ''>('');
const moderateReason = ref('');
const moderating = ref(false);

const showDetailModal = ref(false);
const selectedEvent = ref<Event | null>(null);

const statusTabs = [
  { label: 'Semua', value: 'all' as const },
  { label: 'Dibuka', value: 'dibuka' as const },
  { label: 'Ditutup', value: 'ditutup' as const },
  { label: 'Selesai', value: 'selesai' as const },
  { label: 'Dibatalkan', value: 'dibatalkan' as const },
];

const moderateStatuses: { value: EventStatus; label: string; activeColor: 'primary' | 'error' | 'success' | 'neutral' }[] = [
  { value: 'dibuka', label: 'Buka', activeColor: 'success' },
  { value: 'ditutup', label: 'Tutup', activeColor: 'primary' },
  { value: 'dibatalkan', label: 'Batal', activeColor: 'error' },
];

const filteredEvents = computed(() => {
  return events.value.filter((e) => {
    const matchStatus = statusFilter.value === 'all' || e.status === statusFilter.value;
    const matchSearch = !search.value || e.title.toLowerCase().includes(search.value.toLowerCase());
    return matchStatus && matchSearch;
  });
});

const statusLabel = (status: EventStatus) => {
  const map: Record<EventStatus, string> = {
    dibuka: 'Buka',
    ditutup: 'Tutup',
    selesai: 'Selesai',
    dibatalkan: 'Batal',
  };
  return map[status] ?? status;
};

const statusColor = (status: EventStatus): 'success' | 'primary' | 'error' | 'neutral' | 'info' => {
  const map: Record<EventStatus, 'success' | 'primary' | 'error' | 'neutral' | 'info'> = {
    dibuka: 'success',
    ditutup: 'neutral',
    dibatalkan: 'error',
    selesai: 'info',
  };
  return map[status] ?? 'neutral';
};

const openModerateModal = (event: Event) => {
  eventToModerate.value = event;
  moderateStatus.value = event.status;
  moderateReason.value = '';
  showModerateModal.value = true;
};

const openDetail = (event: Event) => {
  selectedEvent.value = event;
  showDetailModal.value = true;
};

const openModerateModalFromDetail = () => {
  if (selectedEvent.value) {
    showDetailModal.value = false;
    openModerateModal(selectedEvent.value);
  }
};

const doModerate = async () => {
  if (!eventToModerate.value || !moderateStatus.value) return;
  moderating.value = true;

  const res = await moderateEvent(eventToModerate.value.id, {
    status: moderateStatus.value as EventStatus,
    reason: moderateReason.value || undefined,
  });

  if (res.success) {
    toast.add({
      title: 'Event dimoderasi',
      description: `Status "${eventToModerate.value.title}" diubah ke "${statusLabel(moderateStatus.value as EventStatus)}".`,
      color: 'success',
    });
  } else {
    toast.add({
      title: 'Gagal',
      description: res.message || 'Terjadi kesalahan saat memoderasi event.',
      color: 'error',
    });
  }

  // Update current detail modal status if it was opened
  if (res.success && selectedEvent.value && selectedEvent.value.id === eventToModerate.value.id) {
    selectedEvent.value.status = moderateStatus.value as EventStatus;
  }

  moderating.value = false;
  showModerateModal.value = false;
  eventToModerate.value = null;
};
</script>
