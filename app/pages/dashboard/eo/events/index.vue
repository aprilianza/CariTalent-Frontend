<template>
  <div class="space-y-6">
    <!-- Page header -->
    <UiCard card-class="border-white/10 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            My Events
          </h1>
          <p class="mt-1 text-sm text-neutral-light/70">
            Kelola semua event yang kamu buat — {{ events.length }} event total
          </p>
        </div>
        <UiButton
          id="btn-create-event"
          icon="mdi:plus-circle-outline"
          color="primary"
          variant="soft"
          @click="openCreateModal"
        >
          Buat Event Baru
        </UiButton>
      </div>
    </UiCard>

    <!-- Status filter tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in statusTabs"
        :key="tab.value"
        :class="[
          'rounded-xl px-4 py-1.5 text-sm font-medium transition-all',
          activeStatus === tab.value
            ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300'
            : 'border border-white/10 bg-white/5 text-neutral-light/60 hover:bg-white/8 hover:text-neutral-light',
        ]"
        @click="activeStatus = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-xs">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Event list -->
    <EoEventList
      :events="filteredEvents"
      :loading="eventsPending"
      :detailed="true"
      @view-applicants="(id) => navigateTo(`/dashboard/eo/events/${id}/applicants`)"
      @view-recommendations="(id) => navigateTo(`/dashboard/eo/events/${id}/recommendations`)"
      @edit="handleEditEvent"
      @cancel="handleCancelEvent"
    />

    <!-- Create / Edit Event Modal -->
    <EoCreateEventModal
      v-model:open="showCreateModal"
      :genres="genres"
      :loading="creating"
      :mode="modalMode"
      :initial-data="editingEventData"
      @submit="handleEventSubmit"
    />

    <!-- Cancel Confirmation Modal -->
    <UModal v-model:open="showCancelModal" :ui="{ content: 'bg-transparent ring-0 shadow-none sm:max-w-md w-full mx-auto' }">
      <template #content>
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl">
          <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-red-500/20 blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 space-y-6 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
               <Icon name="mdi:alert-circle-outline" class="h-8 w-8" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-neutral-light">Batalkan Event?</h3>
              <p class="mt-2 text-sm text-neutral-light/70">
                Apakah kamu yakin ingin membatalkan dan menghapus event ini? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            
            <div class="flex justify-center gap-3 pt-2">
              <UiButton color="neutral" variant="ghost" class="hover:bg-white/5" @click="showCancelModal = false">Kembali</UiButton>
              <UiButton color="error" variant="soft" :loading="cancelling" @click="confirmCancelEvent" class="border border-red-500/30 font-semibold">
                Ya, Hapus Event
              </UiButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import EoEventList from '~/components/eo/EoEventList.vue';
import EoCreateEventModal from '~/components/eo/EoCreateEventModal.vue';
import { useEoEvents } from '~/composables/useEoEvents';
import { useGenres } from '~/composables/useGenres';
import type { CreateEventPayload, EventStatus, EoEvent } from '~/composables/types';

definePageMeta({
  layout: 'eo',
});

const pageTitle = useState('eo-layout-title');
pageTitle.value = 'My Events';

const toast = useToast();

const { data: events, pending: eventsPending } = useEoEvents();
const { data: genres } = useGenres();

const showCreateModal = ref(false);
const creating = ref(false);
const activeStatus = ref<EventStatus | 'all'>('all');

// Modal State
const modalMode = ref<'create' | 'edit'>('create');
const editingEventId = ref<number | null>(null);
const editingEventData = ref<Partial<CreateEventPayload>>({});

// Cancel State
const showCancelModal = ref(false);
const cancellingEventId = ref<number | null>(null);
const cancelling = ref(false);

type StatusTabValue = EventStatus | 'all';

const statusTabs = computed<{ label: string; value: StatusTabValue; count: number }[]>(() => [
  { label: 'Semua', value: 'all', count: events.value.length },
  { label: 'Draft', value: 'draft', count: events.value.filter((e) => e.status === 'draft').length },
  { label: 'Open', value: 'open', count: events.value.filter((e) => e.status === 'open').length },
  { label: 'Closed', value: 'closed', count: events.value.filter((e) => e.status === 'closed').length },
  { label: 'Completed', value: 'completed', count: events.value.filter((e) => e.status === 'completed').length },
  { label: 'Cancelled', value: 'cancelled', count: events.value.filter((e) => e.status === 'cancelled').length },
]);

const filteredEvents = computed(() => {
  if (activeStatus.value === 'all') return events.value;
  return events.value.filter((e) => e.status === activeStatus.value);
});

const openCreateModal = () => {
  modalMode.value = 'create';
  editingEventData.value = {};
  showCreateModal.value = true;
};

const handleEventSubmit = async (payload: CreateEventPayload) => {
  creating.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  creating.value = false;
  showCreateModal.value = false;

  if (modalMode.value === 'edit') {
    const idx = events.value.findIndex(e => e.id === editingEventId.value);
    if (idx !== -1) {
      // Optimistic Update
      const mappedGenres = payload.genre_ids.map(id => genres.value?.find(g => g.id === id)?.name).filter(Boolean) as string[];
      events.value[idx] = { 
        ...events.value[idx], 
        ...payload,
        genre_needed: mappedGenres,
      } as EoEvent;
    }
    toast.add({
      title: 'Perubahan disimpan!',
      description: `Event "${payload.title}" berhasil diperbarui.`,
      color: 'success',
      icon: 'mdi:check-circle-outline',
    });
  } else {
    toast.add({
      title: 'Event berhasil dibuat!',
      description: `"${payload.title}" berhasil dibuat dengan status ${payload.status}.`,
      color: 'success',
      icon: 'mdi:check-circle-outline',
    });
  }
};

const handleEditEvent = (id: number) => {
  const event = events.value.find(e => e.id === id);
  if (!event) return;

  editingEventId.value = id;
  const genreIds = event.genre_needed?.map(name => genres.value?.find(g => g.name === name)?.id).filter(Boolean) as number[];

  editingEventData.value = {
    title: event.title,
    description: event.description || '',
    budget: event.budget,
    event_date: event.event_date,
    venue_name: event.venue_name,
    city: event.city || '',
    status: event.status,
    genre_ids: genreIds || [],
  };

  modalMode.value = 'edit';
  showCreateModal.value = true;
};

const handleCancelEvent = (id: number) => {
  cancellingEventId.value = id;
  showCancelModal.value = true;
};

const confirmCancelEvent = async () => {
  if (!cancellingEventId.value) return;
  cancelling.value = true;

  await new Promise((resolve) => setTimeout(resolve, 400));
  
  const idx = events.value.findIndex(e => e.id === cancellingEventId.value);
  if (idx !== -1) {
    events.value.splice(idx, 1);
  }

  cancelling.value = false;
  showCancelModal.value = false;

  toast.add({
    title: 'Event dibatalkan',
    description: `Event berhasil dihapus/dibatalkan.`,
    color: 'warning',
    icon: 'mdi:delete-outline',
  });
  cancellingEventId.value = null;
};
</script>
