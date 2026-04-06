<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-highlight to-accent bg-clip-text text-transparent">
        Manajemen Pengguna
      </h1>
      <p class="mt-1 text-sm text-neutral-light/60">Kelola semua akun talent dan event organizer.</p>
    </div>

    <!-- Filter & Search Bar -->
    <UiCard>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="flex flex-wrap gap-2">
          <UiButton
            v-for="tab in roleTabs"
            :key="tab.value"
            :label="tab.label"
            :variant="roleFilter === tab.value ? 'solid' : 'soft'"
            :color="roleFilter === tab.value ? 'primary' : 'neutral'"
            size="sm"
            @click="roleFilter = tab.value"
          />
        </div>
        <div class="relative">
          <Icon name="mdi:magnify" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-light/40" />
          <input
            v-model="search"
            type="text"
            placeholder="Cari nama / email..."
            class="w-full rounded-xl border border-white/10 bg-white/5 py-2 pl-9 pr-4 text-sm text-ui-light placeholder-neutral-light/40 outline-none transition focus:border-highlight/50 focus:bg-white/8 sm:w-64"
          />
        </div>
      </div>
    </UiCard>

    <!-- User Table -->
    <UiCard :no-padding="true">
      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col items-center justify-center gap-3 py-16">
        <Icon name="mdi:loading" class="h-8 w-8 animate-spin text-highlight" />
        <p class="text-sm text-neutral-light/60">Memuat data pengguna...</p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredUsers.length === 0"
        class="flex flex-col items-center justify-center gap-3 py-16"
      >
        <div class="rounded-2xl border border-white/10 bg-white/5 p-4">
          <Icon name="mdi:account-off-outline" class="h-10 w-10 text-neutral-light/40" />
        </div>
        <p class="text-sm font-medium text-neutral-light/60">Tidak ada pengguna ditemukan.</p>
      </div>

      <!-- List -->
      <ul v-else class="divide-y divide-white/5">
        <li
          v-for="user in filteredUsers"
          :key="user.id"
          class="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-white/4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div class="flex items-center gap-4">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-sm font-bold text-ui-light">
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="text-sm font-semibold text-ui-light">{{ user.name }}</p>
              <p class="text-xs text-neutral-light/60">{{ user.email }}</p>
              <p v-if="user.phone" class="text-xs text-neutral-light/40">{{ user.phone }}</p>
            </div>
          </div>

          <div class="flex items-center justify-between gap-3 sm:justify-end">
            <div class="flex items-center gap-2">
              <UiBadge
                :label="user.role === 'talent' ? 'Talent' : 'Event Organizer'"
                :color="user.role === 'talent' ? 'success' : 'info'"
                variant="soft"
                dot
              />
              <span class="text-xs text-neutral-light/40">
                {{ user.created_at ? formatDate(user.created_at) : '-' }}
              </span>
            </div>
            <UiButton
              icon="mdi:trash-can-outline"
              color="error"
              variant="ghost"
              size="sm"
              @click="confirmDelete(user)"
            />
          </div>
        </li>
      </ul>
    </UiCard>

    <!-- Delete Confirm Modal -->
    <UModal v-model:open="showDeleteModal">
      <template #content>
        <div class="rounded-2xl border border-white/10 bg-neutral-dark p-6 shadow-2xl">
          <div class="flex items-start gap-4">
            <div class="rounded-xl border border-error/30 bg-error/10 p-3 text-error">
              <Icon name="mdi:alert-outline" class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <h3 class="text-base font-bold text-ui-light">Hapus Pengguna?</h3>
              <p class="mt-1 text-sm text-neutral-light/70">
                Akun <span class="font-semibold text-ui-light">{{ userToDelete?.name }}</span> akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>
          <div class="mt-6 flex justify-end gap-3">
            <UiButton label="Batal" color="neutral" variant="soft" @click="showDeleteModal = false" />
            <UiButton label="Hapus" color="error" variant="solid" :loading="deleting" @click="doDelete" />
          </div>
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { AdminUser } from '~/composables/types';
import { useAdminUsers } from '~/composables/useAdminUsers';
import { useFormatters } from '~/composables/useFormatters';

definePageMeta({
  layout: 'admin',
});

const pageTitle = useState('admin-layout-title');
pageTitle.value = 'Manajemen User';

const toast = useToast();
const { users, pending, deleteUser } = useAdminUsers();
const { formatDate } = useFormatters();

const search = ref('');
const roleFilter = ref<'all' | 'talent' | 'eo'>('all');
const showDeleteModal = ref(false);
const userToDelete = ref<AdminUser | null>(null);
const deleting = ref(false);

const roleTabs = [
  { label: 'Semua', value: 'all' as const },
  { label: 'Talent', value: 'talent' as const },
  { label: 'Event Organizer', value: 'eo' as const },
];

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    const matchRole = roleFilter.value === 'all' || u.role === roleFilter.value;
    const matchSearch =
      !search.value ||
      u.name.toLowerCase().includes(search.value.toLowerCase()) ||
      u.email.toLowerCase().includes(search.value.toLowerCase());
    return matchRole && matchSearch;
  });
});

const confirmDelete = (user: AdminUser) => {
  userToDelete.value = user;
  showDeleteModal.value = true;
};

const doDelete = async () => {
  if (!userToDelete.value) return;
  deleting.value = true;

  await new Promise((r) => setTimeout(r, 600));

  deleteUser(userToDelete.value.id);
  toast.add({
    title: 'Pengguna dihapus',
    description: `Akun "${userToDelete.value.name}" berhasil dihapus.`,
    color: 'error',
  });

  deleting.value = false;
  showDeleteModal.value = false;
  userToDelete.value = null;
};
</script>
