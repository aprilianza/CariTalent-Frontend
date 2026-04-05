<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-neutral-light/70">Talent Workspace</p>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">Recent Applications</h1>
          <div class="mt-3 flex flex-wrap gap-2">
            <UiBadge :label="`Pending ${statusSummary.pending}`" color="warning" variant="soft" />
            <UiBadge :label="`Accepted ${statusSummary.accepted}`" color="success" variant="soft" />
            <UiBadge :label="`Rejected ${statusSummary.rejected}`" color="error" variant="soft" />
          </div>
        </div>
        <UiBadge :label="`${applications.length} total`" color="primary" variant="soft" />
      </div>
    </UiCard>

    <ApplicationList :applications="applications" :loading="pending" />
  </div>
</template>

<script setup lang="ts">
import ApplicationList from '~/components/talent/ApplicationList.vue';
import { useApplications } from '~/composables/useApplications';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Applications';

const { data: applications, pending } = useApplications();

const statusSummary = computed(() => ({
  pending: applications.value.filter((item) => item.status === 'pending').length,
  accepted: applications.value.filter((item) => item.status === 'accepted').length,
  rejected: applications.value.filter((item) => item.status === 'rejected').length,
}));
</script>
