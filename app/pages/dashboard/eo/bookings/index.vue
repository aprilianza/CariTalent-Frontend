<template>
  <div class="space-y-6">
    <!-- Page header -->
    <UiCard card-class="border-white/10 bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10">
      <div>
        <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">My Bookings</h1>
        <p class="mt-1 text-sm text-neutral-light/70">{{ bookings.length }} booking · {{ confirmedCount }} confirmed · {{ completedCount }} completed</p>
      </div>
    </UiCard>

    <!-- Filter tabs -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        :class="[
          'rounded-xl px-4 py-1.5 text-sm font-medium transition-all',
          activeFilter === tab.value ? 'bg-violet-500/20 border border-violet-500/30 text-violet-300' : 'border border-white/10 bg-white/5 text-neutral-light/60 hover:bg-white/8 hover:text-neutral-light',
        ]"
        @click="activeFilter = tab.value"
      >
        {{ tab.label }}
        <span v-if="tab.count > 0" class="ml-1.5 rounded-full bg-white/10 px-1.5 py-0.5 text-xs">{{ tab.count }}</span>
      </button>
    </div>

    <!-- Booking list -->
    <EoBookingList :bookings="filteredBookings" :loading="pending" :detailed="true" :completing-id="completingId" @complete="handleComplete" @cancel="handleCancel" />

    <!-- Review modal -->
    <UModal v-model:open="showReviewModal" :ui="{ content: 'bg-transparent ring-0 shadow-none sm:max-w-md w-full mx-auto' }">
      <template #content>
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl">
          <!-- Background decoration -->
          <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none"></div>

          <div class="relative z-10 space-y-6">
            <!-- Header -->
            <div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">Berikan Review</h3>
              <p class="mt-1.5 text-sm text-neutral-light/70">Bagaimana penampilan talent di event ini?</p>
            </div>

            <!-- Star rating -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-neutral-light">Rating Penampilan</label>
              <div class="flex gap-2.5">
                <button v-for="star in 5" :key="star" @click="reviewForm.rating = star" class="transform transition-all duration-200 hover:scale-110 focus:outline-none">
                  <Icon :name="star <= reviewForm.rating ? 'mdi:star' : 'mdi:star-outline'" :class="star <= reviewForm.rating ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' : 'text-neutral-light/20'" class="h-9 w-9 transition-colors" />
                </button>
              </div>
            </div>

            <!-- Komentar -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-neutral-light">Komentar Tambahan</label>
              <UTextarea v-model="reviewForm.comment" placeholder="Ceritakan pengalaman kamu dengan talent ini..." :rows="4" :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none' }" />
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2">
              <UiButton color="neutral" variant="ghost" class="hover:bg-white/5" @click="showReviewModal = false">Batal</UiButton>
              <UiButton color="primary" variant="soft" :loading="submittingReview" :disabled="reviewForm.rating === 0 || !reviewForm.comment.trim()" icon="mdi:send-outline" @click="submitReview" class="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 border-0"> Kirim Review </UiButton>
            </div>
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
const api = useApiClient();
const { data: rawBookings, pending, refresh, completeBooking, cancelBooking } = useEoBookings();

const bookings = ref<EoBooking[]>([]);
watch(
  rawBookings,
  (val) => {
    bookings.value = val.map((b) => ({ ...b }));
  },
  { immediate: true },
);

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

  const idx = bookings.value.findIndex((b) => b.id === id);
  const previousBooking = idx !== -1 ? { ...bookings.value[idx] } : null;

  if (idx !== -1) {
    bookings.value[idx] = { ...bookings.value[idx], status: 'completed' };
  }

  try {
    await completeBooking(id);
    await refresh();

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
  } catch (error: any) {
    if (idx !== -1 && previousBooking) {
      bookings.value[idx] = previousBooking;
    }

    toast.add({
      title: 'Gagal menyelesaikan booking',
      description: error?.message || 'Backend belum menerima perubahan booking.',
      color: 'error',
      icon: 'mdi:alert-circle-outline',
    });
  } finally {
    completingId.value = null;
  }
};

const handleCancel = async (id: number) => {
  try {
    await cancelBooking(id);
    await refresh();

    toast.add({
      title: 'Booking dibatalkan',
      description: `Booking #${id} berhasil dibatalkan.`,
      color: 'warning',
      icon: 'mdi:close-circle-outline',
    });
  } catch (error: any) {
    toast.add({
      title: 'Gagal membatalkan booking',
      description: error?.message || 'Backend belum menerima pembatalan booking.',
      color: 'error',
      icon: 'mdi:alert-circle-outline',
    });
  }
};

const submitReview = async () => {
  if (!reviewTargetBookingId.value || reviewForm.rating === 0) return;
  submittingReview.value = true;

  try {
    await api.post('/reviews', {
      booking_id: reviewTargetBookingId.value,
      rating: reviewForm.rating,
      comment: reviewForm.comment.trim(),
    });

    await refresh();

    showReviewModal.value = false;

    toast.add({
      title: 'Review terkirim!',
      description: `Rating ${reviewForm.rating}/5 berhasil dikirim. Terima kasih atas ulasannya!`,
      color: 'success',
      icon: 'mdi:star-check-outline',
    });
  } catch (error: any) {
    toast.add({
      title: 'Gagal mengirim review',
      description: error?.message || 'Review belum tersimpan di backend.',
      color: 'error',
      icon: 'mdi:alert-circle-outline',
    });
  } finally {
    submittingReview.value = false;
  }
};
</script>
