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
        <UiBadge :label="`${events.length} total`" color="secondary" variant="soft" />
      </div>
    </UiCard>

    <EventList :events="events" :loading="pending" :applied-event-ids="appliedEventIds" :applying-event-ids="applyingEventIds" @apply="handleApply" />
  </div>
</template>

<script setup lang="ts">
import EventList from '~/components/talent/EventList.vue';
import { useApplications } from '~/composables/useApplications';
import { useEvents } from '~/composables/useEvents';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Events';

const toast = useToast();

const { data: events, pending } = useEvents();
const { data: applications } = useApplications();

const appliedEventIds = ref<number[]>([]);
const applyingEventIds = ref<number[]>([]);

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

  applyingEventIds.value = [...applyingEventIds.value, eventId];

  await new Promise((resolve) => setTimeout(resolve, 500));

  appliedEventIds.value = [...appliedEventIds.value, eventId];
  applyingEventIds.value = applyingEventIds.value.filter((id) => id !== eventId);

  toast.add({
    title: 'Lamaran berhasil dikirim',
    description: `Kamu berhasil melamar ke ${targetEvent.title} (dummy update).`,
    color: 'success',
  });
};

const statusSummary = computed(() => ({
  open: events.value.filter((item) => item.status === 'open').length,
  closed: events.value.filter((item) => item.status === 'closed').length,
  completed: events.value.filter((item) => item.status === 'completed').length,
}));
</script>
