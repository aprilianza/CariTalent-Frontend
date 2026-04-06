<template>
  <SharedNavbar
    :title="title"
    :subtitle="subtitle"
    :notifications="notifications"
    :user-name="userName"
    :user-role="userRole"
    :header-classes="eoHeaderClasses"
    :title-classes="eoTitleClasses"
    :subtitle-classes="eoSubtitleClasses"
    :user-name-classes="eoUserNameClasses"
    :user-role-classes="eoUserRoleClasses"
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
    title: 'EO Dashboard',
    subtitle: '',
    notifications: 0,
    userName: 'Event Organizer',
    userRole: 'Event Organizer',
    menuButtonClass: '',
    menuButtonIcon: 'i-lucide-menu',
  },
);

defineEmits<{
  'toggle-sidebar': [];
}>();

// EO-specific styling (violet/fuchsia palette)
const eoHeaderClasses = computed(() => 'sticky top-0 z-30 border-b border-white/10 bg-ui-dark/70 backdrop-blur-xl');
const eoTitleClasses = computed(() => 'font-display font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent');
const eoSubtitleClasses = computed(() => 'text-neutral-light/70');
const eoUserNameClasses = computed(() => 'text-ui-light font-semibold');
const eoUserRoleClasses = computed(() => 'text-fuchsia-400/90 font-medium');
</script>
