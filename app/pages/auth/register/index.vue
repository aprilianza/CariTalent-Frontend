<template>
  <div class="relative min-h-screen overflow-hidden bg-neutral-dark text-ui-light">
    <div class="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-30"></div>
    <div class="grid-bg pointer-events-none absolute inset-0 opacity-10"></div>
    <div class="pointer-events-none absolute -top-24 -left-10 h-96 w-96 rounded-full bg-highlight/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-accent/15 blur-3xl"></div>

    <div class="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
      <section class="space-y-6">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-neutral-light/80 transition-colors hover:text-white">
          <Icon name="mdi:arrow-left" class="h-4 w-4" />
          Kembali ke Landing Page
        </NuxtLink>

        <div class="space-y-4">
          <span class="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent"> Registrasi CariTalent </span>
          <h1 class="font-display text-4xl font-black leading-tight md:text-6xl">
            Buat Akun,
            <span class="hero-gradient-text">Mulai Kolaborasi</span>
          </h1>
          <p class="max-w-xl text-base leading-relaxed text-neutral-light/75 md:text-lg">Daftar sebagai talent atau event organizer, lengkapi profilmu, lalu temukan partner musik terbaik untuk setiap momen.</p>
        </div>

        <UCard class="rounded-3xl border border-white/10 bg-white/5 p-1 backdrop-blur-sm">
          <div class="grid gap-3 p-4 sm:grid-cols-3">
            <div v-for="metric in metrics" :key="metric.label" class="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
              <p class="font-display text-2xl font-black text-white">{{ metric.value }}</p>
              <p class="mt-1 text-xs uppercase tracking-wider text-neutral-light/70">{{ metric.label }}</p>
            </div>
          </div>
        </UCard>
      </section>

      <section>
        <UCard class="auth-card mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-2 shadow-glow-sm backdrop-blur-xl">
          <template #header>
            <div class="space-y-2 px-3 pt-2 text-center">
              <h2 class="font-display text-3xl font-black text-white">Buat Akun Baru</h2>
              <p class="text-sm text-neutral-light/70">Lengkapi data berikut untuk mulai menggunakan platform.</p>
            </div>
          </template>

          <form class="space-y-4 px-3 pb-3" @submit.prevent="onSubmit">
            <!-- Nama & Role -->
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Nama Lengkap" required>
                <UInput
                  v-model="fullName"
                  size="xl"
                  placeholder="Contoh: Rizky Saputra"
                  class="w-full"
                  :ui="{
                    base: `
            !bg-white/5 !border-white/10 !text-white
            placeholder-neutral-light/50
            focus:!border-accent focus:!ring-accent
          `,
                  }"
                />
              </UFormField>

              <UFormField label="Peran" required>
                <USelect
                  v-model="role"
                  :items="roles"
                  size="xl"
                  placeholder="Pilih peran"
                  class="w-full"
                  :ui="{
                    base: `
            !bg-white/5 !border-white/10 !text-white
            focus:!border-accent focus:!ring-accent
          `,
                  }"
                />
              </UFormField>
            </div>

            <!-- Email & Phone -->
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Email" required>
                <UInput
                  v-model="email"
                  type="email"
                  size="xl"
                  placeholder="nama@email.com"
                  class="w-full"
                  :ui="{
                    base: `
            !bg-white/5 !border-white/10 !text-white
            placeholder-neutral-light/50
            focus:!border-accent focus:!ring-accent
          `,
                  }"
                />
              </UFormField>

              <UFormField label="Nomor WhatsApp" required>
                <UInput
                  v-model="phone"
                  type="tel"
                  size="xl"
                  placeholder="08xxxxxxxxxx"
                  class="w-full"
                  :ui="{
                    base: `
            !bg-white/5 !border-white/10 !text-white
            placeholder-neutral-light/50
            focus:!border-accent focus:!ring-accent
          `,
                  }"
                />
              </UFormField>
            </div>

            <!-- Password -->
            <div class="grid gap-4 sm:grid-cols-2">
              <UFormField label="Password" required>
                <UInput
                  v-model="password"
                  type="password"
                  size="xl"
                  placeholder="Minimal 8 karakter"
                  class="w-full"
                  :ui="{
                    base: `
            !bg-white/5 !border-white/10 !text-white
            placeholder-neutral-light/50
            focus:!border-accent focus:!ring-accent
          `,
                  }"
                />
              </UFormField>

              <UFormField label="Konfirmasi Password" required>
                <UInput
                  v-model="confirmPassword"
                  type="password"
                  size="xl"
                  placeholder="Ulangi password"
                  class="w-full"
                  :ui="{
                    base: `
            !bg-white/5 !border-white/10 !text-white
            placeholder-neutral-light/50
            focus:!border-accent focus:!ring-accent
          `,
                  }"
                />
              </UFormField>
            </div>

            <!-- Button -->
            <UButton type="submit" size="xl" block :loading="isSubmitting" class="!justify-center !rounded-xl !py-3 text-sm font-semibold !bg-gradient-to-r !from-accent !to-highlight hover:!opacity-90"> Daftar Sekarang </UButton>

            <p class="text-center text-xs leading-relaxed text-neutral-light/60">Dengan mendaftar, kamu setuju menerima notifikasi terkait event, update akun, dan informasi penting platform.</p>
          </form>
          <template #footer>
            <p class="px-3 pb-3 pt-1 text-center text-sm text-neutral-light/70">
              Sudah punya akun?
              <NuxtLink to="/auth/login" class="font-semibold text-highlight transition-colors hover:text-purple-300">Masuk di sini</NuxtLink>
            </p>
          </template>
        </UCard>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth';
const roles = ['Talent / Musisi', 'Event Organizer'];

const fullName = ref('');
const role = ref('');
const email = ref('');
const phone = ref('');
const password = ref('');
const confirmPassword = ref('');
const isSubmitting = ref(false);

const toast = useToast();
const { register } = useAuth();

const metrics = [
  { value: '2.400+', label: 'Talent Aktif' },
  { value: '890+', label: 'Event Terbuka' },
  { value: '12rb+', label: 'Booking Sukses' },
];

const getRegisterErrorMessage = (error: any) => {
  const validationErrors = error?.errors;

  if (validationErrors && typeof validationErrors === 'object') {
    const firstError = Object.values(validationErrors).find((messages) => Array.isArray(messages) && messages.length > 0);

    if (Array.isArray(firstError)) {
      return String(firstError[0]);
    }
  }

  return error?.message || 'Registrasi gagal. Periksa kembali data yang kamu masukkan.';
};

const onSubmit = async () => {
  if (isSubmitting.value) {
    return;
  }

  if (!fullName.value || !role.value || !email.value || !phone.value || !password.value) {
    toast.add({
      title: 'Lengkapi data',
      description: 'Semua field wajib diisi sebelum mendaftar.',
      color: 'warning',
    });
    return;
  }

  if (password.value !== confirmPassword.value) {
    toast.add({
      title: 'Password tidak cocok',
      description: 'Pastikan password dan konfirmasi password sama.',
      color: 'error',
    });
    return;
  }

  const roleValue = role.value === 'Event Organizer' ? 'eo' : 'talent';

  isSubmitting.value = true;
  try {
    const response = await register({
      name: fullName.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      password_confirmation: confirmPassword.value,
      role: roleValue,
    });

    toast.add({
      title: 'Registrasi berhasil',
      description: `Selamat datang, ${response.data.user.name}.`,
      color: 'success',
    });

    fullName.value = '';
    role.value = '';
    email.value = '';
    phone.value = '';
    password.value = '';
    confirmPassword.value = '';

    const target = roleValue === 'eo' ? '/dashboard/eo' : '/dashboard/talent';
    await navigateTo(target);
  } catch (error: any) {
    const message = getRegisterErrorMessage(error);
    toast.add({
      title: 'Registrasi gagal',
      description: message,
      color: 'error',
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
* {
  font-family: 'DM Sans', sans-serif;
}

.font-display {
  font-family: 'Syne', sans-serif;
}

.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px;
}

.grid-bg {
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

.hero-gradient-text {
  background: linear-gradient(135deg, #8a2be2 0%, #00bfff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.shadow-glow-sm {
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.25);
}

:deep(.auth-card) {
  background: linear-gradient(170deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.03));
}
</style>
