<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
        Moderasi Event
      </h1>
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
      <div v-if="pending" class="flex flex-col items-center justify-center gap-3 py-16">
        <Icon name="mdi:loading" class="h-8 w-8 animate-spin text-highlight" />
        <p class="text-sm text-neutral-light/60">Memuat data event...</p>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredEvents.length === 0"
        class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-16"
      >
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Icon name="mdi:calendar-remove-outline" class="h-10 w-10 text-neutral-light/40" />
        </div>
        <p class="text-sm font-medium text-neutral-light/60">Tidak ada event ditemukan.</p>
      </div>

      <!-- Cards -->
      <UiCard
        v-for="event in filteredEvents"
        :key="event.id"
        card-class="transition-all hover:border-highlight/30"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <!-- Event Info -->
          <div class="flex-1 min-w-0 space-y-2">
            <div class="flex flex-wrap items-center gap-2">
              <p class="text-sm font-bold text-ui-light">{{ event.title }}</p>
              <UiBadge
                :label="statusLabel(event.status)"
                :color="statusColor(event.status)"
                variant="soft"
                dot
              />
            </div>
            <p class="text-xs text-neutral-light/60 line-clamp-2">{{ event.description }}</p>
            <div class="flex flex-wrap gap-1.5">
              <UiBadge v-for="g in event.genre_needed" :key="g" :label="g" color="info" size="sm" variant="subtle" />
            </div>
            <div class="flex flex-wrap items-center gap-4 text-xs text-neutral-light/60">
              <span class="flex items-center gap-1">
                <Icon name="mdi:account-outline" class="h-3.5 w-3.5" />
                {{ event.organizer_name }}
              </span>
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
            <UiButton
              label="Moderasi"
              icon="mdi:gavel"
              color="primary"
              variant="soft"
              size="sm"
              :disabled="event.status === 'cancelled'"
              @click="openModerateModal(event)"
            />
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
            <label class="block text-xs font-semibold uppercase tracking-wide text-neutral-light/60">
              Ubah Status
            </label>
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

            <label class="block text-xs font-semibold uppercase tracking-wide text-neutral-light/60 mt-4">
              Alasan (opsional)
            </label>
            <textarea
              v-model="moderateReason"
              rows="3"
              placeholder="Tuliskan alasan moderasi..."
              class="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-ui-light placeholder-neutral-light/40 outline-none transition focus:border-highlight/50 focus:bg-white/8 resize-none"
            />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <UiButton label="Batal" color="neutral" variant="soft" @click="showModerateModal = false" />
            <UiButton
              label="Terapkan"
              color="primary"
              variant="solid"
              :loading="moderating"
              :disabled="!moderateStatus"
              @click="doModerate"
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
const { events, pending, moderateEvent } = useAdminEvents();
const { formatCurrency, formatDate } = useFormatters();

const search = ref('');
const statusFilter = ref<'all' | EventStatus>('all');
const showModerateModal = ref(false);
const eventToModerate = ref<Event | null>(null);
const moderateStatus = ref<EventStatus | ''>('');
const moderateReason = ref('');
const moderating = ref(false);

const statusTabs = [
  { label: 'Semua', value: 'all' as const },
  { label: 'Draft', value: 'draft' as const },
  { label: 'Open', value: 'open' as const },
  { label: 'Closed', value: 'closed' as const },
  { label: 'Completed', value: 'completed' as const },
  { label: 'Cancelled', value: 'cancelled' as const },
];

const moderateStatuses: { value: EventStatus; label: string; activeColor: 'primary' | 'error' | 'success' | 'neutral' }[] = [
  { value: 'open', label: 'Open', activeColor: 'success' },
  { value: 'closed', label: 'Closed', activeColor: 'primary' },
  { value: 'cancelled', label: 'Cancelled', activeColor: 'error' },
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
    draft: 'Draft',
    open: 'Open',
    closed: 'Closed',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return map[status] ?? status;
};

const statusColor = (status: EventStatus): 'success' | 'primary' | 'error' | 'neutral' | 'info' => {
  const map: Record<EventStatus, 'success' | 'primary' | 'error' | 'neutral' | 'info'> = {
    open: 'success',
    closed: 'primary',
    cancelled: 'error',
    completed: 'info',
    draft: 'neutral',
  };
  return map[status] ?? 'neutral';
};

const openModerateModal = (event: Event) => {
  eventToModerate.value = event;
  moderateStatus.value = event.status;
  moderateReason.value = '';
  showModerateModal.value = true;
};

const doModerate = async () => {
  if (!eventToModerate.value || !moderateStatus.value) return;
  moderating.value = true;

  await new Promise((r) => setTimeout(r, 700));

  moderateEvent(eventToModerate.value.id, {
    status: moderateStatus.value as EventStatus,
    reason: moderateReason.value || undefined,
  });

  toast.add({
    title: 'Event dimoderasi',
    description: `Status "${eventToModerate.value.title}" diubah ke "${statusLabel(moderateStatus.value as EventStatus)}".`,
    color: 'success',
  });

  moderating.value = false;
  showModerateModal.value = false;
  eventToModerate.value = null;
};
</script>
