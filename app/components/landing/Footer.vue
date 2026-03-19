<template>
  <footer id="tentang" class="border-t border-white/8 px-6 py-12 scroll-mt-28">
    <div class="max-w-6xl mx-auto">
      <div class="flex flex-col md:flex-row items-start justify-between gap-8">
        <div class="max-w-xs">
          <NuxtLink to="/" class="flex items-center gap-3 mb-4">
            <img :src="logoImage" alt="Logo CariTalent" class="w-8 h-8 rounded-lg object-contain" />
            <span class="font-display text-xl font-bold text-ui-light">Cari<span class="text-highlight">Talent</span></span>
          </NuxtLink>
          <p class="text-neutral-medium text-sm leading-relaxed">Platform direktori dan booking talenta musik independen Indonesia.</p>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-8 text-sm">
          <div v-for="col in footerLinks" :key="col.title">
            <div class="font-semibold text-ui-light mb-3">{{ col.title }}</div>
            <ul class="space-y-2">
              <li v-for="link in col.links" :key="link.to">
                <NuxtLink :to="link.to" class="text-neutral-medium hover:text-ui-light transition-colors">{{ link.label }}</NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="border-t border-white/8 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-neutral-medium text-xs">© 2026 CariTalent. Dikembangkan oleh Kelompok 5 – Universitas Telkom.</p>
        <p class="text-neutral-medium text-xs">CAK3HAB4 · Aplikasi Berbasis Platform</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import logoImage from '~/assets/logo.png';

type FooterItem = {
  label: string;
  to: string;
};

type FooterColumn = {
  title: string;
  links: FooterItem[];
};

const footerLinks: FooterColumn[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Fitur', to: '/#fitur' },
      { label: 'Cara Kerja', to: '/#fitur' },
      { label: 'Harga', to: '/auth/register' },
      { label: 'FAQ', to: '/#tentang' },
    ],
  },
  {
    title: 'Untuk',
    links: [
      { label: 'Musisi & Talent', to: '/#talent' },
      { label: 'Event Organizer', to: '/#eo' },
      { label: 'Pemilik Kafe', to: '/auth/register' },
      { label: 'Admin', to: '/auth/login' },
    ],
  },
  {
    title: 'Perusahaan',
    links: [
      { label: 'Tentang Kami', to: '/#tentang' },
      { label: 'Blog', to: '/#tentang' },
      { label: 'Karier', to: '/#tentang' },
      { label: 'Kontak', to: '/#tentang' },
    ],
  },
];
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

.font-display {
  font-family: 'Syne', sans-serif;
}
</style>
