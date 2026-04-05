<template>
  <div class="relative h-screen overflow-hidden bg-neutral-dark text-ui-light">
    <div class="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-30" />
    <div class="grid-bg pointer-events-none absolute inset-0 z-0 opacity-10" />
    <div class="pointer-events-none absolute -top-24 -right-12 z-0 h-96 w-96 rounded-full bg-highlight/20 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-20 -left-10 z-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

    <div class="relative z-10 flex h-full">
      <div :class="desktopSidebarClasses">
        <TalentSidebar @navigate="handleSidebarNavigate" />
      </div>

      <UDrawer v-model:open="isSidebarOpen" side="left" :ui="{ content: 'max-w-72' }" @update:open="onDrawerOpenChange">
        <template #content>
          <TalentSidebar @navigate="handleSidebarNavigate" />
        </template>
      </UDrawer>

      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TalentNavbar :title="pageTitle" :subtitle="todayLabel" :notifications="notificationCount" :user-name="userName" user-role="Talent" :menu-button-icon="menuButtonIcon" @toggle-sidebar="handleToggleSidebar" />

        <main class="flex-1 min-h-0 overflow-y-auto px-4 py-6 sm:px-6">
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const isSidebarOpen = ref(false);
const isDesktopSidebarCollapsed = ref(false);
const isDesktop = ref(false);
let mediaQuery: MediaQueryList | null = null;
let updateDeviceState: (() => void) | null = null;
const userName = useState('talent-layout-username', () => 'The Broken Strings');
const pageTitle = useState('talent-layout-title', () => 'Talent Dashboard');
const notificationCount = ref(3);

const desktopSidebarClasses = computed(() => {
  if (isDesktopSidebarCollapsed.value) {
    return 'hidden';
  }

  return 'hidden h-full shrink-0 lg:block';
});

const menuButtonIcon = computed(() => {
  if (isDesktop.value) {
    return isDesktopSidebarCollapsed.value ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close';
  }

  return 'i-lucide-menu';
});

const handleToggleSidebar = () => {
  if (isDesktop.value) {
    isDesktopSidebarCollapsed.value = !isDesktopSidebarCollapsed.value;
    return;
  }

  isSidebarOpen.value = !isSidebarOpen.value;
};

const handleSidebarNavigate = () => {
  if (!isDesktop.value) {
    isSidebarOpen.value = false;
  }
};

const onDrawerOpenChange = (value: boolean) => {
  isSidebarOpen.value = value;
};

onMounted(() => {
  const mq = window.matchMedia('(min-width: 1024px)');
  mediaQuery = mq;

  updateDeviceState = () => {
    isDesktop.value = mq.matches;

    if (isDesktop.value) {
      isSidebarOpen.value = false;
    }
  };

  updateDeviceState();
  mq.addEventListener('change', updateDeviceState);
});

onBeforeUnmount(() => {
  if (mediaQuery && updateDeviceState) {
    mediaQuery.removeEventListener('change', updateDeviceState);
  }
});

const todayLabel = computed(() =>
  new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'full',
  }).format(new Date()),
);
</script>
