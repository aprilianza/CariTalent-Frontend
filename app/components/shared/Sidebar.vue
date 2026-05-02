<template>
  <aside :class="sidebarClasses">
    <!-- Header Section - Customizable via slot -->
    <slot name="header">
      <NuxtLink :to="headerLink" class="mb-8 flex items-center gap-3 px-2">
        <div :class="headerIconClasses">
          <img :src="logoImage" alt="Logo CariTalent" class="h-6 w-6 object-contain" />
        </div>
        <div>
          <p class="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{{ headerTitle }}</p>
          <p class="text-xs text-neutral-500 dark:text-neutral-400">{{ headerSubtitle }}</p>
        </div>
      </NuxtLink>
    </slot>

    <!-- Navigation Section -->
    <nav class="space-y-1">
      <NuxtLink v-for="item in links" :key="item.to" :to="item.to" class="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors" :class="getNavItemClasses(isActive(item.to))" @click="emit('navigate')">
        <span class="flex items-center gap-3">
          <Icon :name="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </span>
        <Icon v-if="isActive(item.to)" name="mdi:chevron-right" class="h-4 w-4" />
      </NuxtLink>
    </nav>

    <!-- Footer Section - Customizable via slot -->
    <slot name="footer">
      <div :class="footerClasses">
        <p class="text-xs font-semibold uppercase tracking-wide" :class="footerTitleClasses">{{ footerTitle }}</p>
        <p class="mt-2 text-sm" :class="footerContentClasses">{{ footerContent }}</p>
      </div>
    </slot>

    <!-- Logout Button Section -->
    <div class="mt-6 border-t border-white/10 pt-4">
      <button
        class="w-full flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white"
        @click="handleLogout"
      >
        <Icon name="mdi:logout" class="h-4 w-4" />
        Logout
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
import logoImage from '~/assets/logo.png';

type SidebarLink = {
  label: string;
  to: string;
  icon: string;
};

const route = useRoute();

const props = withDefaults(
  defineProps<{
    links?: SidebarLink[];
    headerTitle?: string;
    headerSubtitle?: string;
    headerIcon?: string;
    headerLink?: string;
    headerIconClasses?: string;
    footerTitle?: string;
    footerContent?: string;
    activeItemClass?: string;
    inactiveItemClass?: string;
    sidebarClass?: string;
    footerClass?: string;
    footerTitleClass?: string;
    footerContentClass?: string;
  }>(),
  {
    links: () => [
      { label: 'Dashboard', to: '/dashboard/talent', icon: 'mdi:view-dashboard-outline' },
      { label: 'Applications', to: '/dashboard/talent#applications', icon: 'mdi:file-document-outline' },
      { label: 'Invitations', to: '/dashboard/talent#invitations', icon: 'mdi:email-fast-outline' },
      { label: 'Bookings', to: '/dashboard/talent#bookings', icon: 'mdi:calendar-check-outline' },
      { label: 'Profile', to: '/dashboard/talent#profile', icon: 'mdi:account-circle-outline' },
    ],
    headerTitle: 'CariTalent',
    headerSubtitle: 'Talent Workspace',
    headerIcon: 'mdi:music-circle',
    headerLink: '/dashboard/talent',
    headerIconClasses: 'flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary',
    footerTitle: 'Pro Tips',
    footerContent: 'Perbarui portfolio setiap minggu untuk meningkatkan peluang diterima organizer.',
    activeItemClass: 'bg-primary/12 text-primary dark:bg-primary/15',
    inactiveItemClass: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-white/10 dark:hover:text-white',
    sidebarClass: 'flex h-full w-72 flex-col border-r border-white/10 bg-white/90 px-4 py-5 dark:bg-neutral-950/80',
    footerClass: 'mt-auto rounded-2xl border border-primary/20 bg-primary/8 p-4',
    footerTitleClass: 'text-primary',
    footerContentClass: 'text-neutral-700 dark:text-neutral-200',
  },
);

const emit = defineEmits<{
  navigate: [];
  logout: [];
}>();

const handleLogout = () => {
  emit('logout');
};

const sidebarClasses = computed(() => props.sidebarClass);

const footerClasses = computed(() => props.footerClass);
const footerTitleClasses = computed(() => props.footerTitleClass);
const footerContentClasses = computed(() => props.footerContentClass);

const getNavItemClasses = (active: boolean) => {
  return active ? props.activeItemClass : props.inactiveItemClass;
};

const isActive = (to: string) => {
  if (to.includes('#')) {
    const [path] = to.split('#');
    return route.path === path;
  }

  return route.path === to;
};
</script>
