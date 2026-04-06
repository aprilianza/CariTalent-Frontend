<template>
  <div class="space-y-6">
    <!-- Page header -->
    <UiCard card-class="border-white/10 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
      <div>
        <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          My Bookings
        </h1>
        <p class="mt-1 text-sm text-neutral-light/70">
          {{ bookings.length }} booking · {{ confirmedCount }} confirmed · {{ completedCount }} completed
        </p>
      </div>
    </UiCard>

    <!-- Filter tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        :class="[
          'rounded-xl px-4 py-1.5 text-sm font-medium transition-all',
          activeFilter === tab.value
            ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300'
            : 'border border-white/10 bg-white/5 text-neutral-light/60 hover:bg-white/8 hover:text-neutral-light',
        ]"
        @click="activeFilter = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-xs">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Booking list -->
    <EoBookingList
      :bookings="filteredBookings"
      :loading="pending"
      :detailed="true"
      :completing-id="completingId"
      @complete="handleComplete"
      @cancel="handleCancel"
    />

    <!-- Review modal -->
    <UModal v-model:open="showReviewModal">
      <template #content>
        <div class="rounded-2xl border border-white/10 bg-ui-dark p-6 space-y-5 max-w-md w-full mx-auto">
          <div>
            <h3 class="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
              Berikan Review
            </h3>
            <p class="mt-1 text-sm text-neutral-light/70">Bagaimana penampilan talent di event ini?</p>
          </div>

          <!-- Star rating -->
          <div class="space-y-2">
            <label class="text-sm font-medium text-neutral-light">Rating</label>
            <div class="flex gap-2">
              <button
                v-for="star in 5"
                :key="star"
                @click="reviewForm.rating = star"
              >
                <Icon
                  :name="star <= reviewForm.rating ? 'mdi:star' : 'mdi:star-outline'"
                  :class="star <= reviewForm.rating ? 'text-yellow-400' : 'text-neutral-light/30'"
                  class="h-7 w-7 transition-colors"
                />
              </button>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-neutral-light">Komentar</label>
            <UTextarea
              v-model="reviewForm.comment"
              placeholder="Ceritakan pengalaman kamu dengan talent ini..."
              :rows="4"
              :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
            />
          </div>

          <div class="flex justify-end gap-3">
            <UiButton color="neutral" variant="ghost" @click="showReviewModal = false">Batal</UiButton>
            <UiButton
              color="primary"
              variant="soft"
              :loading="submittingReview"
              :disabled="reviewForm.rating === 0 || !reviewForm.comment.trim()"
              icon="mdi:send-outline"
              @click="submitReview"
            >
              Kirim Review
            </UiButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import EoBookingList from '~/components/eo/EoBookingList.vue';
import { useEoBookings } from '~/composables/useEoBookings';
import type { EoBooking, BookingStatus } from '~/composables/types';

definePageMeta({
  layout: 'eo',
});

const pageTitle = useState('eo-layout-title');
pageTitle.value = 'My Bookings';

const toast = useToast();
const { data: rawBookings, pending } = useEoBookings();

const bookings = ref<EoBooking[]>([]);
watch(rawBookings, (val) => { bookings.value = val.map((b) => ({ ...b })); }, { immediate: true });

const completingId = ref<number | null>(null);
const showReviewModal = ref(false);
const reviewTargetBookingId = ref<number | null>(null);
const submittingReview = ref(false);

const reviewForm = reactive({ rating: 0, comment: '' });

type FilterValue = BookingStatus | 'all';
const activeFilter = ref<FilterValue>('all');

const confirmedCount = computed(() => bookings.value.filter((b) => b.status === 'confirmed').length);
const completedCount = computed(() => bookings.value.filter((b) => b.status === 'completed').length);

const filterTabs = computed<{ label: string; value: FilterValue; count: number }[]>(() => [
  { label: 'Semua', value: 'all', count: bookings.value.length },
  { label: 'Confirmed', value: 'confirmed', count: confirmedCount.value },
  { label: 'Completed', value: 'completed', count: completedCount.value },
]);

const filteredBookings = computed(() => {
  if (activeFilter.value === 'all') return bookings.value;
  return bookings.value.filter((b) => b.status === activeFilter.value);
});

const handleComplete = async (id: number) => {
  completingId.value = id;

  // Optimistic update
  const idx = bookings.value.findIndex((b) => b.id === id);
  if (idx !== -1) {
    bookings.value[idx] = { ...bookings.value[idx], status: 'completed' };
  }

  await new Promise((resolve) => setTimeout(resolve, 600));
  completingId.value = null;

  // Prompt review
  reviewTargetBookingId.value = id;
  reviewForm.rating = 0;
  reviewForm.comment = '';
  showReviewModal.value = true;

  toast.add({
    title: 'Booking selesai!',
    description: 'Booking ditandai selesai. Berikan review untuk talent kamu.',
    color: 'success',
    icon: 'mdi:check-decagram-outline',
  });
};

const handleCancel = async (id: number) => {
  const idx = bookings.value.findIndex((b) => b.id === id);
  if (idx !== -1) {
    // Remove from list (pessimistic)
    bookings.value.splice(idx, 1);
  }

  await new Promise((resolve) => setTimeout(resolve, 400));

  toast.add({
    title: 'Booking dibatalkan',
    description: `Booking #${id} berhasil dibatalkan.`,
    color: 'warning',
    icon: 'mdi:close-circle-outline',
  });
};

const submitReview = async () => {
  if (!reviewTargetBookingId.value || reviewForm.rating === 0) return;
  submittingReview.value = true;

  await new Promise((resolve) => setTimeout(resolve, 700));

  submittingReview.value = false;
  showReviewModal.value = false;

  toast.add({
    title: 'Review terkirim!',
    description: `Rating ${reviewForm.rating}/5 berhasil dikirim. Terima kasih atas ulasannya!`,
    color: 'success',
    icon: 'mdi:star-check-outline',
  });
};
</script>
