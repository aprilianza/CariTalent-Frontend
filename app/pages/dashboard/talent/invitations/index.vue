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
        <div class="flex items-center gap-2">
          <UiBadge :label="`${invitations.length} total`" color="primary" variant="soft" />
          <UPagination v-if="pagination && pagination.last_page > 1" v-model="currentPage" :page-count="pagination.per_page" :total="pagination.total" />
        </div>
      </div>
    </UiCard>

    <InvitationList :invitations="invitations" :loading="pending" @accept="handleInvitation('accept', $event)" @reject="handleInvitation('reject', $event)" />
  </div>
</template>

<script setup lang="ts">
import InvitationList from '~/components/talent/InvitationList.vue';
import { useInvitations } from '~/composables/useInvitations';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Invitations';

const toast = useToast();

const currentPage = ref(1);
const { data: invitations, pending, pagination, respondToInvitation } = useInvitations({ page: currentPage.value });

// Watch page changes and refetch invitations
watch(currentPage, async (newPage) => {
  const { refresh } = useInvitations({ page: newPage });
  await refresh();
});

const statusSummary = computed(() => ({
  pending: invitations.value.filter((item) => item.status === 'pending').length,
  accepted: invitations.value.filter((item) => item.status === 'accepted').length,
  rejected: invitations.value.filter((item) => item.status === 'rejected').length,
}));

const handleInvitation = async (action: 'accept' | 'reject', invitationId: number) => {
  const current = invitations.value.find((item) => item.id === invitationId);

  if (!current) {
    return;
  }

  try {
    const status = action === 'accept' ? 'accepted' : 'rejected';
    await respondToInvitation(invitationId, status);

    toast.add({
      title: action === 'accept' ? 'Invitation accepted' : 'Invitation rejected',
      description: `${current.event.title} has been ${action}ed successfully.`,
      color: action === 'accept' ? 'success' : 'error',
    });
  } catch (error: any) {
    toast.add({
      title: 'Action failed',
      description: error.message || 'Failed to respond to invitation',
      color: 'error',
    });
  }
};
</script>
