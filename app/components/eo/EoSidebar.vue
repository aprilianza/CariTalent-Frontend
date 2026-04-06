<template>
  <SharedSidebar
    :links="eoLinks"
    :header-title="headerTitle"
    :header-subtitle="headerSubtitle"
    :header-icon="headerIcon"
    :header-link="headerLink"
    :header-icon-classes="eoHeaderIconClasses"
    :footer-title="footerTitle"
    :footer-content="footerContent"
    :active-item-class="eoActiveItemClass"
    :inactive-item-class="eoInactiveItemClass"
    :sidebar-class="eoSidebarClass"
    :footer-class="eoFooterClass"
    :footer-title-class="eoFooterTitleClass"
    :footer-content-class="eoFooterContentClass"
    @navigate="emit('navigate')"
  >
    <template #header="slotProps">
      <slot name="header" v-bind="slotProps" />
    </template>
    <template #footer="slotProps">
      <slot name="footer" v-bind="slotProps" />
    </template>
  </SharedSidebar>
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
      { label: 'Dashboard', to: '/dashboard/eo', icon: 'mdi:view-dashboard-outline' },
      { label: 'My Events', to: '/dashboard/eo/events', icon: 'mdi:calendar-star-outline' },
      { label: 'Bookings', to: '/dashboard/eo/bookings', icon: 'mdi:calendar-check-outline' },
      { label: 'Invitations', to: '/dashboard/eo/invitations', icon: 'mdi:send-outline' },
      { label: 'Profile', to: '/dashboard/eo/profile', icon: 'mdi:account-circle-outline' },
    ],
    headerTitle: 'CariTalent',
    headerSubtitle: 'EO Workspace',
    headerIcon: 'mdi:music-note-plus',
    headerLink: '/dashboard/eo',
    footerTitle: 'Pro Tips',
    footerContent: 'Gunakan fitur Matchmaking untuk menemukan talent terbaik yang sesuai budget dan genre event kamu.',
  },
);

const emit = defineEmits<{
  navigate: [];
}>();

const eoLinks = computed(() => props.links);

const eoSidebarClass = computed(
  () => 'flex h-full w-72 flex-col border-r border-white/10 bg-ui-dark/70 px-4 py-5 backdrop-blur-xl',
);

const eoHeaderIconClasses = computed(
  () => 'flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-fuchsia-400 shadow-lg shadow-violet-500/25',
);

const eoActiveItemClass = computed(
  () => 'bg-gradient-to-r from-violet-500/20 to-fuchsia-500/15 border border-violet-500/30 text-ui-light shadow-sm font-medium',
);

const eoInactiveItemClass = computed(() => 'text-neutral-light/80 hover:bg-white/8 hover:text-ui-light');

const eoFooterClass = computed(() => 'mt-auto rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 backdrop-blur-sm');
const eoFooterTitleClass = computed(() => 'text-fuchsia-400');
const eoFooterContentClass = computed(() => 'text-neutral-light/80');
</script>
