<template>
  <UModal v-model:open="modelOpen">
    <template #content>
      <div class="rounded-2xl border border-white/10 bg-ui-dark p-6 space-y-6 max-w-lg w-full mx-auto">
        <!-- Header -->
        <div>
          <h3 class="text-xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Buat Event Baru
          </h3>
          <p class="mt-1 text-sm text-neutral-light/70">Isi detail event yang ingin kamu selenggarakan.</p>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <!-- Title -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-neutral-light">Judul Event <span class="text-error">*</span></label>
            <UInput
              v-model="form.title"
              placeholder="Contoh: Punk Night Vol. 4"
              :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
            />
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <label class="text-sm font-medium text-neutral-light">Deskripsi</label>
            <UTextarea
              v-model="form.description"
              placeholder="Deskripsikan event kamu..."
              :rows="3"
              :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
            />
          </div>

          <!-- Genre & Budget row -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-neutral-light">Genre Dibutuhkan <span class="text-error">*</span></label>
              <USelectMenu
                v-model="selectedGenreIds"
                :items="genreOptions"
                multiple
                placeholder="Pilih genre..."
                value-key="value"
                :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-neutral-light">Budget (Rp) <span class="text-error">*</span></label>
              <UInput
                v-model="form.budget"
                type="number"
                placeholder="3000000"
                :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
              />
            </div>
          </div>

          <!-- Date & Status row -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-neutral-light">Tanggal Event <span class="text-error">*</span></label>
              <UInput
                v-model="form.event_date"
                type="date"
                :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-neutral-light">Status Awal</label>
              <USelectMenu
                v-model="form.status"
                :items="statusOptions"
                value-key="value"
                :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
              />
            </div>
          </div>

          <!-- Venue & City row -->
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-neutral-light">Nama Venue <span class="text-error">*</span></label>
              <UInput
                v-model="form.venue_name"
                placeholder="Kafe Kota Bandung"
                :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
              />
            </div>
            <div class="space-y-1.5">
              <label class="text-sm font-medium text-neutral-light">Kota <span class="text-error">*</span></label>
              <UInput
                v-model="form.city"
                placeholder="Bandung"
                :ui="{ base: 'rounded-xl border-white/20 bg-white/8 text-ui-light' }"
              />
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-2">
            <UiButton color="neutral" variant="ghost" type="button" @click="modelOpen = false">Batal</UiButton>
            <UiButton
              color="primary"
              variant="soft"
              type="submit"
              :loading="loading"
              :disabled="!isFormValid"
              icon="mdi:plus-circle-outline"
            >
              Buat Event
            </UiButton>
          </div>
        </form>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import type { CreateEventPayload, EventStatus, Genre } from '~/composables/types';

const props = withDefaults(
  defineProps<{
    genres?: Genre[];
    loading?: boolean;
  }>(),
  {
    genres: () => [],
    loading: false,
  },
);

const emit = defineEmits<{
  submit: [payload: CreateEventPayload];
}>();

const modelOpen = defineModel<boolean>('open', { default: false });

const genreOptions = computed(() =>
  props.genres.map((g) => ({ label: g.name, value: g.id })),
);

const statusOptions = [
  { label: 'Draft (simpan dulu)', value: 'draft' },
  { label: 'Open (langsung terima lamar)', value: 'open' },
];

const selectedGenreIds = ref<number[]>([]);

const form = reactive<{
  title: string;
  description: string;
  budget: string;
  event_date: string;
  venue_name: string;
  city: string;
  status: EventStatus;
}>({
  title: '',
  description: '',
  budget: '',
  event_date: '',
  venue_name: '',
  city: '',
  status: 'draft',
});

const isFormValid = computed(() =>
  form.title.trim() !== '' &&
  form.budget !== '' &&
  Number(form.budget) > 0 &&
  form.event_date !== '' &&
  form.venue_name.trim() !== '' &&
  form.city.trim() !== '' &&
  selectedGenreIds.value.length > 0,
);

const handleSubmit = () => {
  if (!isFormValid.value) return;

  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    genre_ids: selectedGenreIds.value,
    budget: Number(form.budget),
    event_date: form.event_date,
    venue_name: form.venue_name.trim(),
    city: form.city.trim(),
    status: form.status,
  });
};

// Reset form when modal closes
watch(modelOpen, (val) => {
  if (!val) {
    form.title = '';
    form.description = '';
    form.budget = '';
    form.event_date = '';
    form.venue_name = '';
    form.city = '';
    form.status = 'draft';
    selectedGenreIds.value = [];
  }
});
</script>
