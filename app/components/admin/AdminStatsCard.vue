<template>
  <UiCard :no-padding="true" card-class="h-full border-white/5 bg-transparent shadow-none">
    <div
      class="flex h-full items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 hover:shadow-lg hover:shadow-black/20"
    >
      <div class="flex h-full flex-col justify-between gap-4">
        <div>
          <p class="text-sm font-medium tracking-wide text-neutral-light/70">{{ title }}</p>
          <p class="mt-1 font-display text-3xl font-bold text-ui-light">{{ value }}</p>
        </div>
        <p v-if="hint" class="flex items-center gap-1.5 text-xs font-medium text-neutral-light/50">
          <Icon name="mdi:information-outline" class="h-4 w-4 opacity-70" />
          {{ hint }}
        </p>
      </div>

      <div :class="['rounded-2xl border p-3 shadow-inner', colorClass]">
        <Icon :name="icon" class="h-7 w-7" />
      </div>
    </div>
  </UiCard>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    value: string | number;
    icon?: string;
    hint?: string;
    colorClass?: string;
  }>(),
  {
    icon: 'mdi:chart-box-outline',
    hint: '',
    colorClass: 'text-accent bg-highlight/12 border-highlight/30',
  },
);
</script>
