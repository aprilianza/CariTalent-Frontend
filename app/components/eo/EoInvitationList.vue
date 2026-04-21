<template>
  <UiCard title="Invitations Terkirim" description="Daftar undangan yang sudah dikirim ke talent" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="`inv-skeleton-${n}`" class="h-20 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada invitation yang dikirim.">
      <template #item="{ item }">
        <div class="space-y-2">
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.talentName }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                Event: <span class="font-medium">{{ item.eventTitle }}</span>
              </p>
            </div>
            <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" />
          </div>

          <div class="flex flex-wrap gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span
              >Harga ditawarkan: <span class="font-medium text-ui-light">{{ item.offeredPrice }}</span></span
            >
            <span
              >Dikirim: <span class="font-medium text-ui-light">{{ item.createdAt }}</span></span
            >
          </div>
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { EoApplication, ApplicationStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    invitations: EoApplication[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const { formatCurrency, formatDate } = useFormatters();

const statusMap: Record<ApplicationStatus, { label: string; color: 'success' | 'warning' | 'error' }> = {
  pending: { label: 'Pending', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

const formatDateSafe = (value?: string) => {
  if (!value) return '-';
  try {
    return formatDate(value);
  } catch {
    return value;
  }
};

const mappedItems = computed(() =>
  props.invitations.map((inv) => {
    const status = statusMap[inv.status];
    return {
      id: String(inv.id),
      title: inv.talent.stage_name,
      talentName: inv.talent.stage_name,
      eventTitle: '-', // injected from parent context
      offeredPrice: formatCurrency(inv.proposed_price),
      createdAt: formatDateSafe(inv.created_at),
      statusLabel: status.label,
      statusColor: status.color,
    };
  }),
);
</script>
