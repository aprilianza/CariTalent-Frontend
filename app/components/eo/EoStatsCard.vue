<template>
  <UiCard :no-padding="true" card-class="h-full">
    <div class="flex h-full items-start justify-between rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-violet-500/40 hover:bg-white/8">
      <div>
        <p class="text-xs font-medium uppercase tracking-wide text-neutral-light/70">{{ title }}</p>
        <p class="mt-2 text-2xl font-bold text-ui-light">{{ value }}</p>
        <p v-if="hint" class="mt-1 text-xs text-neutral-light/65">{{ hint }}</p>
      </div>

      <div class="rounded-xl border border-violet-500/30 bg-violet-500/12 p-2 text-fuchsia-400">
        <Icon :name="icon" class="h-5 w-5" />
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
  }>(),
  {
    icon: 'mdi:chart-box-outline',
    hint: '',
  },
);
</script>
