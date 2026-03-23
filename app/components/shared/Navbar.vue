<template>
  <header :class="headerClasses">
    <div class="flex h-16 items-center justify-between px-4 sm:px-6">
      <!-- Left Section -->
      <div class="flex items-center gap-3">
        <UButton :icon="menuButtonIcon" variant="ghost" color="neutral" :class="menuButtonClass" @click="$emit('toggle-sidebar')" />
        <div>
          <p class="text-sm font-semibold" :class="titleClasses">{{ title }}</p>
          <p v-if="subtitle" class="text-xs" :class="subtitleClasses">{{ subtitle }}</p>
        </div>
      </div>

      <!-- Right Section - Customizable via slot -->
      <slot name="actions">
        <div class="flex items-center gap-2 sm:gap-3">
          <UButton color="neutral" variant="ghost" icon="i-lucide-bell" class="relative">
            <component :is="notificationBadgeComponent" :count="notifications" v-bind="notificationBadgeProps" />
          </UButton>
          <div class="hidden text-right sm:block">
            <p class="text-sm font-semibold" :class="userNameClasses">{{ userName }}</p>
            <p class="text-xs" :class="userRoleClasses">{{ userRole }}</p>
          </div>
          <UAvatar :alt="userName" size="sm" />
        </div>
      </slot>
    </div>
  </header>
</template>

<script setup lang="ts">
import SharedNotificationBadge from './NotificationBadge.vue';

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    notifications?: number;
    userName?: string;
    userRole?: string;
    headerClasses?: string;
    titleClasses?: string;
    subtitleClasses?: string;
    userNameClasses?: string;
    userRoleClasses?: string;
    notificationBadgeComponent?: any;
    notificationBadgeProps?: Record<string, any>;
    menuButtonClass?: string;
    menuButtonIcon?: string;
  }>(),
  {
    title: 'Dashboard',
    subtitle: '',
    notifications: 0,
    userName: 'Talent User',
    userRole: 'Talent',
    headerClasses: 'sticky top-0 z-30 border-b border-white/10 bg-white/80 backdrop-blur-lg dark:bg-neutral-950/70',
    titleClasses: 'text-neutral-900 dark:text-neutral-100',
    subtitleClasses: 'text-neutral-500 dark:text-neutral-400',
    userNameClasses: 'text-neutral-900 dark:text-neutral-100',
    userRoleClasses: 'text-neutral-500 dark:text-neutral-400',
    notificationBadgeComponent: SharedNotificationBadge,
    notificationBadgeProps: () => ({}),
    menuButtonClass: 'lg:hidden',
    menuButtonIcon: 'i-lucide-menu',
  },
);

defineEmits<{
  'toggle-sidebar': [];
}>();
</script>
