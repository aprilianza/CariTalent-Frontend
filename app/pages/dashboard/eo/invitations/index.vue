<template>
  <div class="space-y-6">
    <!-- Page header -->
    <UiCard card-class="border-white/10 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
      <div>
        <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Invitations Terkirim
        </h1>
        <p class="mt-1 text-sm text-neutral-light/70">
          Daftar talent yang kamu undang secara langsung ke event kamu
        </p>
      </div>
    </UiCard>

    <!-- Stats summary -->
    <div class="grid gap-4 sm:grid-cols-3">
      <div
        v-for="stat in invitationStats"
        :key="stat.label"
        class="rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
      >
        <p class="text-2xl font-bold" :class="stat.colorClass">{{ stat.value }}</p>
        <p class="mt-1 text-xs text-neutral-light/60">{{ stat.label }}</p>
      </div>
    </div>

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
        <span v-if="tab.count >= 0" class="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-xs">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Invitation list -->
    <div v-if="pending" class="space-y-3">
      <USkeleton v-for="n in 4" :key="`skeleton-${n}`" class="h-20 w-full rounded-xl" />
    </div>

    <div v-else-if="filteredInvitations.length === 0" class="rounded-xl border border-dashed border-neutral-300 p-8 text-center dark:border-neutral-700">
      <Icon name="mdi:send-outline" class="mx-auto h-10 w-10 text-neutral-light/20 mb-3" />
      <p class="text-sm text-neutral-light/50">
        {{ activeFilter === 'all' ? 'Belum ada invitation yang dikirim.' : `Tidak ada invitation berstatus ${activeFilter}.` }}
      </p>
      <UiButton
        class="mt-4"
        size="sm"
        color="primary"
        variant="soft"
        icon="mdi:calendar-star-outline"
        @click="navigateTo('/dashboard/eo/events')"
      >
        Lihat Events untuk Undang Talent
      </UiButton>
    </div>

    <UiCard v-else card-class="h-full">
      <ul class="space-y-3">
        <li
          v-for="inv in filteredInvitations"
          :key="inv.id"
          class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-violet-500/20 hover:bg-white/8"
        >
          <div class="space-y-2">
            <div class="flex flex-wrap items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                  {{ inv.talent.stage_name }}
                </p>
                <div class="mt-1 flex flex-wrap items-center gap-2">
                  <span class="text-xs text-neutral-500 dark:text-neutral-400">
                    <Icon name="mdi:map-marker-outline" class="inline h-3 w-3" /> {{ inv.talent.city || '-' }}
                  </span>
                  <span class="text-xs text-neutral-500 dark:text-neutral-400">
                    <Icon name="mdi:star-outline" class="inline h-3 w-3 text-yellow-400" /> {{ inv.talent.average_rating.toFixed(1) }}
                  </span>
                  <UiBadge v-if="inv.talent.verified" label="Verified" color="success" variant="soft" size="sm" dot />
                </div>
              </div>
              <UiBadge :label="statusMap[inv.status].label" :color="statusMap[inv.status].color" variant="soft" />
            </div>

            <div class="flex flex-wrap gap-1.5">
              <UiBadge v-for="g in inv.talent.genre" :key="g" :label="g" color="secondary" variant="soft" size="sm" />
            </div>

            <p class="text-xs text-neutral-light/60">
              Harga ditawarkan:
              <span class="font-semibold text-ui-light">{{ formatCurrency(inv.proposed_price) }}</span>
              · Dikirim: {{ formatDateSafe(inv.created_at) }}
            </p>
          </div>
        </li>
      </ul>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import { useEoApplications } from '~/composables/useEoApplications';
import { useFormatters } from '~/composables/useFormatters';
import type { ApplicationStatus } from '~/composables/types';

definePageMeta({
  layout: 'eo',
});

const pageTitle = useState('eo-layout-title');
pageTitle.value = 'Invitations';

const { data: allApplications, pending } = useEoApplications();
const { formatCurrency, formatDate } = useFormatters();

// Only show applications with source = invitation
const invitations = computed(() => allApplications.value.filter((a) => a.source === 'invitation'));

type FilterValue = ApplicationStatus | 'all';
const activeFilter = ref<FilterValue>('all');

const statusMap: Record<ApplicationStatus, { label: string; color: 'success' | 'warning' | 'error' }> = {
  pending: { label: 'Pending', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

const filterTabs = computed<{ label: string; value: FilterValue; count: number }[]>(() => [
  { label: 'Semua', value: 'all', count: invitations.value.length },
  { label: 'Pending', value: 'pending', count: invitations.value.filter((i) => i.status === 'pending').length },
  { label: 'Accepted', value: 'accepted', count: invitations.value.filter((i) => i.status === 'accepted').length },
  { label: 'Rejected', value: 'rejected', count: invitations.value.filter((i) => i.status === 'rejected').length },
]);

const filteredInvitations = computed(() => {
  if (activeFilter.value === 'all') return invitations.value;
  return invitations.value.filter((i) => i.status === activeFilter.value);
});

const invitationStats = computed(() => [
  {
    label: 'Total Terkirim',
    value: invitations.value.length,
    colorClass: 'text-violet-400',
  },
  {
    label: 'Accepted',
    value: invitations.value.filter((i) => i.status === 'accepted').length,
    colorClass: 'text-emerald-400',
  },
  {
    label: 'Pending',
    value: invitations.value.filter((i) => i.status === 'pending').length,
    colorClass: 'text-amber-400',
  },
]);

const formatDateSafe = (value?: string) => {
  if (!value) return '-';
  try { return formatDate(value); } catch { return value; }
};
</script>
