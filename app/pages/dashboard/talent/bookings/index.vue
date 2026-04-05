<template>
  <div class="space-y-6">
    <UiCard card-class="overflow-hidden border-white/10 bg-gradient-to-br from-highlight/12 via-white/5 to-accent/12 shadow-md">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-sm font-medium text-neutral-light/70">Talent Workspace</p>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent md:text-3xl">Upcoming Bookings</h1>
          <div class="mt-3 flex flex-wrap gap-2">
            <UiBadge :label="`Confirmed ${statusSummary.confirmed}`" color="success" variant="soft" />
            <UiBadge :label="`Completed ${statusSummary.completed}`" color="primary" variant="soft" />
          </div>
        </div>
        <UiBadge :label="`${bookings.length} total`" color="secondary" variant="soft" />
      </div>
    </UiCard>

    <BookingList :bookings="bookings" :loading="pending" />
  </div>
</template>

<script setup lang="ts">
import BookingList from '~/components/talent/BookingList.vue';
import { useBookings } from '~/composables/useBookings';

definePageMeta({
  layout: 'talent',
});

useState('talent-layout-title', () => 'Talent Dashboard').value = 'Bookings';

const { data: bookings, pending } = useBookings();

const statusSummary = computed(() => ({
  confirmed: bookings.value.filter((item) => item.status === 'confirmed').length,
  completed: bookings.value.filter((item) => item.status === 'completed').length,
}));
</script>
