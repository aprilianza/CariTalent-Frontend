<template>
  <UCard
    :class="['rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-sm transition-colors', noPadding ? '' : 'p-1', cardClass]"
    :ui="{
      header: ['px-5 pt-5 pb-3', title || description || $slots.header ? '' : 'hidden'],
      body: [noPadding ? '' : 'px-5 pb-5'],
      footer: ['px-5 pb-5 pt-0'],
    }"
  >
    <template #header>
      <slot name="header">
        <div v-if="title || description" class="space-y-1">
          <h3 v-if="title" class="text-base font-semibold text-ui-light">
            {{ title }}
          </h3>
          <p v-if="description" class="text-sm text-neutral-light/70">
            {{ description }}
          </p>
        </div>
      </slot>
    </template>

    <slot />

    <template v-if="$slots.footer" #footer>
      <slot name="footer" />
    </template>
  </UCard>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
  cardClass?: string;
  noPadding?: boolean;
}>();
</script>
