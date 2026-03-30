<template>
  <UiCard title="Recent Applications" description="Riwayat lamaran event terbaru" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="n" class="h-20 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada lamaran terbaru.">
      <template #item="{ item }">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
            <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{{ item.subtitle }}</p>
            <p class="mt-1 text-xs font-medium text-primary">{{ item.meta }}</p>
          </div>
          <UiBadge class="shrink-0" :label="item.statusLabel" :color="item.statusColor" variant="soft" />
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { Application, ApplicationStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    applications: Application[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const { formatCurrency } = useFormatters();

const statusMap: Record<ApplicationStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

const mappedItems = computed(() =>
  props.applications.map((application) => ({
    id: application.id,
    title: application.event.title,
    subtitle: 'Menunggu respons organizer',
    meta: `Harga tawaran: ${formatCurrency(application.proposed_price)}`,
    statusLabel: statusMap[application.status].label,
    statusColor: statusMap[application.status].color,
  })),
);
</script>
