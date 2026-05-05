<template>
  <div class="space-y-6">
    <!-- Page header -->
    <UiCard card-class="border-white/10 bg-gradient-to-br from-violet-500/12 via-white/5 to-fuchsia-500/12">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
        <!-- Avatar placeholder -->
        <div class="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-500/30 bg-violet-500/15 text-fuchsia-400 shadow-lg shadow-violet-500/20">
          <Icon name="mdi:domain" class="h-8 w-8" />
        </div>

        <div>
          <h1 class="font-display text-2xl font-bold bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
            Profil EO
          </h1>
          <p class="mt-1 text-sm text-neutral-light/70">Kelola informasi akun dan keamanan kamu.</p>
        </div>
      </div>
    </UiCard>

    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Edit Profile Card -->
      <UiCard title="Informasi Akun" description="Perbarui nama dan nomor telepon kamu">
        <!-- View Mode -->
        <div v-if="!isEditingProfile" class="space-y-6">
          <div class="grid gap-5 sm:grid-cols-2">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium text-neutral-light/60 uppercase tracking-wider">Nama</span>
              <span class="text-base text-ui-light font-medium">{{ originalProfile.name }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <span class="text-xs font-medium text-neutral-light/60 uppercase tracking-wider">Email</span>
              <span class="text-base text-ui-light font-medium">eo@kafekota.com</span>
            </div>
            <div class="flex flex-col gap-1 sm:col-span-2">
              <span class="text-xs font-medium text-neutral-light/60 uppercase tracking-wider">Nomor Telepon</span>
              <span class="text-base text-ui-light font-medium">{{ originalProfile.phone || '-' }}</span>
            </div>
          </div>
          <div class="pt-4 border-t border-white/5">
            <UiButton color="primary" variant="soft" icon="mdi:pencil-outline" class="bg-violet-500/10 hover:bg-violet-500/20 text-violet-300" @click="isEditingProfile = true">
              Edit Profil
            </UiButton>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else class="space-y-5" @submit.prevent="handleUpdateProfile">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-neutral-light">Nama <span class="text-error">*</span></label>
            <UInput
              v-model="profileForm.name"
              placeholder="Nama EO kamu"
              :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-neutral-light">Email</label>
            <UInput
              value="eo@kafekota.com"
              disabled
              placeholder="email@domain.com"
              :ui="{ base: 'w-full rounded-xl border border-white/5 bg-white/4 text-neutral-light/40 cursor-not-allowed' }"
            />
            <p class="text-xs text-neutral-light/40">Email tidak dapat diubah.</p>
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-neutral-light">Nomor Telepon</label>
            <UInput
              v-model="profileForm.phone"
              placeholder="081234567890"
              :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-all' }"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-white/5">
            <UiButton color="neutral" variant="ghost" type="button" class="hover:bg-white/5" @click="cancelEditProfile">Batal</UiButton>
            <UiButton
              type="submit"
              color="primary"
              variant="soft"
              icon="mdi:content-save-outline"
              :loading="savingProfile"
              :disabled="!profileChanged"
              class="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400 text-white shadow-lg shadow-violet-500/25 border-0"
            >
              Simpan Perubahan
            </UiButton>
          </div>
        </form>
      </UiCard>

      <!-- Change Password Card -->
      <UiCard title="Keamanan Akun" description="Ubah password untuk menjaga keamanan akun kamu">
        <!-- View Mode -->
        <div v-if="!isEditingPassword" class="space-y-6">
          <div class="flex flex-col gap-1">
            <span class="text-xs font-medium text-neutral-light/60 uppercase tracking-wider">Password Saat Ini</span>
            <span class="text-2xl text-ui-light font-bold tracking-[0.3em] mt-1">••••••••</span>
          </div>
          <div class="pt-4 border-t border-white/5">
            <UiButton color="secondary" variant="soft" icon="mdi:lock-reset" class="bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300" @click="isEditingPassword = true">
              Ubah Password
            </UiButton>
          </div>
        </div>

        <!-- Edit Mode -->
        <form v-else class="space-y-5" @submit.prevent="handleChangePassword">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-neutral-light">Password Saat Ini <span class="text-error">*</span></label>
            <UInput
              v-model="passwordForm.current_password"
              type="password"
              placeholder="Password lama"
              :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all' }"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-neutral-light">Password Baru <span class="text-error">*</span></label>
            <UInput
              v-model="passwordForm.new_password"
              type="password"
              placeholder="Min. 8 karakter"
              :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all' }"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-sm font-semibold text-neutral-light">Konfirmasi Password Baru <span class="text-error">*</span></label>
            <UInput
              v-model="passwordForm.new_password_confirmation"
              type="password"
              placeholder="Ulangi password baru"
              :ui="{ base: 'w-full rounded-xl border border-white/10 bg-white/5 text-neutral-light focus:border-error/50 focus:ring-1 focus:ring-error/50 transition-all' }"
            />
            <p v-if="passwordMismatch" class="text-xs text-error mt-1">Password konfirmasi tidak cocok.</p>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-white/5">
            <UiButton color="neutral" variant="ghost" type="button" class="hover:bg-white/5" @click="cancelEditPassword">Batal</UiButton>
            <UiButton
              type="submit"
              color="secondary"
              variant="soft"
              icon="mdi:check-circle-outline"
              :loading="savingPassword"
              :disabled="!isPasswordFormValid"
              class="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-400 hover:to-blue-400 text-white shadow-lg shadow-indigo-500/25 border-0"
            >
              Ganti Password
            </UiButton>
          </div>
        </form>
      </UiCard>

      <!-- Account Info Card -->
      <UiCard title="Info Platform" description="Detail akun dan statistik EO kamu" card-class="lg:col-span-2">
        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div
            v-for="info in accountInfo"
            :key="info.label"
            class="rounded-xl border border-white/10 bg-white/5 p-4"
          >
            <div class="flex items-center gap-2 mb-2">
              <Icon :name="info.icon" class="h-5 w-5 text-fuchsia-400" />
              <p class="text-xs font-medium text-neutral-light/60 uppercase tracking-wide">{{ info.label }}</p>
            </div>
            <p class="text-lg font-bold text-ui-light">{{ info.value }}</p>
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useEoEvents } from '~/composables/useEoEvents';
import { useEoBookings } from '~/composables/useEoBookings';

definePageMeta({
  layout: 'eo',
});

const pageTitle = useState('eo-layout-title');
pageTitle.value = 'Profile';

const toast = useToast();
const { data: events } = useEoEvents();
const { data: bookings } = useEoBookings();

// Profile state
const isEditingProfile = ref(false);

// Profile form
const profileForm = reactive({
  name: 'Kafe Kota',
  phone: '081234567890',
});

const originalProfile = { name: 'Kafe Kota', phone: '081234567890' };
const savingProfile = ref(false);

const profileChanged = computed(
  () => profileForm.name !== originalProfile.name || profileForm.phone !== originalProfile.phone,
);

const cancelEditProfile = () => {
  profileForm.name = originalProfile.name;
  profileForm.phone = originalProfile.phone;
  isEditingProfile.value = false;
};

const handleUpdateProfile = async () => {
  if (!profileForm.name.trim()) return;
  savingProfile.value = true;

  await new Promise((resolve) => setTimeout(resolve, 700));

  savingProfile.value = false;
  originalProfile.name = profileForm.name;
  originalProfile.phone = profileForm.phone;

  // Update layout username
  const userName = useState('eo-layout-username');
  userName.value = profileForm.name;

  isEditingProfile.value = false;
};

// Password state
const isEditingPassword = ref(false);

// Password form
const passwordForm = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: '',
});

const savingPassword = ref(false);

const passwordMismatch = computed(
  () =>
    passwordForm.new_password_confirmation !== '' &&
    passwordForm.new_password !== passwordForm.new_password_confirmation,
);

const isPasswordFormValid = computed(
  () =>
    passwordForm.current_password.trim() !== '' &&
    passwordForm.new_password.length >= 8 &&
    passwordForm.new_password === passwordForm.new_password_confirmation,
);

const cancelEditPassword = () => {
  passwordForm.current_password = '';
  passwordForm.new_password = '';
  passwordForm.new_password_confirmation = '';
  isEditingPassword.value = false;
};

const handleChangePassword = async () => {
  if (!isPasswordFormValid.value) return;
  savingPassword.value = true;

  await new Promise((resolve) => setTimeout(resolve, 800));

  savingPassword.value = false;
  passwordForm.current_password = '';
  passwordForm.new_password = '';
  passwordForm.new_password_confirmation = '';

  isEditingPassword.value = false;
};

// Account info
const accountInfo = computed(() => [
  {
    label: 'Role',
    value: 'Event Organizer',
    icon: 'mdi:domain',
  },
  {
    label: 'Total Events',
    value: events.value.length,
    icon: 'mdi:calendar-star-outline',
  },
  {
    label: 'Total Bookings',
    value: bookings.value.length,
    icon: 'mdi:handshake-outline',
  },
  {
    label: 'Member Sejak',
    value: '2026',
    icon: 'mdi:calendar-account-outline',
  },
]);
</script>
