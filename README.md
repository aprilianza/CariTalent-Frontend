# CariTalent - Frontend Web Application

Aplikasi web CariTalent adalah platform penghubung antara **Event Organizer (EO)** dan **Talenta** (Seniman, MC, Musisi, dll.). Frontend dibangun menggunakan framework modern **Nuxt (v4)** yang dinamis, responsif, dan teroptimasi secara performa serta SEO.

---

## 🚀 Teknologi Utama

Proyek ini dikembangkan dengan teknologi modern berikut:

- **Framework**: [Nuxt 4](https://nuxt.com/) (Vue 3, Nitro Server)
- **Styling & UI Components**: [Nuxt UI](https://ui.nuxt.com/) (terintegrasi dengan Tailwind CSS)
- **Icons**: [Nuxt Icon](https://github.com/nuxt/icon) (menggunakan set ikon `@iconify-json/mdi`)
- **Maps / Geolocation**: [Leaflet](https://leafletjs.com/) (untuk visualisasi lokasi talenta/event)
- **Typography**: Google Fonts (Syne & DM Sans)

---

## 📁 Struktur Folder Utama

Aplikasi ini menggunakan struktur modular yang rapi sesuai standar Nuxt:

```bash
CariTalent-Frontend/
├── app/
│   ├── assets/          # File static asset (CSS, Gambar, dll.)
│   ├── components/      # Komponen Vue yang reusable (admin, eo, talent, dll.)
│   ├── composables/     # State management / logic reusable (useAdminTalents, dll.)
│   ├── layouts/         # Layout halaman (default, dashboard, auth)
│   ├── middleware/      # Middleware rute (auth, guest, role-check)
│   ├── pages/           # File berbasis rute (Landing page, Auth, Dashboard)
│   │   ├── auth/        # Halaman Login & Register
│   │   └── dashboard/   # Dashboard per role (Admin, EO, Talent)
│   ├── plugins/         # Plugin Nuxt (Leaflet, API client, dll.)
│   ├── utils/           # Fungsi utilitas pembantu
│   ├── app.vue          # Entrypoint utama aplikasi
│   └── app.config.ts    # Konfigurasi runtime UI
├── public/              # Aset statis publik
├── nuxt.config.ts       # File konfigurasi utama Nuxt
├── tailwind.config.ts   # Konfigurasi Tailwind CSS kustom
└── package.json         # Dependensi & script proyek
```

---

## ⚙️ Konfigurasi Environment

Sebelum menjalankan aplikasi, pastikan Anda telah menyiapkan file `.env` di root direktori frontend. Contoh konfigurasinya:

```env
# URL API Backend Laravel Anda (Local)
NUXT_PUBLIC_API_BASE=http://localhost:8000/api/v1

# URL API Backend Laravel Anda (Staging/Production jika ada)
# NUXT_PUBLIC_API_BASE=https://staging-api.caritalent.id/api/v1
```

---

## 🛠️ Cara Memulai & Pengembangan

### 1. Instalasi Dependensi
Jalankan perintah berikut pada terminal Anda untuk mengunduh semua library yang diperlukan:

```bash
npm install
```

### 2. Menjalankan Server Development
Untuk menjalankan server lokal dengan fitur Hot Module Replacement (HMR) dan Nuxt DevTools:

```bash
npm run dev
```
Secara default, aplikasi akan berjalan pada port `3000`: [http://localhost:3000](http://localhost:3000)

### 3. Build untuk Produksi
Untuk melakukan kompilasi aplikasi ke production-ready bundle:

```bash
npm run build
```

### 4. Preview Hasil Build
Untuk menguji hasil build produksi secara lokal:

```bash
npm run preview
```

---

## 🗝️ Fitur & Modul Utama

Aplikasi ini terbagi menjadi 3 modul utama berdasarkan peran pengguna:

1. **Dashboard Admin**
   - Manajemen Pengguna (Talent & Event Organizer)
   - Verifikasi Akun & Portofolio
   - Moderasi Booking & Transaksi

2. **Dashboard Event Organizer (EO)**
   - Rekomendasi Talenta (berdasarkan genre, lokasi, harga)
   - Pembuatan dan Manajemen Event
   - Pemesanan/Booking Talenta & Pembayaran

3. **Dashboard Talent**
   - Manajemen Profil & Portofolio (Unggah foto, media, deskripsi skill)
   - Manajemen Jadwal & Booking Masuk
   - Penilaian/Ulasan (Review) dari EO

---

## 🔗 Integrasi Backend
Frontend ini dirancang untuk berinteraksi langsung dengan backend **Laravel API Server** yang berjalan secara default di `http://127.0.0.1:8000`. Detail API dapat dilihat langsung melalui Swagger UI di [http://127.0.0.1:8000/api/documentation](http://127.0.0.1:8000/api/documentation) saat server backend menyala.
