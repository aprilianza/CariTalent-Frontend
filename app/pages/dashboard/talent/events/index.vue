<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-neutral-light/70">Talent Workspace</p>
          <h1 class="font-display bg-gradient-to-r from-highlight to-accent bg-clip-text text-2xl font-bold text-transparent md:text-3xl">Browse Events</h1>
          <div class="mt-3 flex flex-wrap gap-2">
            <UiBadge :label="`Open ${statusSummary.open}`" color="success" variant="soft" />
            <UiBadge :label="`Closed ${statusSummary.closed}`" color="warning" variant="soft" />
            <UiBadge :label="`Completed ${statusSummary.completed}`" color="primary" variant="soft" />
          </div>
        </div>
        <div class="flex items-center gap-2">
          <UiBadge :label="`${events.length} total`" color="secondary" variant="soft" />
          <UPagination v-if="pagination && pagination.last_page > 1" v-model="currentPage" :page-count="pagination.per_page" :total="pagination.total" />
        </div>
      </div>
    </UiCard>

    <EventList :events="events" :loading="pending" :applied-event-ids="appliedEventIds" :applying-event-ids="applyingEventIds" @apply="handleApply" />

    <!-- Apply Modal -->
    <UModal v-model:open="showApplyModal">
      <template #content>
        <div class="mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-neutral-dark/95 p-6 shadow-2xl backdrop-blur">
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-light/60">Lamaran Event</p>
              <h3 class="mt-2 text-xl font-bold text-ui-light">Ajukan Lamaran</h3>
              <p class="mt-1 text-sm text-neutral-light/70">Lengkapi pesan dan penawaran terbaikmu.</p>
            </div>
            <UButton color="neutral" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-mt-1" @click="showApplyModal = false" />
          </div>

          <div class="mt-6 space-y-5">
            <div v-if="selectedEvent" class="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h4 class="text-base font-semibold text-ui-light">{{ selectedEvent.title }}</h4>
              <p class="mt-1 text-sm text-neutral-light/70">{{ selectedEvent.venue_name }} • {{ selectedEvent.city }}</p>
              <p class="mt-2 text-sm text-neutral-light/70">
                Anggaran: <span class="font-semibold text-ui-light">Rp {{ selectedEvent.budget?.toLocaleString() }}</span>
              </p>
            </div>

            <UFormField label="Pesan" required>
              <UTextarea v-model="applyForm.message" placeholder="Ceritakan kenapa kamu cocok untuk event ini..." :rows="4" :ui="{ base: 'rounded-2xl border-white/10 bg-white/5 text-ui-light placeholder:text-neutral-light/50' }" />
            </UFormField>

            <UFormField label="Harga yang Diajukan (Rp)" required>
              <UInput v-model.number="applyForm.proposed_price" type="number" placeholder="Masukkan harga yang kamu ajukan" :ui="{ base: 'rounded-2xl border-white/10 bg-white/5 text-ui-light placeholder:text-neutral-light/50' }" />
              <p class="mt-2 text-xs text-neutral-light/60">Sertakan detail nilai tambah jika perlu.</p>
            </UFormField>
          </div>

          <div class="mt-7 flex flex-wrap justify-end gap-3">
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

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Events';

const toast = useToast();

const currentPage = ref(1);
const { data: events, pending, pagination, refresh: refreshEvents } = useEvents({ page: currentPage.value });
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

// Watch page changes and refetch events
watch(currentPage, async (newPage) => {
  const { refresh } = useEvents({ page: newPage });
  await refresh();
});

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

  if (targetEvent.status !== 'open') {
    toast.add({
      title: 'Event tidak tersedia',
      description: 'Hanya event dengan status open yang bisa dilamar.',
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
  open: events.value.filter((item) => item.status === 'open').length,
  closed: events.value.filter((item) => item.status === 'closed').length,
  completed: events.value.filter((item) => item.status === 'completed').length,
}));
</script>
