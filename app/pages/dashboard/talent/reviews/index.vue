<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-neutral-light/70">Talent Workspace</p>
          <h1 class="font-display bg-gradient-to-r from-highlight to-accent bg-clip-text text-2xl font-bold text-transparent md:text-3xl">Talent Reviews</h1>
          <p class="mt-2 text-sm text-neutral-light/80">Ulasan dari organizer setelah booking selesai, sesuai endpoint review pada API spec.</p>
        </div>
        <UiBadge :label="meta.stageName || 'Talent'" color="secondary" variant="soft" />
      </div>
    </UiCard>

    <section class="grid gap-4 sm:grid-cols-2">
      <UiCard title="Average Rating" description="Rata-rata rating semua review.">
        <p class="text-2xl font-semibold text-ui-light">{{ averageRatingLabel }}</p>
      </UiCard>

      <UiCard title="Total Reviews" description="Jumlah review dari organizer.">
        <p class="text-2xl font-semibold text-ui-light">{{ meta.totalReviews }}</p>
      </UiCard>
    </section>

    <ReviewList :reviews="reviews" :loading="pending" />
  </div>
</template>

<script setup lang="ts">
import ReviewList from '~/components/talent/ReviewList.vue';
import { useTalentReviews } from '~/composables/useTalentReviews';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Reviews';

const { data: reviews, pending, meta } = useTalentReviews();

const averageRatingLabel = computed(() => `${meta.value.averageRating.toFixed(1)} / 5`);
</script>
