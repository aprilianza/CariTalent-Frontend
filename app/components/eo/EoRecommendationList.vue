<template>
  <UiCard title="Rekomendasi Talent" description="Top 5 talent terbaik berdasarkan match genre, budget, dan lokasi" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 5" :key="`rec-skeleton-${n}`" class="h-28 w-full rounded-xl" />
    </div>

    <div v-else-if="!recommendations.length" class="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
      Belum ada rekomendasi untuk event ini.
    </div>

    <ul v-else class="space-y-3">
      <li
        v-for="rec in recommendations"
        :key="rec.rank"
        class="rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-violet-500/30 hover:bg-white/8"
      >
        <div class="space-y-3">
          <!-- Rank + Talent info -->
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <!-- Rank badge -->
              <div
                :class="[
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold',
                  rec.rank === 1 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                  rec.rank === 2 ? 'bg-slate-400/20 text-slate-300 border border-slate-400/30' :
                  rec.rank === 3 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                  'bg-white/8 text-neutral-light/60 border border-white/10'
                ]"
              >
                #{{ rec.rank }}
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <button type="button" class="text-sm font-semibold text-violet-400 hover:text-violet-300 hover:underline transition-colors text-left flex items-center gap-1" @click="openProfileModal(rec.talent)">
                    {{ rec.talent.stage_name }}
                    <Icon name="mdi:open-in-new" class="h-3 w-3 opacity-60" />
                  </button>
                  <UiBadge v-if="rec.talent.verified" label="Verified" color="success" variant="soft" size="sm" dot />
                </div>
                <p class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                  <Icon name="mdi:map-marker-outline" class="inline h-3 w-3" /> {{ rec.talent.city || '-' }}
                  · <Icon name="mdi:star-outline" class="inline h-3 w-3 text-yellow-400" /> {{ rec.talent.average_rating.toFixed(1) }}
                </p>
              </div>
            </div>

            <!-- Total score -->
            <div class="text-right">
              <p class="text-lg font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                {{ rec.score }}
              </p>
              <p class="text-xs text-neutral-light/50">skor</p>
            </div>
          </div>

          <!-- Genre badges -->
          <div class="flex flex-wrap gap-1.5">
            <UiBadge v-for="genre in rec.talent.genre" :key="genre" :label="genre" color="secondary" variant="soft" size="sm" />
          </div>

          <!-- Score breakdown -->
          <div class="grid grid-cols-3 gap-2 text-xs">
            <div class="rounded-lg bg-white/5 px-2 py-1.5 text-center">
              <p class="font-semibold text-violet-400">{{ rec.score_breakdown.genre_score }}</p>
              <p class="text-neutral-light/50">Genre</p>
            </div>
            <div class="rounded-lg bg-white/5 px-2 py-1.5 text-center">
              <p class="font-semibold text-fuchsia-400">{{ rec.score_breakdown.budget_score }}</p>
              <p class="text-neutral-light/50">Budget</p>
            </div>
            <div class="rounded-lg bg-white/5 px-2 py-1.5 text-center">
              <p class="font-semibold text-indigo-400">{{ rec.score_breakdown.location_score }}</p>
              <p class="text-neutral-light/50">Lokasi</p>
            </div>
          </div>

          <!-- Invite button -->
          <div class="flex items-center justify-end">
            <div v-if="invitedIds.includes(rec.talent.id)" class="inline-flex items-center gap-1.5 rounded-lg bg-green-500/20 px-3 py-1.5 text-xs font-semibold text-green-400 border border-green-500/30">
              <Icon name="mdi:check-circle" class="h-4 w-4" />
              Sudah diundang
            </div>
            <UiButton
              v-else
              size="sm"
              color="primary"
              variant="soft"
              icon="mdi:send-outline"
              :loading="invitingId === rec.talent.id"
              @click="emit('invite', rec.talent.id)"
            >
              Undang Talent
            </UiButton>
          </div>
        </div>
      </li>
    </ul>
    <!-- Profile Modal: show full talent profile -->
    <UModal v-model:open="showProfileModal" :ui="{ content: 'bg-transparent ring-0 shadow-none sm:max-w-2xl w-full mx-auto' }">
      <template #content>
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl">
          <!-- Background decoration -->
          <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none"></div>

          <div class="relative z-10 space-y-6">
            <!-- Header -->
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">{{ selectedTalent?.stageName }}</h3>
                  <UiBadge v-if="selectedTalent?.verified" label="Verified" color="success" variant="soft" size="sm" dot />
                </div>
                <p class="mt-1 text-sm text-neutral-light/60">Profil lengkap talent rekomendasi</p>
              </div>
              <button class="rounded-lg border border-white/10 bg-white/5 p-1.5 text-neutral-light/70 hover:bg-white/10 hover:text-white transition-all" @click="showProfileModal = false">
                <Icon name="mdi:close" class="h-4 w-4" />
              </button>
            </div>

            <!-- Profile Info Body -->
            <div class="space-y-4 text-sm text-neutral-light/80 max-h-[60vh] overflow-y-auto pr-1">
              <!-- Basic Info Grid -->
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-1">
                  <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider">Nama Lengkap</span>
                  <p class="font-semibold text-ui-light">{{ selectedTalent?.name }}</p>
                </div>
                <div class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-1">
                  <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider">Kota Asal</span>
                  <p class="font-semibold text-ui-light flex items-center gap-1">
                    <Icon name="mdi:map-marker-outline" class="h-4 w-4 text-violet-400" />
                    {{ selectedTalent?.city }}
                  </p>
                </div>
              </div>

              <!-- Contact Info -->
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-1">
                  <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider">Email</span>
                  <p class="font-medium text-ui-light truncate flex items-center gap-1.5">
                    <Icon name="mdi:email-outline" class="h-4 w-4 text-violet-400" />
                    {{ selectedTalent?.email }}
                  </p>
                </div>
                <div class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-1">
                  <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider">Nomor HP</span>
                  <p class="font-medium text-ui-light flex items-center gap-1.5">
                    <Icon name="mdi:phone-outline" class="h-4 w-4 text-violet-400" />
                    {{ selectedTalent?.phone }}
                  </p>
                </div>
              </div>

              <!-- Price & Rating -->
              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-1">
                  <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider">Estimasi Tarif</span>
                  <p class="font-semibold text-ui-light flex items-center gap-1">
                    <Icon name="mdi:cash-multiple" class="h-4 w-4 text-violet-400" />
                    {{ selectedTalent?.priceMin }} - {{ selectedTalent?.priceMax }}
                  </p>
                </div>
                <div class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-1">
                  <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider">Average Rating</span>
                  <p class="font-semibold text-ui-light flex items-center gap-1.5">
                    <Icon name="mdi:star" class="h-4 w-4 text-yellow-400" />
                    {{ selectedTalent?.rating }} / 5.0
                  </p>
                </div>
              </div>

              <!-- Genres -->
              <div class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-2">
                <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider block">Genre Musik</span>
                <div class="flex flex-wrap gap-1.5">
                  <UiBadge v-for="g in selectedTalent?.genres" :key="g" :label="g" color="primary" variant="subtle" size="sm" />
                </div>
              </div>

              <!-- Portfolio -->
              <div v-if="selectedTalent?.portfolioLink" class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-2">
                <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider block">Link Portofolio</span>
                <a :href="selectedTalent?.portfolioLink" target="_blank" class="text-sm font-semibold text-violet-400 hover:text-violet-300 hover:underline flex items-center gap-1.5 transition-colors">
                  <Icon name="mdi:link-variant" class="h-4 w-4" />
                  {{ selectedTalent?.portfolioLink }}
                </a>
              </div>

              <!-- Bio -->
              <div class="rounded-xl border border-white/8 bg-white/4 p-3.5 space-y-2">
                <span class="text-xs font-semibold text-neutral-light/50 uppercase tracking-wider block">Deskripsi / Bio</span>
                <p class="text-sm leading-relaxed text-neutral-light/80 whitespace-pre-line">{{ selectedTalent?.bio }}</p>
              </div>
            </div>

          </div>
        </div>
      </template>
    </UModal>
  </UiCard>
</template>

<script setup lang="ts">
import type { TalentRecommendation } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    recommendations: TalentRecommendation[];
    loading?: boolean;
    invitingId?: number | null;
    invitedIds?: number[];
  }>(),
  {
    loading: false,
    invitingId: null,
    invitedIds: () => [],
  },
);

const emit = defineEmits<{
  invite: [talentId: number];
}>();

const invitingId = computed(() => props.invitingId);
const invitedIds = computed(() => props.invitedIds);
const recommendations = computed(() => props.recommendations);

const { formatCurrency } = useFormatters();

const showProfileModal = ref(false);
const selectedTalent = ref<any>(null);

const openProfileModal = (talent: any) => {
  selectedTalent.value = {
    stageName: talent.stage_name,
    verified: talent.verified,
    name: talent.name || '-',
    city: talent.city || '-',
    email: talent.email || '-',
    phone: talent.phone || '-',
    priceMin: talent.price_min ? formatCurrency(talent.price_min) : '-',
    priceMax: talent.price_max ? formatCurrency(talent.price_max) : '-',
    rating: talent.average_rating ? talent.average_rating.toFixed(1) : '0.0',
    genres: talent.genre || [],
    portfolioLink: talent.portfolio_link || '',
    bio: talent.bio || '-',
  };
  showProfileModal.value = true;
};
</script>
