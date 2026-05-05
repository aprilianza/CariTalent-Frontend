<template>
  <UiCard title="Daftar Pelamar" :description="detailed ? 'Talent yang mendaftar atau diundang ke event ini' : 'Ringkasan pelamar event'" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="`app-skeleton-${n}`" class="h-28 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada pelamar untuk event ini.">
      <template #item="{ item }">
        <div class="space-y-3">
          <!-- Talent info row -->
          <div class="flex flex-wrap items-start justify-between gap-2">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.stageName }}</p>
                <UiBadge v-if="item.verified" label="Verified" color="success" variant="soft" size="sm" dot />
              </div>
              <div class="mt-1 flex flex-wrap items-center gap-2">
                <span class="text-xs text-neutral-500 dark:text-neutral-400"> <Icon name="mdi:map-marker-outline" class="inline h-3 w-3" /> {{ item.city }} </span>
                <span class="text-xs text-neutral-500 dark:text-neutral-400"> <Icon name="mdi:star-outline" class="inline h-3 w-3 text-yellow-400" /> {{ item.rating }} </span>
              </div>
            </div>
            <div class="flex shrink-0 flex-wrap items-center gap-2">
              <UiBadge :label="item.sourceLabel" color="secondary" variant="outline" size="sm" />
              <UiBadge :label="item.statusLabel" :color="item.statusColor" variant="soft" size="sm" />
            </div>
          </div>

          <!-- Genres -->
          <div class="flex flex-wrap gap-1.5">
            <UiBadge v-for="genre in item.genres" :key="genre" :label="genre" color="neutral" variant="subtle" size="sm" />
          </div>

          <!-- Price & message -->
          <div v-if="detailed" class="rounded-lg border border-white/8 bg-white/4 px-3 py-2 text-xs space-y-1">
            <p class="text-neutral-light/70">
              Harga ditawarkan: <span class="font-semibold text-ui-light">{{ item.proposedPrice }}</span>
            </p>
            <p v-if="item.message" class="text-neutral-light/60 italic line-clamp-2">{{ item.message }}</p>
            <p class="text-neutral-light/50">Dikirim: {{ item.createdAt }}</p>
          </div>

          <!-- Accept / Reject actions — only for pending items -->
          <div v-if="item.isPending" class="flex flex-wrap gap-2">
            <UiButton size="sm" color="success" variant="soft" icon="mdi:check-circle-outline" :loading="acceptingId === item.rawId" @click="handleAccept(item.rawId)"> Terima </UiButton>
            <UiButton size="sm" color="error" variant="ghost" icon="mdi:close-circle-outline" :loading="rejectingId === item.rawId" @click="emit('reject', item.rawId)"> Tolak </UiButton>
          </div>
        </div>
      </template>
    </UiList>

    <!-- Accept Modal: input agreed_price -->
    <UModal v-model:open="showAcceptModal" :ui="{ content: 'bg-transparent ring-0 shadow-none sm:max-w-md w-full mx-auto' }">
      <template #content>
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl">
          <!-- Background decoration -->
          <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-teal-500/20 blur-3xl pointer-events-none"></div>

          <div class="relative z-10 space-y-6">
            <!-- Header -->
            <div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Terima Lamaran</h3>
              <p class="mt-1.5 text-sm text-neutral-light/70">Masukkan harga yang disepakati untuk booking ini.</p>
            </div>

            <!-- Input Harga -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-neutral-light">Harga Disepakati (Rp)</label>
              <UInput v-model="agreedPriceInput" type="number" placeholder="Contoh: 1500000" :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all' }" />
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2">
              <UiButton color="neutral" variant="ghost" class="hover:bg-white/5" @click="showAcceptModal = false">Batal</UiButton>
              <UiButton color="success" variant="soft" :loading="!!acceptingId" :disabled="!agreedPriceInput || Number(agreedPriceInput) <= 0" @click="confirmAccept" class="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 border-0"> Konfirmasi </UiButton>
            </div>
          </div>
        </div>
      </template>
    </UModal>
  </UiCard>
</template>

<script setup lang="ts">
import type { EoApplication, ApplicationStatus } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    applications: EoApplication[];
    loading?: boolean;
    detailed?: boolean;
  }>(),
  {
    loading: false,
    detailed: true,
  },
);

const emit = defineEmits<{
  accept: [applicationId: number, agreedPrice: number];
  reject: [applicationId: number];
}>();

const { formatCurrency, formatDate } = useFormatters();
const detailed = computed(() => props.detailed);

const showAcceptModal = ref(false);
const pendingAcceptId = ref<number | null>(null);
const agreedPriceInput = ref('');
const acceptingId = ref<number | null>(null);
const rejectingId = ref<number | null>(null);

const statusMap: Record<ApplicationStatus, { label: string; color: 'success' | 'warning' | 'error' }> = {
  pending: { label: 'Pending', color: 'warning' },
  accepted: { label: 'Accepted', color: 'success' },
  rejected: { label: 'Rejected', color: 'error' },
};

const sourceMap = {
  apply: 'Apply Langsung',
  invitation: 'Via Invitation',
} as const;

const formatDateSafe = (value?: string) => {
  if (!value) return '-';
  try {
    return formatDate(value);
  } catch {
    return value;
  }
};

const mappedItems = computed(() =>
  props.applications.map((app) => {
    const status = statusMap[app.status];
    return {
      id: String(app.id),
      title: app.talent.stage_name,
      rawId: app.id,
      stageName: app.talent.stage_name,
      city: app.talent.city || '-',
      rating: app.talent.average_rating.toFixed(1),
      verified: app.talent.verified,
      genres: app.talent.genre,
      sourceLabel: sourceMap[app.source],
      proposedPrice: formatCurrency(app.proposed_price),
      message: app.message,
      createdAt: formatDateSafe(app.created_at),
      isPending: app.status === 'pending',
      statusLabel: status.label,
      statusColor: status.color,
    };
  }),
);

const handleAccept = (id: number) => {
  pendingAcceptId.value = id;
  agreedPriceInput.value = '';
  showAcceptModal.value = true;
};

const confirmAccept = () => {
  if (!pendingAcceptId.value || !agreedPriceInput.value) return;
  acceptingId.value = pendingAcceptId.value;
  emit('accept', pendingAcceptId.value, Number(agreedPriceInput.value));
  showAcceptModal.value = false;
  pendingAcceptId.value = null;

  // Reset loading state after brief delay (mock)
  setTimeout(() => {
    acceptingId.value = null;
  }, 600);
};
</script>
