<template>
  <span v-if="count > 0" :class="badgeClasses">
    {{ displayCount }}
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    count: number;
    max?: number;
    badgeClasses?: string;
  }>(),
  {
    badgeClasses: 'inline-flex min-w-5 items-center justify-center rounded-full bg-error px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white absolute -top-1 -right-1',
  },
);

const displayCount = computed(() => {
  const max = props.max ?? 99;
  return props.count > max ? `${max}+` : `${props.count}`;
});
</script>
