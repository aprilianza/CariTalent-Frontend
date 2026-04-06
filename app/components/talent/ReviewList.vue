<template>
  <UiCard id="reviews" title="Talent Reviews" :description="detailed ? 'Ulasan dari organizer berdasarkan performa booking yang completed' : 'Ringkasan review terbaru'" card-class="h-full">
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="n in 3" :key="`review-skeleton-${n}`" class="h-24 w-full rounded-xl" />
    </div>

    <UiList v-else :items="mappedItems" empty-text="Belum ada review untuk talent ini.">
      <template #item="{ item }">
        <div class="space-y-3">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.organizer }}</p>
              <p class="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Event: {{ item.eventTitle }}</p>
            </div>
            <UiBadge :label="item.ratingLabel" :color="item.ratingColor" variant="soft" class="shrink-0" />
          </div>

          <p class="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">{{ item.comment }}</p>

          <div v-if="detailed" class="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400">
            <span
              >Rating: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.stars }}</span></span
            >
            <span
              >Dibuat: <span class="font-medium text-neutral-900 dark:text-neutral-100">{{ item.createdAt }}</span></span
            >
          </div>
        </div>
      </template>
    </UiList>
  </UiCard>
</template>

<script setup lang="ts">
import type { TalentReviewItem } from '~/composables/types';
import { useFormatters } from '~/composables/useFormatters';

const props = withDefaults(
  defineProps<{
    reviews: TalentReviewItem[];
    loading?: boolean;
    detailed?: boolean;
  }>(),
  {
    loading: false,
    detailed: true,
  },
);

const { formatDate } = useFormatters();

const formatDateSafe = (value?: string) => {
  if (!value) {
    return '-';
  }

  try {
    return formatDate(value);
  } catch {
    return value;
  }
};

const getRatingMeta = (rating: number) => {
  if (rating >= 4.5) {
    return { label: 'Excellent', color: 'success' as const };
  }

  if (rating >= 3.5) {
    return { label: 'Good', color: 'primary' as const };
  }

  return { label: 'Needs Improvement', color: 'warning' as const };
};

const buildStars = (rating: number) => {
  const rounded = Math.max(1, Math.min(5, Math.round(rating)));
  return `${'★'.repeat(rounded)}${'☆'.repeat(5 - rounded)} (${rating.toFixed(1)}/5)`;
};

const mappedItems = computed(() =>
  props.reviews.map((review) => {
    const meta = getRatingMeta(review.rating);

    return {
      id: review.id,
      title: review.organizer_name,
      organizer: review.organizer_name,
      eventTitle: review.event_title,
      comment: review.comment,
      ratingLabel: `${meta.label} • ${review.rating.toFixed(1)}`,
      ratingColor: meta.color,
      stars: buildStars(review.rating),
      createdAt: formatDateSafe(review.created_at),
    };
  }),
);
</script>
