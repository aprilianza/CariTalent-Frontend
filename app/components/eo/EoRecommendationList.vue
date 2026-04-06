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
                  <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ rec.talent.stage_name }}</p>
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
          <div class="flex justify-end">
            <UiButton
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
  </UiCard>
</template>

<script setup lang="ts">
import type { TalentRecommendation } from '~/composables/types';

const props = withDefaults(
  defineProps<{
    recommendations: TalentRecommendation[];
    loading?: boolean;
    invitingId?: number | null;
  }>(),
  {
    loading: false,
    invitingId: null,
  },
);

const emit = defineEmits<{
  invite: [talentId: number];
}>();

const invitingId = computed(() => props.invitingId);
const recommendations = computed(() => props.recommendations);
</script>
