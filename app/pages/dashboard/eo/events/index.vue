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
          @click="showCreateModal = true"
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

    <!-- Create Event Modal -->
    <EoCreateEventModal
      v-model:open="showCreateModal"
      :genres="genres"
      :loading="creating"
      @submit="handleCreateEvent"
    />
  </div>
</template>

<script setup lang="ts">
import EoEventList from '~/components/eo/EoEventList.vue';
import EoCreateEventModal from '~/components/eo/EoCreateEventModal.vue';
import { useEoEvents } from '~/composables/useEoEvents';
import { useGenres } from '~/composables/useGenres';
import type { CreateEventPayload, EventStatus } from '~/composables/types';

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

const handleCreateEvent = async (payload: CreateEventPayload) => {
  creating.value = true;

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 800));

  creating.value = false;
  showCreateModal.value = false;

  toast.add({
    title: 'Event berhasil dibuat!',
    description: `"${payload.title}" berhasil dibuat dengan status ${payload.status}.`,
    color: 'success',
    icon: 'mdi:check-circle-outline',
  });
};

const handleEditEvent = (id: number) => {
  toast.add({
    title: 'Edit Event',
    description: `Membuka editor untuk event #${id}...`,
    color: 'info',
  });
};

const handleCancelEvent = async (id: number) => {
  await new Promise((resolve) => setTimeout(resolve, 400));

  toast.add({
    title: 'Event dibatalkan',
    description: `Event #${id} berhasil dibatalkan.`,
    color: 'warning',
    icon: 'mdi:close-circle-outline',
  });
};
</script>
