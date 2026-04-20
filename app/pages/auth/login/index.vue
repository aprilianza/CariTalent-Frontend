<template>
  <div class="relative min-h-screen overflow-hidden bg-neutral-dark text-ui-light">
    <div class="noise-overlay pointer-events-none fixed inset-0 z-0 opacity-30"></div>
    <div class="grid-bg pointer-events-none absolute inset-0 opacity-10"></div>
    <div class="pointer-events-none absolute -top-28 -right-12 h-96 w-96 rounded-full bg-highlight/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -left-12 h-80 w-80 rounded-full bg-accent/15 blur-3xl"></div>

    <div class="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl items-center gap-10 px-6 py-12 lg:grid-cols-2">
      <section class="order-2 space-y-6 lg:order-1">
        <NuxtLink to="/" class="inline-flex items-center gap-2 text-sm text-neutral-light/80 transition-colors hover:text-white">
          <Icon name="mdi:arrow-left" class="h-4 w-4" />
          Kembali ke Landing Page
        </NuxtLink>

        <div class="space-y-4">
          <span class="inline-flex items-center gap-2 rounded-full border border-highlight/30 bg-highlight/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent"> Area CariTalent </span>
          <h1 class="font-display text-4xl font-black leading-tight md:text-6xl">
            Masuk dan
            <span class="hero-gradient-text">Kelola Panggungmu</span>
          </h1>
          <p class="max-w-xl text-base leading-relaxed text-neutral-light/75 md:text-lg">Login untuk melanjutkan proses booking, memantau lamaran, dan menemukan peluang perform terbaikmu di CariTalent.</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <div v-for="feature in sideFeatures" :key="feature.title" class="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
            <Icon :name="feature.icon" class="mb-3 h-6 w-6 text-accent" />
            <p class="text-sm font-semibold text-white">{{ feature.title }}</p>
            <p class="mt-1 text-xs text-neutral-light/70">{{ feature.desc }}</p>
          </div>
        </div>
      </section>

      <section class="order-1 lg:order-2">
        <UCard class="auth-card mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-2 shadow-glow-sm backdrop-blur-xl">
          <template #header>
            <div class="space-y-2 px-3 pt-2 text-center">
              <h2 class="font-display text-3xl font-black text-white">Login Akun</h2>
              <p class="text-sm text-neutral-light/70">Akses dashboard talent atau event organizer.</p>
            </div>
          </template>

          <form class="space-y-4 px-3 pb-3" @submit.prevent="onSubmit">
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

            <UFormField label="Password" required>
              <UInput
                v-model="password"
                type="password"
                size="xl"
                placeholder="Masukkan password"
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

            <UButton type="submit" color="primary" size="xl" block class="!mt-2 !justify-center !rounded-xl !py-3 text-sm font-semibold !bg-gradient-to-r !from-accent !to-highlight hover:!opacity-90" variant="solid">
              Masuk Sekarang
            </UButton>
          </form>

          <template #footer>
            <p class="px-3 pb-3 pt-1 text-center text-sm text-neutral-light/70">
              Belum punya akun?
              <NuxtLink to="/auth/register" class="font-semibold text-highlight transition-colors hover:text-purple-300">Daftar di sini</NuxtLink>
            </p>
          </template>
        </UCard>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const email = ref('');
const password = ref('');
const rememberMe = ref(false);

const sideFeatures = [
  {
    title: 'Booking Cepat',
    desc: 'Kelola undangan dan jadwal event dalam satu tempat.',
    icon: 'mdi:calendar-check',
  },
  {
    title: 'Status Real-time',
    desc: 'Pantau progres lamaran tanpa harus refresh manual.',
    icon: 'mdi:lightning-bolt',
  },
  {
    title: 'Profil Verified',
    desc: 'Akun terverifikasi membantu tingkatkan kepercayaan klien.',
    icon: 'mdi:shield-check',
  },
];

const onSubmit = () => {
  console.log('Login submitted', {
    email: email.value,
    rememberMe: rememberMe.value,
  });
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
