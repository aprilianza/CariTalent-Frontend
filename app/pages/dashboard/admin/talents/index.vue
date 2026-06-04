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
      <div v-if="pending || status === 'idle'" class="flex flex-col items-center justify-center gap-3 py-16">
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
                <button
                  type="button"
                  class="group/btn flex items-center gap-0.5 text-sm font-bold text-ui-light hover:text-violet-400 hover:underline transition-colors text-left focus:outline-none"
                  @click="openDetail(talent)"
                >
                  <span>{{ talent.stage_name }}</span>
                  <Icon name="mdi:chevron-right" class="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 text-neutral-light/50" />
                </button>
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
          <div class="flex shrink-0 gap-2 sm:items-center sm:justify-end">
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

    <!-- Detail Talent Modal -->
    <UModal
      v-model:open="showDetailModal"
      :ui="{
        content: 'w-[calc(100vw-2rem)] max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[#12121a]/95 p-0 shadow-2xl ring-0 backdrop-blur-xl mx-auto my-auto',
      }"
    >
      <template #content>
        <div v-if="selectedTalent" class="overflow-hidden rounded-[28px]">
          <!-- Header -->
          <div class="border-b border-white/10 bg-white/[0.03] px-5 py-5 sm:px-6">
            <div class="flex items-start justify-between gap-4">
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <span class="text-xs font-semibold uppercase text-violet-400">Detail Profil Talent</span>
                </div>
                <h3 class="mt-2 font-display text-xl font-bold text-neutral-100 line-clamp-2">
                  {{ selectedTalent.stage_name }}
                </h3>
              </div>
              <UButton 
                color="neutral" 
                variant="ghost" 
                icon="i-lucide-x" 
                class="-mr-2 -mt-2 shrink-0 rounded-full text-neutral-light/75 hover:text-white" 
                aria-label="Tutup modal" 
                @click="showDetailModal = false" 
              />
            </div>
          </div>

          <!-- Body Content -->
          <div class="space-y-5 px-5 py-5 sm:px-6 max-h-[60vh] overflow-y-auto">
            <!-- Account & Verification Status -->
            <div class="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center gap-2.5">
                  <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20 font-bold">
                    {{ selectedTalent.stage_name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Nama Asli Akun</p>
                    <p class="text-sm font-semibold text-neutral-200">
                      {{ selectedTalent.user?.name || 'Talent User' }}
                    </p>
                  </div>
                </div>
                
                <UiBadge 
                  :label="selectedTalent.verified ? 'Verified' : 'Belum Verified'" 
                  :color="selectedTalent.verified ? 'success' : 'neutral'" 
                  variant="soft" 
                  class="font-bold tracking-wide" 
                />
              </div>

              <!-- Contact Info -->
              <div class="grid gap-3 text-sm text-neutral-light/70 sm:grid-cols-2 mt-2">
                <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Email Pengguna</p>
                  <p class="mt-1 text-xs font-semibold text-neutral-200 truncate">{{ selectedTalent.user?.email || '-' }}</p>
                </div>
                <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Nomor Telepon</p>
                  <p class="mt-1 text-xs font-semibold text-neutral-200">{{ selectedTalent.user?.phone || '-' }}</p>
                </div>
              </div>
            </div>

            <!-- Profile details grid -->
            <div class="grid gap-3 text-sm text-neutral-light/70 sm:grid-cols-2">
              <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Estimasi Tarif / Price Range</p>
                <p class="mt-1 text-sm font-bold text-violet-300">
                  {{ selectedTalent.price_min ? formatCurrency(selectedTalent.price_min) : '-' }} – {{ selectedTalent.price_max ? formatCurrency(selectedTalent.price_max) : '-' }}
                </p>
              </div>
              <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3">
                <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Kota Asal</p>
                <p class="mt-1 text-sm font-bold text-neutral-100">{{ selectedTalent.city || '-' }}</p>
              </div>
            </div>

            <!-- Bio -->
            <div class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Bio / Deskripsi</h4>
              <p class="text-sm leading-relaxed text-neutral-300 whitespace-pre-line bg-white/[0.02] border border-white/5 p-4 rounded-xl">
                {{ selectedTalent.bio || 'Talent belum mengisi deskripsi bio.' }}
              </p>
            </div>

            <!-- Portfolio Link -->
            <div class="space-y-2" v-if="selectedTalent.portfolio_link">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Tautan Portofolio</h4>
              <div class="flex items-center gap-2 rounded-xl bg-white/[0.02] border border-white/5 p-3 text-sm text-violet-400 hover:text-violet-300">
                <Icon name="mdi:link-variant" class="h-4 w-4 shrink-0" />
                <a :href="selectedTalent.portfolio_link" target="_blank" rel="noopener noreferrer" class="truncate hover:underline">
                  {{ selectedTalent.portfolio_link }}
                </a>
              </div>
            </div>

            <!-- Genres -->
            <div v-if="selectedTalent.genre && selectedTalent.genre.length" class="space-y-2">
              <h4 class="text-xs uppercase tracking-wider font-bold text-neutral-light/40">Genre Musik</h4>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="genre in selectedTalent.genre"
                  :key="genre"
                  class="rounded-xl bg-violet-500/10 border border-violet-500/20 px-3 py-1 text-xs font-semibold text-violet-300 tracking-wide"
                >
                  {{ genre }}
                </span>
              </div>
            </div>

            <!-- Performance Rating -->
            <div class="grid gap-3 text-sm text-neutral-light/70 sm:grid-cols-2">
              <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Icon name="mdi:star" class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Rating Rata-rata</p>
                  <p class="text-sm font-bold text-neutral-200">
                    {{ selectedTalent.average_rating > 0 ? selectedTalent.average_rating.toFixed(1) : '-' }}
                  </p>
                </div>
              </div>
              <div class="rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 flex items-center gap-3">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  <Icon name="mdi:message-draw" class="h-5 w-5" />
                </div>
                <div>
                  <p class="text-[9px] text-neutral-light/40 uppercase tracking-wider font-semibold">Total Review</p>
                  <p class="text-sm font-bold text-neutral-200">
                    {{ selectedTalent.total_reviews || 0 }} Review
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="flex gap-3 border-t border-white/10 bg-white/[0.03] px-5 py-4 justify-end sm:px-6">
            <UButton 
              color="neutral" 
              variant="soft" 
              class="rounded-xl px-5" 
              @click="showDetailModal = false"
            > 
              Tutup 
            </UButton>
            
            <!-- Quick Verification toggle inside modal -->
            <UiButton
              v-if="!selectedTalent.verified"
              label="Verifikasi Talent"
              icon="mdi:check-circle-outline"
              color="success"
              class="rounded-xl px-4"
              :loading="loadingId === selectedTalent.id"
              @click="handleVerifyFromModal"
            />
            <UiButton
              v-else
              label="Cabut Verifikasi"
              icon="mdi:close-circle-outline"
              color="error"
              variant="soft"
              class="rounded-xl px-4"
              :loading="loadingId === selectedTalent.id"
              @click="handleVerifyFromModal"
            />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { AdminTalent } from '~/composables/types';
import { useAdminTalents } from '~/composables/useAdminTalents';
import { useFormatters } from '~/composables/useFormatters';

definePageMeta({
  layout: 'admin',
});

const pageTitle = useState('admin-layout-title');
pageTitle.value = 'Verifikasi Talent';

const toast = useToast();
const { talents, pending, status, verifyTalent } = useAdminTalents();
const { formatCurrency } = useFormatters();

const search = ref('');
const verifiedFilter = ref<'all' | 'verified' | 'unverified'>('all');
const loadingId = ref<number | null>(null);

// Detail Talent Modal State
const showDetailModal = ref(false);
const selectedTalent = ref<AdminTalent | null>(null);

const openDetail = (talent: AdminTalent) => {
  selectedTalent.value = talent;
  showDetailModal.value = true;
};

const handleVerifyFromModal = async () => {
  if (!selectedTalent.value) return;
  const current = selectedTalent.value;
  const newVerifiedStatus = !current.verified;
  
  loadingId.value = current.id;
  const res = await verifyTalent(current.id, newVerifiedStatus);
  if (res.success) {
    current.verified = newVerifiedStatus;
    toast.add({
      title: newVerifiedStatus ? 'Talent diverifikasi' : 'Verifikasi dicabut',
      description: newVerifiedStatus
        ? 'Status talent berhasil diubah menjadi verified.'
        : 'Verifikasi talent berhasil dicabut.',
      color: 'success',
    });
  } else {
    toast.add({
      title: 'Gagal',
      description: res.message || 'Terjadi kesalahan saat memverifikasi talent.',
      color: 'error',
    });
  }
  loadingId.value = null;
};

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

  const res = await verifyTalent(id, verified);
  if (res.success) {
    toast.add({
      title: verified ? 'Talent diverifikasi' : 'Verifikasi dicabut',
      description: verified
        ? 'Status talent berhasil diubah menjadi verified.'
        : 'Verifikasi talent berhasil dicabut.',
      color: 'success',
    });
    
    // update current modal talent status if modal is open for this talent
    if (selectedTalent.value && selectedTalent.value.id === id) {
      selectedTalent.value.verified = verified;
    }
  } else {
    toast.add({
      title: 'Gagal',
      description: res.message || 'Terjadi kesalahan saat memverifikasi talent.',
      color: 'error',
    });
  }

  loadingId.value = null;
};
</script>
