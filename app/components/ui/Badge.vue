<template>
  <UBadge :label="label" :color="color" :variant="variant" :size="size" :class="['rounded-full font-medium', dot ? 'pl-2.5 pr-3' : '', badgeClass]">
    <template v-if="dot" #default>
      <span class="mr-1.5 inline-block h-2 w-2 rounded-full bg-current/80" />
      <span>{{ label }}</span>
    </template>
  </UBadge>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label: string;
    color?: 'warning' | 'success' | 'error' | 'neutral' | 'primary' | 'secondary' | 'info';
    variant?: 'solid' | 'outline' | 'soft' | 'subtle';
    size?: 'sm' | 'md' | 'lg';
    dot?: boolean;
    badgeClass?: string;
  }>(),
  {
    color: 'neutral',
    variant: 'soft',
    size: 'sm',
    dot: false,
    badgeClass: '',
  },
);
</script>
