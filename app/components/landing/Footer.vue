<template>
  <footer id="tentang" class="border-t border-white/8 px-6 py-12 scroll-mt-28">
    <div class="max-w-6xl mx-auto flex flex-col items-center text-center">
      <NuxtLink to="/" class="flex items-center gap-3 mb-4">
        <img :src="logoImage" alt="Logo CariTalent" class="w-8 h-8 rounded-lg object-contain" />
        <span class="font-display text-xl font-bold text-ui-light">Cari<span class="text-highlight">Talent</span></span>
      </NuxtLink>
      <p class="text-neutral-medium text-sm max-w-md leading-relaxed mb-10">Platform direktori dan booking talenta musik independen Indonesia.</p>

      <div class="w-full border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-neutral-medium text-xs">© 2026 CariTalent. Dikembangkan oleh Kelompok 5 – Universitas Telkom.</p>
        <p class="text-neutral-medium text-xs">CAK3HAB4 · Aplikasi Berbasis Platform</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoImage from '~/assets/logo.png';
</script>

<style scoped>
.font-display {
  font-family: 'Syne', sans-serif;
}
</style>
