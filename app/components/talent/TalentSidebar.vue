<template>
  <SharedSidebar
    :links="talentLinks"
    :header-title="headerTitle"
    :header-subtitle="headerSubtitle"
    :header-icon="headerIcon"
    :header-link="headerLink"
    :header-icon-classes="talentHeaderIconClasses"
    :footer-title="footerTitle"
    :footer-content="footerContent"
    :active-item-class="talentActiveItemClass"
    :inactive-item-class="talentInactiveItemClass"
    :sidebar-class="talentSidebarClass"
    :footer-class="talentFooterClass"
    :footer-title-class="talentFooterTitleClass"
    :footer-content-class="talentFooterContentClass"
    @navigate="emit('navigate')"
    @logout="emit('logout')"
  >
    <!-- Slots can be overridden if needed -->
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
      { label: 'Dashboard', to: '/dashboard/talent', icon: 'mdi:view-dashboard-outline' },
      { label: 'Events', to: '/dashboard/talent/events', icon: 'mdi:calendar-search-outline' },
      { label: 'Applications', to: '/dashboard/talent/applications', icon: 'mdi:file-document-outline' },
      { label: 'Invitations', to: '/dashboard/talent/invitations', icon: 'mdi:email-fast-outline' },
      { label: 'Bookings', to: '/dashboard/talent/bookings', icon: 'mdi:calendar-check-outline' },
      { label: 'Reviews', to: '/dashboard/talent/reviews', icon: 'mdi:star-outline' },
      { label: 'Profile', to: '/dashboard/talent/profile', icon: 'mdi:account-circle-outline' },
    ],
    headerTitle: 'CariTalent',
    headerSubtitle: 'Talent Workspace',
    headerIcon: 'mdi:music-circle',
    headerLink: '/dashboard/talent',
    footerTitle: 'Pro Tips',
    footerContent: 'Perbarui portfolio setiap minggu untuk meningkatkan peluang diterima organizer.',
  },
);

const emit = defineEmits<{
  navigate: [];
  logout: [];
}>();

// Talent-specific styling
const talentLinks = computed(() => props.links);

const talentSidebarClass = computed(() => 'flex h-full w-72 flex-col border-r border-white/10 bg-ui-dark/70 px-4 py-5 backdrop-blur-xl');

const talentHeaderIconClasses = computed(() => 'flex h-10 w-10 items-center justify-center rounded-xl border border-highlight/30 bg-highlight/10 text-accent shadow-lg shadow-highlight/25');

const talentActiveItemClass = computed(() => 'bg-gradient-to-r from-highlight/20 to-accent/15 border border-highlight/30 text-ui-light shadow-sm font-medium');

const talentInactiveItemClass = computed(() => 'text-neutral-light/80 hover:bg-white/8 hover:text-ui-light');

const talentFooterClass = computed(() => 'mt-auto rounded-2xl border border-highlight/30 bg-highlight/10 p-4 backdrop-blur-sm');
const talentFooterTitleClass = computed(() => 'text-accent');
const talentFooterContentClass = computed(() => 'text-neutral-light/80');
</script>
