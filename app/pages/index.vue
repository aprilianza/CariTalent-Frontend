<template>
  <div class="min-h-screen bg-neutral-dark text-ui-light overflow-x-hidden">
    <!-- Noise texture overlay -->
    <div class="noise-overlay fixed inset-0 pointer-events-none z-0 opacity-30"></div>

    <!-- ═══════════════════════════ NAVBAR ═══════════════════════════ -->
    <LandingNavbar :nav-links="navLinks" />

    <!-- ═══════════════════════════ HERO ═══════════════════════════ -->
    <section class="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 scroll-mt-28" id="beranda">
      <!-- Background grid -->
      <div class="grid-bg absolute inset-0 opacity-10 pointer-events-none"></div>

      <!-- Orb top-right -->
      <div class="absolute top-20 right-0 w-96 h-96 rounded-full bg-highlight opacity-20 blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/4"></div>
      <!-- Orb bottom-left -->
      <div class="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-accent opacity-10 blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/4"></div>

      <div class="relative z-10 max-w-5xl mx-auto text-center">
        <!-- Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-highlight/30 bg-highlight/10 mb-8 animate-fade-in">
          <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          <span class="text-xs text-accent font-medium tracking-wider uppercase">Platform Musik Kreatif Indonesia</span>
        </div>

        <!-- Headline -->
        <h1 class="font-display text-5xl md:text-7xl lg:text-8xl font-black leading-none tracking-tighter mb-6 animate-slide-up">
          Temukan <br />
          <span class="hero-gradient-text">Talent Terbaik</span><br />
          <span class="text-ui-light/70">untuk Acaramu</span>
        </h1>

        <p class="text-neutral-medium text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up-delay">
          CariTalent menghubungkan musisi independen berbakat dengan penyelenggara acara — dari kafe, restoran, hingga event besar. Proses cepat, transparan, dan terstruktur.
        </p>

        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
          <NuxtLink
            to="/auth/register"
            class="group w-full sm:w-auto px-8 py-4 rounded-full bg-highlight hover:bg-purple-600 text-white font-semibold text-base transition-all duration-300 shadow-glow flex items-center justify-center gap-2"
          >
            Mulai Sekarang
            <Icon name="mdi:arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ HOW IT WORKS ═══════════════════════════ -->
    <section id="fitur" class="relative py-28 px-6 scroll-mt-28">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-xs font-semibold tracking-widest text-highlight uppercase">Cara Kerja</span>
          <h2 class="font-display text-4xl md:text-5xl font-black mt-3 text-ui-light">Sesederhana itu</h2>
          <p class="text-neutral-medium mt-4 max-w-lg mx-auto">Tiga langkah mudah mempertemukan talenta dan penyelenggara acara.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-6 relative">
          <!-- Connecting line -->
          <div class="hidden md:block absolute top-12 left-1/3 right-1/3 h-px bg-gradient-to-r from-transparent via-highlight/40 to-transparent"></div>
          <div class="hidden md:block absolute top-12 left-2/3 right-0 w-1/3 h-px bg-gradient-to-r from-highlight/40 to-transparent"></div>

          <div v-for="(step, i) in steps" :key="step.title" class="relative group bg-white/3 border border-white/8 rounded-2xl p-8 hover:border-highlight/30 hover:bg-white/6 transition-all duration-300">
            <div
              class="w-10 h-10 rounded-xl mb-6 flex items-center justify-center text-xl font-black font-display"
              :class="i === 0 ? 'bg-highlight text-white' : i === 1 ? 'bg-accent/20 text-accent' : 'bg-ui-dark text-neutral-medium border border-white/10'"
            >
              {{ i + 1 }}
            </div>
            <h3 class="font-display text-xl font-bold mb-3 text-ui-light">{{ step.title }}</h3>
            <p class="text-neutral-medium text-sm leading-relaxed">{{ step.desc }}</p>
            <Icon :name="step.icon" class="w-8 h-8 mt-6" />
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ FEATURES: TALENT ═══════════════════════════ -->
    <section id="talent" class="relative py-28 px-6 overflow-hidden scroll-mt-28">
      <div class="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-highlight/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span class="text-xs font-semibold tracking-widest text-highlight uppercase">Untuk Musisi</span>
            <h2 class="font-display text-4xl md:text-5xl font-black mt-3 mb-6 text-ui-light leading-tight">Panggungmu<br /><span class="text-highlight">menunggu</span> kamu</h2>
            <p class="text-neutral-medium leading-relaxed mb-8">Buat profil profesional, tampilkan portofolio, dan lamar langsung ke ratusan event yang mencari talenta sepertimu.</p>
            <div class="space-y-4">
              <div v-for="feat in talentFeatures" :key="feat.title" class="flex items-start gap-4 group">
                <div class="w-10 h-10 rounded-xl bg-highlight/10 border border-highlight/20 flex items-center justify-center flex-shrink-0 group-hover:bg-highlight/20 transition-colors">
                  <Icon :name="feat.icon" class="w-6 h-6" />
                </div>
                <div>
                  <div class="font-semibold text-ui-light text-sm">{{ feat.title }}</div>
                  <div class="text-neutral-medium text-sm mt-0.5">{{ feat.desc }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile card mockup -->
          <div class="relative">
            <div class="profile-card rounded-2xl bg-white/5 border border-white/10 p-6 relative overflow-hidden">
              <div class="absolute top-0 right-0 w-40 h-40 bg-highlight/10 rounded-full blur-2xl"></div>
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-highlight to-purple-800 flex items-center justify-center text-2xl font-black text-white">JR</div>
                <div>
                  <div class="font-display font-bold text-lg text-ui-light">Jazz Riyadh</div>
                  <div class="text-accent text-sm">Solo Guitarist • Bandung</div>
                  <div class="flex gap-1 mt-1">
                    <span v-for="g in ['Jazz', 'Blues', 'Pop']" :key="g" class="text-xs px-2 py-0.5 rounded-full bg-white/10 text-neutral-medium">{{ g }}</span>
                  </div>
                </div>
              </div>
              <div class="grid grid-cols-3 gap-3 mb-5 text-center">
                <div class="bg-white/5 rounded-xl p-3">
                  <div class="font-bold text-ui-light text-lg">47</div>
                  <div class="text-xs text-neutral-medium">Event</div>
                </div>
                <div class="bg-white/5 rounded-xl p-3">
                  <div class="font-bold text-ui-light text-lg">4.9</div>
                  <div class="text-xs text-neutral-medium">Rating</div>
                </div>
                <div class="bg-white/5 rounded-xl p-3">
                  <div class="font-bold text-accent text-lg">2jt</div>
                  <div class="text-xs text-neutral-medium">Harga/Show</div>
                </div>
              </div>
              <div class="flex gap-2">
                <NuxtLink to="/auth/register" class="flex-1 py-2.5 rounded-xl bg-highlight text-white text-sm font-semibold text-center">Undang Talent</NuxtLink>
                <NuxtLink to="/auth/login" class="flex-1 py-2.5 rounded-xl border border-white/10 text-neutral-medium text-sm hover:border-white/20 transition-colors text-center">Lihat Profil</NuxtLink>
              </div>
            </div>
            <!-- Floating notification -->
            <div class="absolute -top-4 -right-4 bg-ui-dark border border-highlight/30 rounded-xl px-4 py-2.5 shadow-glow-sm">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                <span class="text-xs text-ui-light font-medium">Undangan baru masuk!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ FEATURES: EO ═══════════════════════════ -->
    <section id="eo" class="relative py-28 px-6 overflow-hidden scroll-mt-28">
      <div class="absolute left-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-accent/8 rounded-full blur-3xl pointer-events-none"></div>

      <div class="max-w-6xl mx-auto relative z-10">
        <div class="grid md:grid-cols-2 gap-16 items-center">
          <!-- Event card mockup -->
          <div class="relative order-2 md:order-1">
            <div class="event-card rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold tracking-widest text-accent uppercase">Event Aktif</span>
                <span class="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
              </div>
              <div v-for="evt in eventCards" :key="evt.name" class="flex items-center gap-4 bg-white/5 rounded-xl p-4 hover:bg-white/8 transition-colors cursor-pointer group">
                <Icon :name="evt.icon" class="w-10 h-10 flex-shrink-0" :class="evt.bg" />
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-ui-light text-sm truncate">{{ evt.name }}</div>
                  <div class="text-xs text-neutral-medium">{{ evt.detail }}</div>
                </div>
                <div class="text-right">
                  <div class="text-xs text-accent font-semibold">{{ evt.apps }} pelamar</div>
                  <div class="text-xs text-neutral-medium">{{ evt.date }}</div>
                </div>
              </div>
            </div>
            <!-- Floating stat -->
            <div class="absolute -bottom-4 -left-4 bg-ui-dark border border-accent/30 rounded-xl px-4 py-2.5">
              <div class="flex items-center gap-2">
                <Icon name="mdi:target" class="w-5 h-5" />
                <div>
                  <div class="text-xs font-bold text-ui-light">Rata-rata 12 pelamar</div>
                  <div class="text-xs text-neutral-medium">per event yang dibuat</div>
                </div>
              </div>
            </div>
          </div>

          <div class="order-1 md:order-2">
            <span class="text-xs font-semibold tracking-widest text-accent uppercase">Untuk Event Organizer</span>
            <h2 class="font-display text-4xl md:text-5xl font-black mt-3 mb-6 text-ui-light leading-tight">Talenta terbaik,<br /><span class="text-accent">hitungan menit</span></h2>
            <p class="text-neutral-medium leading-relaxed mb-8">Posting kebutuhan eventmu, terima lamaran dari musisi berbakat, undang langsung talent pilihanmu. Semua dalam satu platform.</p>
            <div class="space-y-4">
              <div v-for="feat in eoFeatures" :key="feat.title" class="flex items-start gap-4 group">
                <div class="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  <Icon :name="feat.icon" class="w-6 h-6" />
                </div>
                <div>
                  <div class="font-semibold text-ui-light text-sm">{{ feat.title }}</div>
                  <div class="text-neutral-medium text-sm mt-0.5">{{ feat.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ PLATFORM PILLARS ═══════════════════════════ -->
    <section class="py-28 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-16">
          <span class="text-xs font-semibold tracking-widest text-highlight uppercase">Keunggulan</span>
          <h2 class="font-display text-4xl md:text-5xl font-black mt-3 text-ui-light">Dibangun untuk ekosistem<br /><span class="text-highlight">kreatif Indonesia</span></h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div v-for="pillar in pillars" :key="pillar.title" class="group relative bg-white/3 border border-white/8 rounded-2xl p-6 hover:border-highlight/30 hover:bg-white/6 transition-all duration-300 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-highlight/0 to-highlight/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div class="relative z-10">
              <Icon :name="pillar.icon" class="w-8 h-8 mb-4" />
              <h3 class="font-display font-bold text-ui-light mb-2">{{ pillar.title }}</h3>
              <p class="text-neutral-medium text-sm leading-relaxed">{{ pillar.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ TEAM ═══════════════════════════ -->
    <section class="min-h-screen py-28 px-6 relative overflow-hidden flex items-center">
      <span id="tim-kami" class="absolute top-20 left-0 h-px w-px" aria-hidden="true"></span>
      <div class="absolute inset-0 bg-ui-dark/50 pointer-events-none"></div>
      <div class="absolute -top-24 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-highlight/10 blur-3xl pointer-events-none"></div>
      <div class="max-w-6xl mx-auto w-full relative z-10">
        <div class="text-center mb-16">
          <span class="text-xs font-semibold tracking-widest text-highlight uppercase">Tim Kami</span>
          <h2 class="font-display text-4xl md:text-5xl font-black mt-3 text-ui-light">Tim Kami</h2>
          <p class="text-neutral-medium mt-4 max-w-xl mx-auto">Orang-orang di balik pengalaman CariTalent yang cepat, rapi, dan mudah dipakai.</p>
        </div>

        <UCarousel
          :items="teamMembers"
          arrows
          dots
          loop
          :ui="{
            viewport: 'overflow-visible',
            container: '-ms-4',
            item: 'basis-[86%] ps-4 sm:basis-1/2 lg:basis-1/3',
            controls: 'mt-8',
            arrows: 'justify-center gap-3',
            dots: 'mt-5',
          }"
          :prev="{ class: 'rounded-full border-white/10 bg-white/5 text-ui-light hover:bg-white/10' }"
          :next="{ class: 'rounded-full border-white/10 bg-white/5 text-ui-light hover:bg-white/10' }"
        >
          <template #default="{ item: member }">
            <article class="group overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:border-highlight/30 hover:bg-white/[0.07]">
              <div class="relative aspect-[4/3] overflow-hidden">
                <div class="absolute inset-0" :class="member.avatarBg"></div>
                <div class="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_30%),linear-gradient(180deg,transparent,rgba(10,10,18,0.45))]"></div>
                <div class="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/20 blur-2xl transition-transform duration-500 group-hover:scale-125"></div>
                <div class="absolute inset-x-0 bottom-0 flex items-end justify-between p-5">
                  <div class="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-neutral-dark/35 font-display text-2xl font-black text-white shadow-glow-sm backdrop-blur-md">
                    {{ member.initials }}
                  </div>
                  <Icon name="mdi:account-music-outline" class="h-8 w-8 text-white/70" />
                </div>
              </div>

              <div class="px-6 py-5">
                <p class="text-xs font-semibold uppercase tracking-[0.28em] text-accent">{{ member.role }}</p>
                <h3 class="mt-2 font-display text-xl font-bold text-ui-light">{{ member.name }}</h3>
              </div>
            </article>
          </template>
        </UCarousel>
      </div>
    </section>

    <!-- ═══════════════════════════ CTA ═══════════════════════════ -->
    <section class="py-28 px-6 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-highlight/20 via-transparent to-accent/10 pointer-events-none"></div>
      <div class="absolute inset-0 grid-bg opacity-10 pointer-events-none"></div>

      <div class="max-w-3xl mx-auto relative z-10 text-center">
        <Icon name="mdi:music-note" class="w-16 h-16 mb-6" />
        <h2 class="font-display text-4xl md:text-6xl font-black text-ui-light mb-6 leading-tight">Siap naik panggung<br />atau temukan <span class="text-highlight">talenta?</span></h2>
        <p class="text-neutral-medium text-lg mb-10">Bergabung dengan ribuan musisi dan penyelenggara acara yang telah menggunakan CariTalent.</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/auth/register" class="px-8 py-4 rounded-full bg-highlight hover:bg-purple-600 text-white font-semibold text-base transition-all duration-300 shadow-glow">Daftar Sekarang</NuxtLink>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════ FOOTER ═══════════════════════════ -->
    <LandingFooter />
  </div>
</template>

<script setup lang="ts">
const navLinks = [
  { label: 'Fitur', to: '/#fitur' },
  { label: 'Untuk Talent', to: '/#talent' },
  { label: 'Untuk EO', to: '/#eo' },
  { label: 'Tim Kami', to: '/#tim-kami' },
];

const stats = [
  { value: '2.400+', label: 'Talent Terdaftar' },
  { value: '890+', label: 'Event Aktif' },
  { value: '12rb+', label: 'Booking Sukses' },
];

const talentCards = [
  { name: 'Rizky Akustik', genre: 'Acoustic Pop', price: '1.5jt', icon: 'mdi:guitar-acoustic', color: 'bg-highlight/20' },
  { name: 'DJ Senja', genre: 'Electronic', price: '2jt', icon: 'mdi:headphones', color: 'bg-accent/20' },
  { name: 'The Bandits', genre: 'Indie Rock', price: '3.5jt', icon: 'mdi:music-box', color: 'bg-purple-500/20' },
  { name: 'Maya Jazz', genre: 'Jazz Fusion', price: '2.5jt', icon: 'mdi:saxophone', color: 'bg-yellow-500/20' },
  { name: 'Ara Vocals', genre: 'RnB Soul', price: '1.8jt', icon: 'mdi:microphone', color: 'bg-pink-500/20' },
  { name: 'Endra Trio', genre: 'Traditional', price: '1.2jt', icon: 'mdi:violin', color: 'bg-green-500/20' },
];

const steps = [
  {
    title: 'Buat Profil',
    desc: 'Talent membuat profil profesional dengan genre, portofolio, dan kisaran harga penampilan.',
    icon: 'mdi:palette',
  },
  {
    title: 'Temukan Event',
    desc: 'EO memposting kebutuhan acara. Talent menemukan event yang cocok dan melamar langsung.',
    icon: 'mdi:magnify',
  },
  {
    title: 'Booking & Tampil',
    desc: 'Kesepakatan tercatat di sistem. Keduanya memiliki rekam jejak yang jelas dan terstruktur.',
    icon: 'mdi:handshake',
  },
];

const talentFeatures = [
  { icon: 'mdi:account', title: 'Profil Profesional', desc: 'Tampilkan identitas, genre, portofolio video, dan kisaran harga.' },
  { icon: 'mdi:clipboard-list', title: 'Lamar Event Langsung', desc: 'Temukan dan lamar event yang sesuai jadwal dan kemampuanmu.' },
  { icon: 'mdi:bell', title: 'Notifikasi Real-time', desc: 'Terima notifikasi undangan dan perubahan status lamaran instan.' },
  { icon: 'mdi:calendar', title: 'Manajemen Jadwal', desc: 'Atur jadwal penampilan agar tidak bentrok satu sama lain.' },
];

const eoFeatures = [
  { icon: 'mdi:megaphone', title: 'Post Event Mudah', desc: 'Buat event dengan detail genre, anggaran, tanggal, dan lokasi venue.' },
  { icon: 'mdi:target', title: 'Filter Talent Tepat', desc: 'Saring pelamar berdasarkan genre, lokasi, dan kisaran biaya.' },
  { icon: 'mdi:email', title: 'Undang Langsung', desc: 'Temukan dan undang talent impianmu secara proaktif.' },
  { icon: 'mdi:check', title: 'Konfirmasi Booking', desc: 'Sistem mencatat kesepakatan resmi antara EO dan talent.' },
];

const eventCards = [
  { name: 'Jazz Night Bandung', detail: 'Jazz · Kafe Purnama', icon: 'mdi:saxophone', bg: 'bg-yellow-500/20', apps: 8, date: '22 Mar' },
  { name: 'Indie Fest Jakarta', detail: 'Indie · Rooftop Venue', icon: 'mdi:guitar-acoustic', bg: 'bg-highlight/20', apps: 15, date: '25 Mar' },
  { name: 'Sunday Acoustic', detail: 'Acoustic · Kedai Buku', icon: 'mdi:music-note', bg: 'bg-accent/20', apps: 5, date: '28 Mar' },
];

const pillars = [
  { icon: 'mdi:lock', title: 'Terverifikasi', desc: 'Setiap profil talent diverifikasi admin untuk menjamin kualitas platform.' },
  { icon: 'mdi:cellphone', title: 'Mobile & Web', desc: 'Akses penuh di aplikasi Flutter mobile maupun website Nuxt.js.' },
  { icon: 'mdi:lightning-bolt', title: 'Real-time', desc: 'Notifikasi, status lamaran, dan undangan terupdate secara langsung.' },
  { icon: 'mdi:earth', title: 'Lokal Fokus', desc: 'Dirancang khusus untuk ekosistem musik independen Indonesia.' },
];

const teamMembers = [
  {
    name: 'Alya Prameswari',
    role: 'Frontend Developer',
    focus: 'Mengembangkan UI interaktif dan komponen yang konsisten untuk seluruh aplikasi.',
    initials: 'AP',
    avatarBg: 'bg-highlight',
  },
  {
    name: 'Kevin Santoso',
    role: 'Frontend Developer',
    focus: 'Fokus pada performa, responsivitas, dan aksesibilitas tampilan web.',
    initials: 'KS',
    avatarBg: 'bg-accent/60',
  },
  {
    name: 'Nadia Puspita',
    role: 'Frontend Developer',
    focus: 'Membangun design system dan integrasi antarmuka dengan API.',
    initials: 'NP',
    avatarBg: 'bg-purple-600',
  },
  {
    name: 'Rafi Mahendra',
    role: 'Backend Developer',
    focus: 'Merancang arsitektur layanan, autentikasi, dan integrasi data.',
    initials: 'RM',
    avatarBg: 'bg-emerald-500',
  },
  {
    name: 'Citra Wulandari',
    role: 'Backend Developer',
    focus: 'Mengembangkan API, optimasi query, serta keamanan layanan.',
    initials: 'CW',
    avatarBg: 'bg-sky-500',
  },
  {
    name: 'Dimas Prakoso',
    role: 'Backend Developer',
    focus: 'Menjaga skalabilitas sistem dan monitoring layanan produksi.',
    initials: 'DP',
    avatarBg: 'bg-orange-500',
  },
];
</script>

<style scoped>
* {
  font-family: 'DM Sans', sans-serif;
}

.font-display {
  font-family: 'Syne', sans-serif;
}

/* Noise texture */
.noise-overlay {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-size: 200px;
}

/* Grid background */
.grid-bg {
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}

/* Hero gradient text */
.hero-gradient-text {
  background: linear-gradient(135deg, #8a2be2 0%, #00bfff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Shadows */
.shadow-glow {
  box-shadow: 0 0 30px rgba(138, 43, 226, 0.4);
}
.shadow-glow-sm {
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.25);
}

/* Animations */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease forwards;
}
.animate-slide-up {
  animation: slide-up 0.7s ease forwards;
}
.animate-slide-up-delay {
  animation: slide-up 0.7s ease 0.15s both;
}
.animate-slide-up-delay-2 {
  animation: slide-up 0.7s ease 0.3s both;
}
</style>
