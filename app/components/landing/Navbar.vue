<template>
  <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300" :class="isScrolled || isMenuOpen ? 'bg-neutral-dark/55 backdrop-blur-xl border-b border-white/10 shadow-nav' : 'bg-transparent border-b border-transparent'">
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
        <NuxtLink to="/auth/register" class="hidden md:block text-sm px-5 py-2 rounded-full bg-highlight hover:bg-purple-700 text-white font-medium transition-all duration-200 shadow-glow-sm">Daftar Gratis</NuxtLink>

        <!-- Hamburger button (mobile only, right side) -->
        <button @click="isMenuOpen = !isMenuOpen" class="md:hidden relative z-50 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-highlight/50 transition-colors duration-200" aria-label="Toggle navigation">
          <div class="hamburger-icon" :class="{ 'is-open': isMenuOpen }">
            <span class="hamburger-line line-1"></span>
            <span class="hamburger-line line-2"></span>
            <span class="hamburger-line line-3"></span>
          </div>
        </button>
      </div>
    </div>

    <Transition name="mobile-backdrop">
      <div v-if="isMenuOpen" class="pointer-events-none fixed inset-0 top-[72px] z-30 bg-neutral-dark/35 backdrop-blur-xl md:hidden"></div>
    </Transition>

    <!-- Mobile menu dropdown (blurry background) -->
    <Transition name="mobile-menu">
      <div v-if="isMenuOpen" class="md:hidden absolute left-0 right-0 top-full bg-neutral-dark/70 backdrop-blur-2xl border-b border-white/10 z-40 shadow-2xl">
        <div class="flex flex-col items-center py-6 space-y-4 px-6">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="text-base font-display font-semibold text-ui-light/80 hover:text-ui-light transition-colors duration-200 tracking-wide py-1"
            @click="isMenuOpen = false"
          >
            {{ link.label }}
          </NuxtLink>
          <div class="w-12 h-px bg-white/10"></div>
          <NuxtLink to="/auth/login" class="text-sm text-neutral-medium hover:text-ui-light transition-colors py-1" @click="isMenuOpen = false">Masuk</NuxtLink>
          <NuxtLink to="/auth/register" class="text-sm px-6 py-2.5 rounded-full bg-highlight hover:bg-purple-700 text-white font-medium transition-all duration-200 shadow-glow-sm" @click="isMenuOpen = false">Daftar Gratis</NuxtLink>
        </div>
      </div>
    </Transition>
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
      { label: 'Tim Kami', to: '/#tim-kami' },
    ],
  },
);

const isScrolled = ref(false);
const isMenuOpen = ref(false);

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

/* ── Animated hamburger icon ── */
.hamburger-icon {
  width: 24px;
  height: 18px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hamburger-line {
  display: block;
  width: 100%;
  height: 2px;
  background: white;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.hamburger-icon.is-open .line-1 {
  transform: translateY(8px) rotate(45deg);
}

.hamburger-icon.is-open .line-2 {
  opacity: 0;
  transform: scaleX(0);
}

.hamburger-icon.is-open .line-3 {
  transform: translateY(-8px) rotate(-45deg);
}

/* ── Mobile menu transitions ── */
.mobile-menu-enter-active {
  transition: opacity 0.3s ease;
}
.mobile-menu-leave-active {
  transition: opacity 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-backdrop-enter-active,
.mobile-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.mobile-backdrop-enter-from,
.mobile-backdrop-leave-to {
  opacity: 0;
}
</style>
