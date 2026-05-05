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
      <!-- Right Section - Customizable via slot -->
      <slot name="actions">
        <div class="flex items-center gap-1 sm:gap-4">
          <!-- Notification Popover -->
          <UPopover>
            <UButton color="neutral" variant="ghost" icon="mdi:bell-outline" class="relative hover:bg-white/10 rounded-xl">
              <component :is="notificationBadgeComponent" :count="notifications" v-bind="notificationBadgeProps" />
            </UButton>

            <template #panel>
              <div class="p-4 w-80 bg-[#1e1e2e]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl space-y-4">
                <div class="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 class="font-semibold text-neutral-light">Notifikasi</h4>
                  <span v-if="notifications > 0" class="text-xs text-violet-400 bg-violet-400/10 px-2 py-1 rounded-md">{{ notifications }} Baru</span>
                </div>
                
                <div class="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
                  <!-- Notifikasi 1: Info Event -->
                  <div class="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div class="mt-0.5 rounded-full bg-violet-500/20 p-1.5 text-violet-400 shrink-0">
                      <Icon name="mdi:calendar-star" class="h-4 w-4" />
                    </div>
                    <div class="flex-1 space-y-1">
                      <div class="flex items-center justify-between">
                        <p class="text-xs font-bold text-violet-300">INFO EVENT</p>
                        <span class="text-[10px] text-neutral-500">2 mnt lalu</span>
                      </div>
                      <p class="text-sm font-semibold text-neutral-100">Pelamar Baru Masuk</p>
                      <p class="text-xs text-neutral-400">Event "Punk Night Vol. 3" mendapatkan pelamar baru: The Broken Strings.</p>
                    </div>
                  </div>

                  <!-- Notifikasi 2: Info Sistem/Profil -->
                  <div class="flex gap-3 items-start p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                    <div class="mt-0.5 rounded-full bg-indigo-500/20 p-1.5 text-indigo-400 shrink-0">
                      <Icon name="mdi:account-check" class="h-4 w-4" />
                    </div>
                    <div class="flex-1 space-y-1">
                      <div class="flex items-center justify-between">
                        <p class="text-xs font-bold text-indigo-300">INFO PROFIL</p>
                        <span class="text-[10px] text-neutral-500">1 jam lalu</span>
                      </div>
                      <p class="text-sm font-semibold text-neutral-100">Verifikasi Sukses</p>
                      <p class="text-xs text-neutral-400">Profil EO kamu telah berhasil diverifikasi oleh admin CariTalent.</p>
                    </div>
                  </div>
                  
                  <div v-if="notifications === 0" class="text-center py-6 text-sm text-neutral-500">
                    Tidak ada notifikasi baru.
                  </div>
                </div>
              </div>
            </template>
          </UPopover>

          <!-- Profile -->
          <div class="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white/10 p-1.5 rounded-xl transition-colors" @click="$emit('profile-click')">
            <div class="hidden text-right sm:block">
              <p class="text-sm font-semibold" :class="userNameClasses">{{ userName }}</p>
              <p class="text-xs" :class="userRoleClasses">{{ userRole }}</p>
            </div>
            <UAvatar :alt="userName" size="sm" />
          </div>
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
  'profile-click': [];
}>();
</script>
