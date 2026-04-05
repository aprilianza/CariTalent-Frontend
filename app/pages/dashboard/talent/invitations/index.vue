<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-neutral-light/70">Talent Workspace</p>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">Invitations</h1>
          <div class="mt-3 flex flex-wrap gap-2">
            <UiBadge :label="`Pending ${statusSummary.pending}`" color="warning" variant="soft" />
            <UiBadge :label="`Accepted ${statusSummary.accepted}`" color="success" variant="soft" />
            <UiBadge :label="`Rejected ${statusSummary.rejected}`" color="error" variant="soft" />
          </div>
        </div>
        <UiBadge :label="`${invitations.length} total`" color="primary" variant="soft" />
      </div>
    </UiCard>

    <InvitationList :invitations="invitations" :loading="pending" @accept="handleInvitation('accept', $event)" @reject="handleInvitation('reject', $event)" />
  </div>
</template>

<script setup lang="ts">
import InvitationList from '~/components/talent/InvitationList.vue';
import type { Invitation } from '~/composables/types';
import { useInvitations } from '~/composables/useInvitations';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Invitations';

const toast = useToast();

const { data: invitationsRaw, pending } = useInvitations();
const invitations = ref<Invitation[]>([]);

watch(
  invitationsRaw,
  (value) => {
    invitations.value = value.map((item) => ({ ...item }));
  },
  { immediate: true },
);

const statusSummary = computed(() => ({
  pending: invitations.value.filter((item) => item.status === 'pending').length,
  accepted: invitations.value.filter((item) => item.status === 'accepted').length,
  rejected: invitations.value.filter((item) => item.status === 'rejected').length,
}));

const handleInvitation = (action: 'accept' | 'reject', invitationId: number) => {
  const invitationIndex = invitations.value.findIndex((item) => item.id === invitationId);
  const current = invitations.value[invitationIndex];

  if (!current) {
    return;
  }

  const nextStatus = action === 'accept' ? 'accepted' : 'rejected';

  invitations.value[invitationIndex] = {
    ...current,
    status: nextStatus,
  };

  toast.add({
    title: action === 'accept' ? 'Invitation accepted' : 'Invitation rejected',
    description: `${current.event.title} telah di-${action === 'accept' ? 'accept' : 'reject'} (dummy update).`,
    color: action === 'accept' ? 'success' : 'error',
  });
};
</script>
