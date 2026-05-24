<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-neutral-light/70">Area Kerja Talent</p>
          <h1 class="font-display bg-gradient-to-r from-highlight to-accent bg-clip-text text-2xl font-bold text-transparent md:text-3xl">Cari Event</h1>
          <div class="mt-3 flex flex-wrap gap-2">
            <UiBadge :label="`Dibuka ${statusSummary.open}`" color="success" variant="soft" />
            <UiBadge :label="`Ditutup ${statusSummary.closed}`" color="warning" variant="soft" />
            <UiBadge :label="`Selesai ${statusSummary.completed}`" color="primary" variant="soft" />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UiBadge :label="`${events.length} total`" color="secondary" variant="soft" />
          <UPagination v-if="pagination && pagination.last_page > 1" v-model="currentPage" :page-count="pagination.per_page" :total="pagination.total" />
        </div>
      </div>
    </UiCard>

    <UiCard title="Filter Events" description="Saring event sesuai kebutuhanmu.">
      <div class="grid gap-4 lg:grid-cols-4">
        <UFormField label="Cari" class="w-full">
          <UInput v-model="filterForm.search" placeholder="Judul event" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" @keyup.enter="applyFilters" />
        </UFormField>

        <UFormField label="Status" class="w-full">
          <USelectMenu v-model="selectedStatusOption" :items="statusOptions" placeholder="Semua status" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
        </UFormField>

        <UFormField label="Genre" class="w-full">
          <USelectMenu v-model="selectedGenreOption" :items="genreOptions" placeholder="Semua genre" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
        </UFormField>

        <UFormField label="City" class="w-full">
          <UInput v-model="filterForm.city" placeholder="Bandung" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" @keyup.enter="applyFilters" />
        </UFormField>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-4">
        <UFormField label="Budget Min" class="w-full">
          <UInput v-model="filterForm.budget_min" type="number" placeholder="1000000" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" @keyup.enter="applyFilters" />
        </UFormField>

        <UFormField label="Budget Max" class="w-full">
          <UInput v-model="filterForm.budget_max" type="number" placeholder="5000000" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" @keyup.enter="applyFilters" />
        </UFormField>

        <UFormField label="Date From" class="w-full">
          <UInput v-model="filterForm.date_from" type="date" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
        </UFormField>

        <UFormField label="Date To" class="w-full">
          <UInput v-model="filterForm.date_to" type="date" class="w-full" :ui="{ base: 'w-full rounded-xl border-white/20 bg-white/8 text-ui-light' }" />
        </UFormField>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <UiButton color="neutral" variant="ghost" icon="mdi:filter-remove-outline" @click="resetFilters">Reset</UiButton>
        <UiButton color="primary" variant="soft" icon="mdi:filter-check-outline" @click="applyFilters">Terapkan Filter</UiButton>
      </div>
    </UiCard>

    <EventList :events="events" :loading="pending" :applied-event-ids="appliedEventIds" :applying-event-ids="applyingEventIds" @apply="handleApply" />

    <!-- Apply Modal -->
    <UModal
      v-model:open="showApplyModal"
      :ui="{
        content: 'w-[calc(100vw-2rem)] max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-neutral-dark/95 p-0 shadow-2xl ring-0 backdrop-blur-xl',
      }"
    >
      <template #content>
        <div class="overflow-hidden rounded-[28px]">
          <div class="border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <p class="text-xs font-semibold uppercase text-neutral-light/60">Lamaran Event</p>
                <h3 class="mt-2 font-display text-xl font-bold text-ui-light">Ajukan Lamaran</h3>
                <p class="mt-1 text-sm text-neutral-light/70">Lengkapi pesan dan penawaran terbaikmu.</p>
              </div>
              <UButton color="neutral" variant="ghost" icon="i-lucide-x" class="-mr-2 -mt-2 shrink-0 rounded-full" aria-label="Tutup modal" @click="showApplyModal = false" />
            </div>
          </div>

          <div class="space-y-5 px-5 py-5 sm:px-6">
            <div v-if="selectedEvent" class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div class="min-w-0">
                  <h4 class="text-base font-semibold text-ui-light">{{ selectedEvent.title }}</h4>
                  <p class="mt-1 text-sm text-neutral-light/70">{{ selectedEvent.venue_name }} • {{ selectedEvent.city }}</p>
                </div>
                <UiBadge :label="selectedEvent.status" color="success" variant="soft" />
              </div>
              <div class="mt-4 grid gap-3 text-sm text-neutral-light/70 sm:grid-cols-2">
                <div class="rounded-xl bg-white/[0.04] px-3 py-2">
                  <p class="text-xs text-neutral-light/50">Anggaran</p>
                  <p class="mt-1 font-semibold text-ui-light">{{ formatCurrency(selectedEvent.budget) }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.04] px-3 py-2">
                  <p class="text-xs text-neutral-light/50">Tanggal</p>
                  <p class="mt-1 font-semibold text-ui-light">{{ formatDate(selectedEvent.event_date) }}</p>
                </div>
              </div>

              <div class="mt-4 flex justify-start">
                <UiButton
                  v-if="selectedEvent.latitude !== undefined && selectedEvent.longitude !== undefined"
                  size="sm"
                  color="secondary"
                  variant="soft"
                  icon="mdi:map-marker-outline"
                  @click="openGoogleMaps(selectedEvent.latitude, selectedEvent.longitude)"
                >
                  Lihat Lokasi
                </UiButton>
              </div>
            </div>

            <UFormField label="Pesan" required class="w-full" :ui="{ label: 'text-sm font-semibold text-ui-light', container: 'w-full' }">
              <UTextarea
                v-model="applyForm.message"
                class="w-full"
                placeholder="Ceritakan kenapa kamu cocok untuk event ini..."
                :rows="4"
                :ui="{ base: 'w-full rounded-2xl border-white/10 bg-white/5 text-ui-light placeholder:text-neutral-light/50 focus-visible:ring-highlight' }"
              />
            </UFormField>

            <UFormField label="Harga yang Diajukan (Rp)" required class="w-full" :ui="{ label: 'text-sm font-semibold text-ui-light', container: 'w-full' }">
              <UInput
                v-model.number="applyForm.proposed_price"
                class="w-full"
                type="number"
                placeholder="Masukkan harga yang kamu ajukan"
                :ui="{ base: 'w-full rounded-2xl border-white/10 bg-white/5 text-ui-light placeholder:text-neutral-light/50 focus-visible:ring-highlight' }"
              />
              <p class="mt-2 text-xs text-neutral-light/60">Sertakan detail nilai tambah jika perlu.</p>
            </UFormField>
          </div>

          <div class="flex flex-col-reverse gap-3 border-t border-white/10 bg-white/[0.03] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
            <UButton color="neutral" variant="soft" @click="showApplyModal = false"> Batal </UButton>
            <UButton color="primary" :loading="isApplying" @click="submitApplication"> Kirim Lamaran </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import EventList from '~/components/talent/EventList.vue';
import type { Event } from '~/composables/types';
import { useApplications } from '~/composables/useApplications';
import { useEvents } from '~/composables/useEvents';
import { useGenres } from '~/composables/useGenres';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Event';

const toast = useToast();
const { formatCurrency, formatDate } = useFormatters();
const { data: genres } = useGenres();

const openGoogleMaps = (latitude?: number, longitude?: number) => {
  if (latitude === undefined || longitude === undefined) {
    return;
  }

  window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank', 'noopener,noreferrer');
};

const currentPage = ref(1);
const appliedFilters = reactive({
  status: '',
  genre: '',
  city: '',
  budget_min: '',
  budget_max: '',
  date_from: '',
  date_to: '',
  search: '',
});

const filterForm = reactive({ ...appliedFilters });
const selectedStatusOption = ref<{ label: string; value: string } | undefined>();
const selectedGenreOption = ref<{ label: string; value: string } | undefined>();

const eventFilters = computed(() => ({
  page: currentPage.value,
  status: appliedFilters.status || undefined,
  genre: appliedFilters.genre || undefined,
  city: appliedFilters.city.trim() || undefined,
  budget_min: appliedFilters.budget_min ? Number(appliedFilters.budget_min) : undefined,
  budget_max: appliedFilters.budget_max ? Number(appliedFilters.budget_max) : undefined,
  date_from: appliedFilters.date_from || undefined,
  date_to: appliedFilters.date_to || undefined,
  search: appliedFilters.search.trim() || undefined,
}));

const { data: events, pending, pagination } = useEvents(eventFilters);
const { data: applications, applyToEvent } = useApplications();

const appliedEventIds = ref<number[]>([]);
const applyingEventIds = ref<number[]>([]);

// Apply modal state
const showApplyModal = ref(false);
const selectedEvent = ref<Event | null>(null);
const isApplying = ref(false);
const applyForm = reactive({
  message: '',
  proposed_price: 0,
});

const statusOptions = [
  { label: 'Semua Status', value: '' },
  { label: 'Dibuka', value: 'dibuka' },
  { label: 'Ditutup', value: 'ditutup' },
  { label: 'Selesai', value: 'selesai' },
  { label: 'Dibatalkan', value: 'dibatalkan' },
];

const genreOptions = computed(() => [{ label: 'Semua Genre', value: '' }, ...genres.value.map((genre) => ({ label: genre.name, value: genre.name }))]);

const applyFilters = () => {
  appliedFilters.status = selectedStatusOption.value?.value ?? '';
  appliedFilters.genre = selectedGenreOption.value?.value ?? '';
  appliedFilters.city = filterForm.city.trim();
  appliedFilters.budget_min = filterForm.budget_min;
  appliedFilters.budget_max = filterForm.budget_max;
  appliedFilters.date_from = filterForm.date_from;
  appliedFilters.date_to = filterForm.date_to;
  appliedFilters.search = filterForm.search.trim();
  currentPage.value = 1;
};

const resetFilters = () => {
  for (const key of Object.keys(filterForm) as (keyof typeof filterForm)[]) {
    filterForm[key] = '';
    appliedFilters[key] = '';
  }
  selectedStatusOption.value = undefined;
  selectedGenreOption.value = undefined;
  currentPage.value = 1;
};

watch(
  applications,
  (value) => {
    const ids = value.map((item) => item.event.id).filter((eventId): eventId is number => typeof eventId === 'number');
    appliedEventIds.value = Array.from(new Set(ids));
  },
  { immediate: true },
);

const handleApply = async (eventId: number) => {
  const targetEvent = events.value.find((item) => item.id === eventId);

  if (!targetEvent) {
    return;
  }

  if (targetEvent.status !== 'dibuka') {
    toast.add({
      title: 'Event tidak tersedia',
      description: 'Hanya event dengan status dibuka yang bisa dilamar.',
      color: 'warning',
    });
    return;
  }

  if (appliedEventIds.value.includes(eventId)) {
    toast.add({
      title: 'Sudah pernah melamar',
      description: 'Kamu sudah memiliki lamaran aktif untuk event ini.',
      color: 'warning',
    });
    return;
  }

  // Show apply modal
  selectedEvent.value = targetEvent;
  applyForm.message = '';
  applyForm.proposed_price = 0;
  showApplyModal.value = true;
};

const submitApplication = async () => {
  if (!selectedEvent.value) return;

  if (!applyForm.message.trim() || !applyForm.proposed_price) {
    toast.add({
      title: 'Data belum lengkap',
      description: 'Message dan proposed price wajib diisi.',
      color: 'warning',
    });
    return;
  }

  isApplying.value = true;
  applyingEventIds.value = [...applyingEventIds.value, selectedEvent.value.id];

  try {
    await applyToEvent(selectedEvent.value.id, {
      message: applyForm.message.trim(),
      proposed_price: applyForm.proposed_price,
    });

    appliedEventIds.value = [...appliedEventIds.value, selectedEvent.value.id];
    showApplyModal.value = false;

    toast.add({
      title: 'Lamaran berhasil dikirim',
      description: `Kamu berhasil melamar ke ${selectedEvent.value.title}.`,
      color: 'success',
    });
  } catch (error: any) {
    toast.add({
      title: 'Lamaran gagal dikirim',
      description: error.message || 'Terjadi kendala saat mengirim lamaran.',
      color: 'error',
    });
  } finally {
    isApplying.value = false;
    applyingEventIds.value = applyingEventIds.value.filter((id) => id !== selectedEvent.value?.id);
  }
};

const statusSummary = computed(() => ({
  open: events.value.filter((item) => item.status === 'dibuka').length,
  closed: events.value.filter((item) => item.status === 'ditutup').length,
  completed: events.value.filter((item) => item.status === 'selesai').length,
}));
</script>
