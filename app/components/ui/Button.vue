<template>
  <UButton
    :color="color"
    :variant="variant"
    :size="size"
    :block="block"
    :loading="loading"
    :disabled="disabled"
    :icon="icon"
    :class="['rounded-xl font-medium transition-transform hover:-translate-y-0.5', buttonClass]"
    @click="$emit('click')"
  >
    <slot>{{ label }}</slot>
  </UButton>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string;
    color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral';
    variant?: 'solid' | 'outline' | 'soft' | 'subtle' | 'ghost' | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    icon?: string;
    block?: boolean;
    loading?: boolean;
    disabled?: boolean;
    buttonClass?: string;
  }>(),
  {
    label: '',
    color: 'primary',
    variant: 'solid',
    size: 'md',
    icon: undefined,
    block: false,
    loading: false,
    disabled: false,
    buttonClass: '',
  },
);

defineEmits<{
  click: [];
}>();
</script>
