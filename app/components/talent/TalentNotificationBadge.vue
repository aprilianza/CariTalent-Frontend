<template>
  <SharedNotificationBadge :count="count" :max="max" :badge-classes="talentBadgeClasses" />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    count: number;
    max?: number;
    showGradient?: boolean;
    pulseAnimation?: boolean;
  }>(),
  {
    showGradient: false,
    pulseAnimation: false,
  },
);

const talentBadgeClasses = computed(() => {
  let classes = 'inline-flex min-w-5 items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white absolute -top-1 -right-1';

  if (props.showGradient) {
    classes += ' bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30';
  } else {
    classes += ' bg-error';
  }

  if (props.pulseAnimation) {
    classes += ' animate-pulse';
  }

  return classes;
});
</script>
