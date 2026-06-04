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
      @delete="handleDeleteEvent"
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

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="showDeleteModal" :ui="{ content: 'bg-transparent ring-0 shadow-none sm:max-w-md w-full mx-auto' }">
      <template #content>
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl">
          <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-red-500/20 blur-3xl pointer-events-none"></div>
          
          <div class="relative z-10 space-y-6 text-center">
            <div class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
               <Icon name="mdi:trash-can-outline" class="h-8 w-8" />
            </div>
            <div>
              <h3 class="text-xl font-bold text-neutral-light">Hapus Event?</h3>
              <p class="mt-2 text-sm text-neutral-light/70">
                Apakah kamu yakin ingin menghapus event ini? Tindakan ini akan menghapus semua data terkait secara permanen dan tidak dapat dibatalkan.
              </p>
            </div>
            
            <div class="flex justify-center gap-3 pt-2">
              <UiButton color="neutral" variant="ghost" class="hover:bg-white/5" @click="showDeleteModal = false">Kembali</UiButton>
              <UiButton color="error" variant="soft" :loading="deleting" @click="confirmDeleteEvent" class="border border-red-500/30 font-semibold">
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

const { data: events, pending: eventsPending, createEvent, updateEvent, deleteEvent } = useEoEvents();
const { data: genres } = useGenres();

const showCreateModal = ref(false);
const creating = ref(false);
const activeStatus = ref<EventStatus | 'all'>('all');

// Modal State
const modalMode = ref<'create' | 'edit'>('create');
const editingEventId = ref<number | null>(null);
const editingEventData = ref<Partial<CreateEventPayload>>({});

// Delete State
const showDeleteModal = ref(false);
const deletingEventId = ref<number | null>(null);
const deleting = ref(false);

type StatusTabValue = EventStatus | 'all';

const statusTabs = computed<{ label: string; value: StatusTabValue; count: number }[]>(() => [
  { label: 'Semua', value: 'all', count: events.value.length },
  { label: 'Dibuka', value: 'dibuka', count: events.value.filter((e) => e.status === 'dibuka').length },
  { label: 'Ditutup', value: 'ditutup', count: events.value.filter((e) => e.status === 'ditutup').length },
  { label: 'Selesai', value: 'selesai', count: events.value.filter((e) => e.status === 'selesai').length },
  { label: 'Dibatalkan', value: 'dibatalkan', count: events.value.filter((e) => e.status === 'dibatalkan').length },
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

  try {
    if (modalMode.value === 'edit' && editingEventId.value) {
      await updateEvent(editingEventId.value, payload);
      showCreateModal.value = false;

      toast.add({
        title: 'Perubahan disimpan!',
        description: `Event "${payload.title}" berhasil diperbarui.`,
        color: 'success',
        icon: 'mdi:check-circle-outline',
      });
    } else {
      await createEvent(payload);
      showCreateModal.value = false;

      toast.add({
        title: 'Event berhasil dibuat!',
        description: `"${payload.title}" berhasil dibuat dengan status ${payload.status}.`,
        color: 'success',
        icon: 'mdi:check-circle-outline',
      });
    }
  } catch (error: any) {
    toast.add({
      title: modalMode.value === 'edit' ? 'Gagal memperbarui event' : 'Gagal membuat event',
      description: error?.message || 'Terjadi kesalahan sistem',
      color: 'error',
    });
  } finally {
    creating.value = false;
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
    latitude: event.latitude,
    longitude: event.longitude,
  };

  modalMode.value = 'edit';
  showCreateModal.value = true;
};

const handleDeleteEvent = (id: number) => {
  deletingEventId.value = id;
  showDeleteModal.value = true;
};

const confirmDeleteEvent = async () => {
  if (!deletingEventId.value) return;
  deleting.value = true;

  try {
    await deleteEvent(deletingEventId.value);
    showDeleteModal.value = false;

    toast.add({
      title: 'Event berhasil dihapus',
      description: `Event telah dihapus secara permanen beserta data terkait.`,
      color: 'success',
      icon: 'mdi:trash-can-outline',
    });
  } catch (error: any) {
    toast.add({
      title: 'Gagal menghapus event',
      description: error?.message || 'Terjadi kesalahan sistem',
      color: 'error',
    });
  } finally {
    deleting.value = false;
    deletingEventId.value = null;
  }
};
</script>
