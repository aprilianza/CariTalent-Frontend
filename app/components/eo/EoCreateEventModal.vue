<template>
  <UModal v-model:open="modelOpen" :ui="{ content: 'bg-transparent ring-0 shadow-none sm:max-w-2xl w-full mx-auto' }">
    <template #content>
      <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl">
        <!-- Background decoration -->
        <div class="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-32 -left-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-6">
          <!-- Header -->
          <div class="border-b border-white/5 pb-4">
            <h3 class="text-2xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              {{ mode === 'edit' ? 'Edit Event' : 'Buat Event Baru' }}
            </h3>
            <p class="mt-1.5 text-sm text-neutral-light/70">
              {{ mode === 'edit' ? 'Perbarui detail event yang sudah kamu buat.' : 'Isi detail event yang ingin kamu selenggarakan.' }}
            </p>
          </div>

          <!-- Form -->
          <form class="space-y-5" @submit.prevent="handleSubmit">
            <!-- Title -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-neutral-light">Judul Event <span class="text-error">*</span></label>
              <UInput
                v-model="form.title"
                placeholder="Contoh: Punk Night Vol. 4"
                :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
              />
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-2">
              <label class="text-sm font-semibold text-neutral-light">Deskripsi</label>
              <UTextarea
                v-model="form.description"
                placeholder="Deskripsikan event kamu..."
                :rows="3"
                :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all resize-none' }"
              />
            </div>

            <!-- Grid: Genre & Budget -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Genre Dibutuhkan <span class="text-error">*</span></label>
                <USelectMenu
                  v-model="selectedGenreIds"
                  :items="genreOptions"
                  multiple
                  placeholder="Pilih genre..."
                  value-key="value"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Budget (Rp) <span class="text-error">*</span></label>
                <UInput
                  v-model="form.budget"
                  type="number"
                  placeholder="3000000"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
            </div>

            <!-- Grid: Date & Status -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Tanggal Event <span class="text-error">*</span></label>
                <UInput
                  v-model="form.event_date"
                  type="date"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Status Awal</label>
                <USelectMenu
                  v-model="form.status"
                  :items="statusOptions"
                  value-key="value"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
            </div>

            <!-- Grid: Venue & City -->
            <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Nama Venue <span class="text-error">*</span></label>
                <UInput
                  v-model="form.venue_name"
                  placeholder="Kafe Kota Bandung"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-semibold text-neutral-light">Kota <span class="text-error">*</span></label>
                <UInput
                  v-model="form.city"
                  placeholder="Bandung"
                  :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light placeholder-neutral-light/40 focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
                />
              </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-white/5">
              <UiButton color="neutral" variant="ghost" type="button" class="hover:bg-white/5" @click="modelOpen = false">Batal</UiButton>
              <UiButton
                color="primary"
                variant="soft"
                type="submit"
                :loading="loading"
                :disabled="!isFormValid"
                :icon="mode === 'edit' ? 'mdi:content-save-outline' : 'mdi:plus-circle-outline'"
                class="bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-400 hover:to-indigo-400 text-white shadow-lg shadow-violet-500/25 border-0"
              >
                {{ mode === 'edit' ? 'Simpan Perubahan' : 'Buat Event' }}
              </UiButton>
            </div>
          </form>
        </div>
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
    mode?: 'create' | 'edit';
    initialData?: Partial<CreateEventPayload>;
  }>(),
  {
    genres: () => [],
    loading: false,
    mode: 'create',
    initialData: () => ({}),
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

// Reset or populate form when modal opens/closes
watch(modelOpen, (isOpen) => {
  if (isOpen) {
    if (props.mode === 'edit' && props.initialData) {
      form.title = props.initialData.title || '';
      form.description = props.initialData.description || '';
      form.budget = props.initialData.budget ? String(props.initialData.budget) : '';
      form.event_date = props.initialData.event_date || '';
      form.venue_name = props.initialData.venue_name || '';
      form.city = props.initialData.city || '';
      form.status = props.initialData.status || 'draft';
      selectedGenreIds.value = props.initialData.genre_ids ? [...props.initialData.genre_ids] : [];
    } else {
      // Create mode
      form.title = '';
      form.description = '';
      form.budget = '';
      form.event_date = '';
      form.venue_name = '';
      form.city = '';
      form.status = 'draft';
      selectedGenreIds.value = [];
    }
  }
});
</script>
