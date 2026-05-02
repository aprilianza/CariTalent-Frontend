<template>
  <div class="relative h-screen overflow-hidden bg-neutral-dark text-ui-light">
    <div class="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-30" />
    <div class="grid-bg pointer-events-none absolute inset-0 z-0 opacity-10" />
    <div class="pointer-events-none absolute -top-24 -right-12 z-0 h-96 w-96 rounded-full bg-highlight/20 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-20 -left-10 z-0 h-80 w-80 rounded-full bg-accent/15 blur-3xl" />

    <div class="relative z-10 flex h-full">
      <div :class="desktopSidebarClasses">
        <TalentSidebar @navigate="handleSidebarNavigate" @logout="openLogoutModal" />
      </div>

      <UDrawer v-model:open="isSidebarOpen" side="left" :ui="{ content: 'max-w-72' }" @update:open="onDrawerOpenChange">
        <template #content>
          <TalentSidebar @navigate="handleSidebarNavigate" @logout="openLogoutModal" />
        </template>
      </UDrawer>

      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <TalentNavbar :title="pageTitle" :subtitle="todayLabel" :notifications="notificationCount" :user-name="userName" user-role="Talent" :menu-button-icon="menuButtonIcon" @toggle-sidebar="handleToggleSidebar" />

        <main class="flex-1 min-h-0 overflow-y-auto px-4 py-6 sm:px-6">
          <slot />
        </main>
      </div>
    </div>

    <UModal
      v-model:open="isLogoutModalOpen"
      :ui="{
        content: 'w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-neutral-dark/95 p-0 shadow-2xl ring-0 backdrop-blur-xl',
      }"
    >
      <template #content>
        <div class="overflow-hidden rounded-[28px]">
          <div class="border-b border-white/10 bg-white/[0.03] px-5 py-5">
            <div class="flex items-start gap-4">
              <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-error/30 bg-error/10 text-error shadow-lg shadow-error/10">
                <Icon name="mdi:logout" class="h-6 w-6" />
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold uppercase tracking-wide text-neutral-light/60">Konfirmasi Logout</p>
                <h3 class="mt-2 font-display text-xl font-bold text-ui-light">Keluar dari akun?</h3>
                <p class="mt-1 text-sm leading-relaxed text-neutral-light/70">Kamu akan diarahkan ke halaman login dan perlu masuk lagi untuk mengakses Talent Dashboard.</p>
              </div>
            </div>
          </div>

          <div class="flex flex-col-reverse gap-3 bg-white/[0.02] px-5 py-4 sm:flex-row sm:justify-end">
            <UButton color="neutral" variant="soft" class="justify-center rounded-xl" :disabled="isLoggingOut" @click="closeLogoutModal">Batal</UButton>
            <UButton color="error" class="justify-center rounded-xl" icon="mdi:logout" :loading="isLoggingOut" @click="confirmLogout">Logout</UButton>
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';

const isSidebarOpen = ref(false);
const isDesktopSidebarCollapsed = ref(false);
const isDesktop = ref(false);
const isLogoutModalOpen = ref(false);
const isLoggingOut = ref(false);
let mediaQuery: MediaQueryList | null = null;
let updateDeviceState: (() => void) | null = null;
const userName = useState('talent-layout-username', () => 'The Broken Strings');
const pageTitle = useState('talent-layout-title', () => 'Talent Dashboard');
const notificationCount = ref(3);
const { logout } = useAuth();

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

const openLogoutModal = () => {
  isSidebarOpen.value = false;
  isLogoutModalOpen.value = true;
};

const closeLogoutModal = () => {
  if (isLoggingOut.value) {
    return;
  }

  isLogoutModalOpen.value = false;
};

const confirmLogout = async () => {
  if (isLoggingOut.value) {
    return;
  }

  isLoggingOut.value = true;

  try {
    await logout();

    userName.value = '';
    notificationCount.value = 0;
    isLogoutModalOpen.value = false;

    await navigateTo('/auth/login');
  } finally {
    isLoggingOut.value = false;
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
