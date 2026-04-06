<template>
  <SharedSidebar
    :links="adminLinks"
    :header-title="headerTitle"
    :header-subtitle="headerSubtitle"
    :header-icon="headerIcon"
    :header-link="headerLink"
    :header-icon-classes="adminHeaderIconClasses"
    :footer-title="footerTitle"
    :footer-content="footerContent"
    :active-item-class="adminActiveItemClass"
    :inactive-item-class="adminInactiveItemClass"
    :sidebar-class="adminSidebarClass"
    :footer-class="adminFooterClass"
    :footer-title-class="adminFooterTitleClass"
    :footer-content-class="adminFooterContentClass"
    @navigate="emit('navigate')"
  />
</template>

<script setup lang="ts">
type SidebarLink = {
  label: string;
  to: string;
  icon: string;
};

const props = withDefaults(
  defineProps<{
    links?: SidebarLink[];
    headerTitle?: string;
    headerSubtitle?: string;
    headerIcon?: string;
    headerLink?: string;
    footerTitle?: string;
    footerContent?: string;
  }>(),
  {
    links: () => [
      { label: 'Overview', to: '/dashboard/admin', icon: 'mdi:view-dashboard-outline' },
      { label: 'Users', to: '/dashboard/admin/users', icon: 'mdi:account-group-outline' },
      { label: 'Talents', to: '/dashboard/admin/talents', icon: 'mdi:music-note-outline' },
      { label: 'Events', to: '/dashboard/admin/events', icon: 'mdi:calendar-star-outline' },
    ],
    headerTitle: 'CariTalent',
    headerSubtitle: 'Admin Panel',
    headerIcon: 'mdi:shield-crown-outline',
    headerLink: '/dashboard/admin',
    footerTitle: 'Admin Tips',
    footerContent: 'Verifikasi talent secara berkala untuk menjaga kualitas platform.',
  },
);

const emit = defineEmits<{
  navigate: [];
}>();

const adminLinks = computed(() => props.links);

const adminSidebarClass = computed(
  () =>
    'flex h-full w-72 flex-col border-r border-white/10 bg-ui-dark/70 px-4 py-5 backdrop-blur-xl',
);

const adminHeaderIconClasses = computed(
  () =>
    'flex h-10 w-10 items-center justify-center rounded-xl border border-highlight/30 bg-highlight/10 text-accent shadow-lg shadow-highlight/25',
);

const adminActiveItemClass = computed(
  () =>
    'bg-gradient-to-r from-highlight/20 to-accent/15 border border-highlight/30 text-ui-light shadow-sm font-medium',
);

const adminInactiveItemClass = computed(
  () => 'text-neutral-light/80 hover:bg-white/8 hover:text-ui-light',
);

const adminFooterClass = computed(
  () => 'mt-auto rounded-2xl border border-highlight/30 bg-highlight/10 p-4 backdrop-blur-sm',
);
const adminFooterTitleClass = computed(() => 'text-accent');
const adminFooterContentClass = computed(() => 'text-neutral-light/80');
</script>
