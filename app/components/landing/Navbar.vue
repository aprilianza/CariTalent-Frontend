<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300" :class="isScrolled ? 'bg-neutral-dark/55 backdrop-blur-xl border-b border-white/10 shadow-nav' : 'bg-transparent border-b border-transparent'">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <NuxtLink to="/" class="flex items-center gap-3">
        <img :src="logoImage" alt="Logo CariTalent" class="w-10 h-10 rounded-lg object-contain" />
        <span class="font-display text-xl font-bold tracking-tight text-ui-light"> Cari<span class="text-highlight">Talent</span> </span>
      </NuxtLink>

      <div class="hidden md:flex items-center gap-8">
        <NuxtLink v-for="link in navLinks" :key="link.to" :to="link.to" class="text-sm text-neutral-medium hover:text-ui-light transition-colors duration-200 tracking-wide">
          {{ link.label }}
        </NuxtLink>
      </div>

      <div class="flex items-center gap-3">
        <NuxtLink to="/auth/login" class="hidden md:block text-sm px-4 py-2 text-neutral-medium hover:text-ui-light transition-colors">Masuk</NuxtLink>
        <NuxtLink to="/auth/register" class="text-sm px-5 py-2 rounded-full bg-highlight hover:bg-purple-700 text-white font-medium transition-all duration-200 shadow-glow-sm">Daftar Gratis</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import logoImage from '~/assets/logo.png';

type NavItem = {
  label: string;
  to: string;
};

withDefaults(
  defineProps<{
    navLinks?: NavItem[];
  }>(),
  {
    navLinks: () => [
      { label: 'Fitur', to: '/#fitur' },
      { label: 'Untuk Talent', to: '/#talent' },
      { label: 'Untuk EO', to: '/#eo' },
      { label: 'Tentang Kami', to: '/#tentang' },
    ],
  },
);

const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 16;
};

onMounted(() => {
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.font-display {
  font-family: 'Syne', sans-serif;
}

.shadow-glow-sm {
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.25);
}

.shadow-nav {
  box-shadow: 0 10px 25px rgba(17, 24, 39, 0.28);
}
</style>
