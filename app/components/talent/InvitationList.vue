<template>
  <UiCard id="invitations" title="Invitations" description="Undangan event yang menunggu keputusanmu" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 2" :key="n" class="h-24 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada undangan masuk.">
      <template #item="{ item }">
        <div class="space-y-3">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Organizer: {{ item.organizer }}</p>
              <p class="mt-1 text-xs font-medium text-primary">Offer: {{ item.offer }}</p>
            </div>
            <UiBadge class="shrink-0" :label="item.statusLabel" :color="item.statusColor" variant="soft" />
          </div>

          <div class="flex flex-wrap gap-2">
            <UiButton size="sm" color="success" variant="soft" @click="emit('accept', item.id as number)"> Accept </UiButton>
            <UiButton size="sm" color="error" variant="soft" @click="emit('reject', item.id as number)"> Reject </UiButton>
          </div>
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { Invitation, InvitationStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    invitations: Invitation[];
    loading?: boolean;
  }>(),
  {
    loading: false,
  },
);

const emit = defineEmits<{
  accept: [id: number];
  reject: [id: number];
}>();

const { formatCurrency } = useFormatters();

const statusMap: Record<InvitationStatus, { label: string; color: string }> = {
  pending: { label: 'Pending', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

const mappedItems = computed(() =>
  props.invitations.map((invitation) => ({
    id: invitation.id,
    title: invitation.event.title,
    organizer: invitation.organizer_name,
    offer: formatCurrency(invitation.offered_price),
    statusLabel: statusMap[invitation.status].label,
    statusColor: statusMap[invitation.status].color,
  })),
);
</script>
