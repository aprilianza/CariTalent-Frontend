<template>
  <SharedNavbar
    :title="title"
    :subtitle="subtitle"
    :user-name="userName"
    :user-role="userRole"
    :header-classes="talentHeaderClasses"
    :title-classes="talentTitleClasses"
    :subtitle-classes="talentSubtitleClasses"
    :user-name-classes="talentUserNameClasses"
    :user-role-classes="talentUserRoleClasses"
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
    userName?: string;
    userRole?: string;
    menuButtonClass?: string;
    menuButtonIcon?: string;
  }>(),
  {
    title: 'Talent Dashboard',
    subtitle: '',
    userName: 'Talent User',
    userRole: 'Talent',
    menuButtonClass: '',
    menuButtonIcon: 'i-lucide-menu',
  },
);

defineEmits<{
  'toggle-sidebar': [];
}>();

// Talent-specific styling
const talentHeaderClasses = computed(() => 'sticky top-0 z-30 border-b border-white/10 bg-ui-dark/70 backdrop-blur-xl');

const talentTitleClasses = computed(() => 'font-display font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent');
const talentSubtitleClasses = computed(() => 'text-neutral-light/70');
const talentUserNameClasses = computed(() => 'text-ui-light font-semibold');
const talentUserRoleClasses = computed(() => 'text-accent/90 font-medium');
</script>
