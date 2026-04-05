<template>
  <div class="space-y-3">
    <div v-if="title || subtitle || $slots.actions" class="flex items-start justify-between gap-3">
      <div>
        <h4 v-if="title" class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
          {{ title }}
        </h4>
        <p v-if="subtitle" class="text-xs text-neutral-500 dark:text-neutral-400">
          {{ subtitle }}
        </p>
      </div>
      <slot name="actions" />
    </div>

    <div v-if="items.length === 0" class="rounded-xl border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
      {{ emptyText }}
    </div>

    <ul v-else class="space-y-2">
      <li v-for="item in items" :key="item.id" class="rounded-xl border border-neutral-200 bg-white px-4 py-3 transition-colors hover:border-primary/40 dark:border-white/10 dark:bg-white/5">
        <slot name="item" :item="item">
          <div class="flex items-center justify-between gap-3">
            <div>
              <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ item.title }}</p>
              <p v-if="item.subtitle" class="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">{{ item.subtitle }}</p>
            </div>
            <p v-if="item.meta" class="text-xs font-medium text-neutral-600 dark:text-neutral-300">{{ item.meta }}</p>
          </div>
        </slot>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
export type UiListItem = {
  id: number | string;
  title: string;
  subtitle?: string;
  meta?: string;
  [key: string]: any;
};

withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    emptyText?: string;
    items: UiListItem[];
  }>(),
  {
    title: '',
    subtitle: '',
    emptyText: 'Tidak ada data untuk ditampilkan.',
  },
);
</script>
