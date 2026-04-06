<template>
  <SharedNavbar
    :title="title"
    :subtitle="subtitle"
    :notifications="notifications"
    :user-name="userName"
    :user-role="userRole"
    :header-classes="adminHeaderClasses"
    :title-classes="adminTitleClasses"
    :subtitle-classes="adminSubtitleClasses"
    :user-name-classes="adminUserNameClasses"
    :user-role-classes="adminUserRoleClasses"
    :menu-button-class="menuButtonClass"
    :menu-button-icon="menuButtonIcon"
    @toggle-sidebar="$emit('toggle-sidebar')"
  >
    <template #actions="slotProps">
      <slot name="actions" v-bind="slotProps" />
    </template>
  </SharedNavbar>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    notifications?: number;
    userName?: string;
    userRole?: string;
    menuButtonClass?: string;
    menuButtonIcon?: string;
  }>(),
  {
    title: 'Admin Dashboard',
    subtitle: '',
    notifications: 0,
    userName: 'Administrator',
    userRole: 'Administrator',
    menuButtonClass: '',
    menuButtonIcon: 'i-lucide-menu',
  },
);

defineEmits<{
  'toggle-sidebar': [];
}>();

const adminHeaderClasses = computed(
  () => 'sticky top-0 z-30 border-b border-white/10 bg-ui-dark/70 backdrop-blur-xl',
);

const adminTitleClasses = computed(
  () =>
    'font-display font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent',
);
const adminSubtitleClasses = computed(() => 'text-neutral-light/70');
const adminUserNameClasses = computed(() => 'text-ui-light font-semibold');
const adminUserRoleClasses = computed(() => 'text-accent/90 font-medium');
</script>
