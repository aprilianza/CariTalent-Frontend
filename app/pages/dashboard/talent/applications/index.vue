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
        <div class="flex items-center gap-2">
          <UiBadge :label="`${applications.length} total`" color="primary" variant="soft" />
          <UPagination v-if="pagination && pagination.last_page > 1" v-model="currentPage" :page-count="pagination.per_page" :total="pagination.total" />
        </div>
      </div>
    </UiCard>

    <ApplicationList :applications="applications" :loading="pending" @cancel="handleCancelApplication" />
  </div>
</template>

<script setup lang="ts">
import ApplicationList from '~/components/talent/ApplicationList.vue';
import { useApplications } from '~/composables/useApplications';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Applications';

const toast = useToast();

const currentPage = ref(1);
const { data: applications, pending, pagination, cancelApplication } = useApplications({ page: currentPage.value });

// Watch page changes and refetch applications
watch(currentPage, async (newPage) => {
  const { refresh } = useApplications({ page: newPage });
  await refresh();
});

const handleCancelApplication = async (applicationId: number) => {
  const target = applications.value.find((item) => item.id === applicationId);

  if (!target) {
    return;
  }

  if (target.status !== 'pending') {
    toast.add({
      title: 'Cancel tidak tersedia',
      description: 'Hanya lamaran dengan status pending yang bisa dibatalkan.',
      color: 'warning',
    });
    return;
  }

  try {
    await cancelApplication(applicationId);

    toast.add({
      title: 'Lamaran dibatalkan',
      description: `${target.event.title} berhasil dihapus dari daftar lamaran.`,
      color: 'success',
    });
  } catch (error: any) {
    toast.add({
      title: 'Cancel gagal',
      description: error.message || 'Terjadi kendala saat membatalkan lamaran.',
      color: 'error',
    });
  }
};

const statusSummary = computed(() => ({
  pending: applications.value.filter((item) => item.status === 'pending').length,
  accepted: applications.value.filter((item) => item.status === 'accepted').length,
  rejected: applications.value.filter((item) => item.status === 'rejected').length,
}));
</script>
