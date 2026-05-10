<template>
  <div class="relative h-screen overflow-hidden bg-neutral-dark text-ui-light">
    <div class="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-30" />
    <div class="grid-bg pointer-events-none absolute inset-0 z-0 opacity-10" />
    <div class="pointer-events-none absolute -top-24 -right-12 z-0 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-20 -left-10 z-0 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />

    <div class="relative z-10 flex h-full">
      <div :class="desktopSidebarClasses">
        <EoSidebar @navigate="handleSidebarNavigate" @logout="promptLogout" />
      </div>

      <UDrawer v-model:open="isSidebarOpen" side="left" :ui="{ content: 'max-w-72' }" @update:open="onDrawerOpenChange">
        <template #content>
          <EoSidebar @navigate="handleSidebarNavigate" @logout="promptLogout" />
        </template>
      </UDrawer>

      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <EoNavbar :title="pageTitle" :subtitle="todayLabel" :notifications="notificationCount" :user-name="userName" user-role="Event Organizer" :menu-button-icon="menuButtonIcon" @toggle-sidebar="handleToggleSidebar" />

        <main class="flex-1 min-h-0 overflow-y-auto px-4 py-6 sm:px-6">
          <slot />
        </main>
      </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <UModal v-model:open="showLogoutModal" :ui="{ content: 'bg-transparent ring-0 shadow-none sm:max-w-md w-full mx-auto' }">
      <template #content>
        <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[#1e1e2e]/95 backdrop-blur-xl p-7 shadow-2xl">
          <!-- Background decoration -->
          <div class="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-error/20 blur-3xl pointer-events-none"></div>
          <div class="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-3xl pointer-events-none"></div>

          <div class="relative z-10 space-y-6">
            <!-- Header -->
            <div class="flex flex-col items-center text-center">
              <div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error ring-8 ring-error/5">
                <Icon name="mdi:logout" class="h-8 w-8" />
              </div>
              <h3 class="text-2xl font-bold bg-gradient-to-r from-error to-fuchsia-400 bg-clip-text text-transparent">Konfirmasi Keluar</h3>
              <p class="mt-2 text-sm text-neutral-light/70">
                Apakah Anda yakin ingin keluar dari akun ini? Anda akan diarahkan ke halaman utama.
              </p>
            </div>

            <!-- Actions -->
            <div class="flex justify-center gap-3 pt-2">
              <UiButton color="neutral" variant="ghost" class="hover:bg-white/5" @click="showLogoutModal = false">Batal</UiButton>
              <UiButton 
                color="error" 
                variant="soft" 
                :loading="isLoggingOut" 
                @click="confirmLogout" 
                class="bg-gradient-to-r from-error to-fuchsia-500 hover:from-red-400 hover:to-fuchsia-400 text-white shadow-lg shadow-error/25 border-0"
              >
                Ya, Keluar
              </UiButton>
            </div>
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
let mediaQuery: MediaQueryList | null = null;
let updateDeviceState: (() => void) | null = null;

const { user, logout } = useAuth();
const userName = useState('eo-layout-username', () => user.value?.name || 'Event Organizer');
const pageTitle = useState('eo-layout-title', () => 'EO Dashboard');
const notificationCount = ref(2);

const showLogoutModal = ref(false);
const isLoggingOut = ref(false);

const promptLogout = () => {
  showLogoutModal.value = true;
};

const confirmLogout = async () => {
  isLoggingOut.value = true;
  await logout('/');
};

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
