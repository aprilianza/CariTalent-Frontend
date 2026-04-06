<template>
  <div class="space-y-6">
    <!-- Back nav & page header -->
    <UiCard card-class="border-white/10 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
      <div class="space-y-4">
        <UiButton
          size="sm"
          color="neutral"
          variant="ghost"
          icon="mdi:arrow-left"
          @click="navigateTo('/dashboard/eo/events')"
        >
          Kembali ke Events
        </UiButton>

        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Pelamar Event
            </h1>
            <p class="mt-1 text-sm text-neutral-light/70">
              Event ID: #{{ route.params.id }} · {{ applications.length }} pelamar
            </p>
          </div>
          <UiButton
            icon="mdi:star-shooting-outline"
            color="secondary"
            variant="soft"
            @click="navigateTo(`/dashboard/eo/events/${route.params.id}/recommendations`)"
          >
            Lihat Rekomendasi
          </UiButton>
        </div>
      </div>
    </UiCard>

    <!-- Filter tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        :class="[
          'rounded-xl px-4 py-1.5 text-sm font-medium transition-all',
          activeFilter === tab.value
            ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300'
            : 'border border-white/10 bg-white/5 text-neutral-light/60 hover:bg-white/8 hover:text-neutral-light',
        ]"
        @click="activeFilter = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-xs">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Application list -->
    <EoApplicationList
      :applications="filteredApplications"
      :loading="pending"
      :detailed="true"
      @accept="handleAccept"
      @reject="handleReject"
    />
  </div>
</template>

<script setup lang="ts">
import EoApplicationList from '~/components/eo/EoApplicationList.vue';
import { useEoApplications } from '~/composables/useEoApplications';
import type { ApplicationStatus, EoApplication } from '~/composables/types';

definePageMeta({
  layout: 'eo',
});

const pageTitle = useState('eo-layout-title');
pageTitle.value = 'Pelamar Event';

const route = useRoute();
const toast = useToast();

const eventId = computed(() => Number(route.params.id));
const { data: rawApplications, pending } = useEoApplications(eventId.value);

// Local reactive copy for optimistic updates
const applications = ref<EoApplication[]>([]);

watch(
  rawApplications,
  (val) => {
    applications.value = val.map((a) => ({ ...a }));
  },
  { immediate: true },
);

type FilterValue = ApplicationStatus | 'all' | 'invitation';

const activeFilter = ref<FilterValue>('all');

const filterTabs = computed<{ label: string; value: FilterValue; count: number }[]>(() => [
  { label: 'Semua', value: 'all', count: applications.value.length },
  { label: 'Pending', value: 'pending', count: applications.value.filter((a) => a.status === 'pending').length },
  { label: 'Accepted', value: 'accepted', count: applications.value.filter((a) => a.status === 'accepted').length },
  { label: 'Rejected', value: 'rejected', count: applications.value.filter((a) => a.status === 'rejected').length },
  { label: 'Via Invitation', value: 'invitation', count: applications.value.filter((a) => a.source === 'invitation').length },
]);

const filteredApplications = computed(() => {
  if (activeFilter.value === 'all') return applications.value;
  if (activeFilter.value === 'invitation') return applications.value.filter((a) => a.source === 'invitation');
  return applications.value.filter((a) => a.status === activeFilter.value);
});

const handleAccept = async (applicationId: number, agreedPrice: number) => {
  // Optimistic update
  const idx = applications.value.findIndex((a) => a.id === applicationId);
  if (idx !== -1) {
    applications.value[idx] = { ...applications.value[idx], status: 'accepted' };
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  toast.add({
    title: 'Lamaran diterima!',
    description: `Booking telah dibuat dengan harga deal Rp ${agreedPrice.toLocaleString('id-ID')}.`,
    color: 'success',
    icon: 'mdi:check-circle-outline',
  });
};

const handleReject = async (applicationId: number) => {
  // Optimistic update
  const idx = applications.value.findIndex((a) => a.id === applicationId);
  if (idx !== -1) {
    applications.value[idx] = { ...applications.value[idx], status: 'rejected' };
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  toast.add({
    title: 'Lamaran ditolak',
    description: `Talent telah diberi tahu bahwa lamarannya tidak diterima.`,
    color: 'warning',
    icon: 'mdi:close-circle-outline',
  });
};
</script>
