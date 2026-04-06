<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
        Verifikasi Talent
      </h1>
      <p class="mt-1 text-sm text-neutral-light/60">Kelola status verifikasi talent di platform.</p>
    </div>

    <!-- Filter Bar -->
    <UiCard>
      <div class="flex flex-wrap items-center gap-2">
        <UiButton
          v-for="tab in verifiedTabs"
          :key="tab.value"
          :label="tab.label"
          :variant="verifiedFilter === tab.value ? 'solid' : 'soft'"
          :color="verifiedFilter === tab.value ? 'primary' : 'neutral'"
          size="sm"
          @click="verifiedFilter = tab.value"
        />
        <div class="ml-auto relative">
          <Icon name="mdi:magnify" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-light/40" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama panggung..."
            class="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-ui-light placeholder-neutral-light/40 outline-none transition focus:border-highlight/50 focus:bg-white/8 sm:w-56"
          />
        </div>
      </div>
    </UiCard>

    <!-- Talent List -->
    <div class="space-y-3">
      <!-- Loading -->
      <div v-if="pending" class="flex flex-col items-center justify-center gap-3 py-16">
        <Icon name="mdi:loading" class="h-8 w-8 animate-spin text-highlight" />
        <p class="text-sm text-neutral-light/60">Memuat data talent...</p>
      </div>

      <!-- Empty -->
      <div
        v-else-if="filteredTalents.length === 0"
        class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/10 py-16"
      >
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Icon name="mdi:music-off" class="h-10 w-10 text-neutral-light/40" />
        </div>
        <p class="text-sm font-medium text-neutral-light/60">Tidak ada talent ditemukan.</p>
      </div>

      <!-- Cards -->
      <UiCard
        v-for="talent in filteredTalents"
        :key="talent.id"
        card-class="transition-all hover:border-highlight/30"
      >
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <!-- Talent Info -->
          <div class="flex items-start gap-4">
            <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-lg font-bold text-ui-light">
              {{ talent.stage_name.charAt(0) }}
            </div>
            <div class="space-y-1.5">
              <div class="flex flex-wrap items-center gap-2">
                <p class="text-sm font-bold text-ui-light">{{ talent.stage_name }}</p>
                <UiBadge
                  :label="talent.verified ? 'Verified' : 'Belum Verified'"
                  :color="talent.verified ? 'success' : 'neutral'"
                  variant="soft"
                  :dot="talent.verified"
                />
              </div>
              <div class="flex flex-wrap gap-1.5">
                <UiBadge v-for="g in talent.genre" :key="g" :label="g" color="info" size="sm" variant="subtle" />
              </div>
              <div class="flex flex-wrap items-center gap-3 text-xs text-neutral-light/60">
                <span v-if="talent.city" class="flex items-center gap-1">
                  <Icon name="mdi:map-marker-outline" class="h-3.5 w-3.5" />
                  {{ talent.city }}
                </span>
                <span v-if="talent.average_rating > 0" class="flex items-center gap-1">
                  <Icon name="mdi:star" class="h-3.5 w-3.5 text-accent" />
                  {{ talent.average_rating.toFixed(1) }}
                  <span class="text-neutral-light/40">({{ talent.total_reviews }} review)</span>
                </span>
                <span v-if="talent.price_min" class="flex items-center gap-1">
                  <Icon name="mdi:cash-multiple" class="h-3.5 w-3.5" />
                  {{ formatCurrency(talent.price_min) }} – {{ formatCurrency(talent.price_max ?? 0) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex shrink-0 gap-2 sm:justify-end">
            <UiButton
              v-if="!talent.verified"
              label="Verifikasi"
              icon="mdi:check-circle-outline"
              color="success"
              size="sm"
              :loading="loadingId === talent.id"
              @click="handleVerify(talent.id, true)"
            />
            <UiButton
              v-else
              label="Cabut Verifikasi"
              icon="mdi:close-circle-outline"
              color="error"
              variant="soft"
              size="sm"
              :loading="loadingId === talent.id"
              @click="handleVerify(talent.id, false)"
            />
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAdminTalents } from '~/composables/useAdminTalents';
import { useFormatters } from '~/composables/useFormatters';

definePageMeta({
  layout: 'admin',
});

const pageTitle = useState('admin-layout-title');
pageTitle.value = 'Verifikasi Talent';

const toast = useToast();
const { talents, pending, verifyTalent } = useAdminTalents();
const { formatCurrency } = useFormatters();

const search = ref('');
const verifiedFilter = ref<'all' | 'verified' | 'unverified'>('all');
const loadingId = ref<number | null>(null);

const verifiedTabs = [
  { label: 'Semua', value: 'all' as const },
  { label: 'Sudah Verified', value: 'verified' as const },
  { label: 'Belum Verified', value: 'unverified' as const },
];

const filteredTalents = computed(() => {
  return talents.value.filter((t) => {
    const matchFilter =
      verifiedFilter.value === 'all' ||
      (verifiedFilter.value === 'verified' && t.verified) ||
      (verifiedFilter.value === 'unverified' && !t.verified);
    const matchSearch =
      !search.value || t.stage_name.toLowerCase().includes(search.value.toLowerCase());
    return matchFilter && matchSearch;
  });
});

const handleVerify = async (id: number, verified: boolean) => {
  loadingId.value = id;
  await new Promise((r) => setTimeout(r, 600));

  verifyTalent(id, verified);
  toast.add({
    title: verified ? 'Talent diverifikasi' : 'Verifikasi dicabut',
    description: verified
      ? 'Status talent berhasil diubah menjadi verified.'
      : 'Verifikasi talent berhasil dicabut.',
    color: verified ? 'success' : 'neutral',
  });

  loadingId.value = null;
};
</script>
