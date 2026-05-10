# Requirements Document

## Introduction

Fitur ini menggantikan semua data mock (`useMockResource`) pada composables dashboard talent di aplikasi CariTalent (Nuxt 3) dengan pemanggilan API nyata ke backend CariTalent. Tujuannya adalah agar halaman-halaman dashboard talent — overview, lamaran, booking, undangan, browse events, profil, dan review — menampilkan data real-time dari server, bukan data statis hardcoded.

Integrasi mencakup tujuh composable (`useProfile`, `useApplications`, `useBookings`, `useInvitations`, `useEvents`, `useTalentReviews`, `useProfileSettings`), konfigurasi environment variable, penanganan autentikasi via Bearer Token (Laravel Sanctum), serta error handling yang konsisten di seluruh dashboard.

---

## Glossary

- **API_Client**: Lapisan pemanggilan HTTP menggunakan `$fetch` / `useAsyncData` Nuxt 3 yang berkomunikasi dengan backend CariTalent.
- **Auth_Token**: Bearer token Laravel Sanctum yang disimpan di cookie `auth_token`, digunakan sebagai header `Authorization` pada setiap request yang memerlukan autentikasi.
- **Base_URL**: URL dasar backend API, dikonfigurasi via `NUXT_PUBLIC_API_BASE` dan diakses melalui `useRuntimeConfig().public.apiBase`.
- **Composable**: File TypeScript di `app/composables/` yang mengenkapsulasi logika pengambilan data untuk satu domain (profil, lamaran, booking, dll.).
- **Dashboard**: Kumpulan halaman Nuxt di `app/pages/dashboard/talent/` yang menampilkan data talent yang sedang login.
- **Mock_Resource**: Implementasi sementara menggunakan `useMockResource` yang mengembalikan data statis dengan delay simulasi.
- **Response_Envelope**: Format standar response API: `{ success: boolean, message: string, data: {...} }`.
- **Talent**: Pengguna dengan role `talent` — seniman yang mendaftar di platform CariTalent.
- **EO**: Event Organizer — pengguna yang membuat event dan mengundang/menerima lamaran talent.
- **Runtime_Config**: Konfigurasi Nuxt yang dapat diakses via `useRuntimeConfig()`, diisi dari environment variable saat build/runtime.

---

## Requirements

### Requirement 1: Konfigurasi Environment dan Base URL API

**User Story:** Sebagai developer, saya ingin mengonfigurasi base URL API melalui environment variable, sehingga aplikasi dapat terhubung ke backend yang berbeda (development, staging, production) tanpa mengubah kode.

#### Acceptance Criteria

1. THE Runtime_Config SHALL membaca nilai `NUXT_PUBLIC_API_BASE` dari file `.env` sebagai base URL untuk semua pemanggilan API.
2. WHEN nilai `NUXT_PUBLIC_API_BASE` tidak tersedia di environment, THE Runtime_Config SHALL menggunakan nilai default `https://api.caritalent.id/api/v1`.
3. THE API_Client SHALL menggunakan `useRuntimeConfig().public.apiBase` sebagai `baseURL` pada setiap pemanggilan `$fetch`.
4. THE Runtime_Config SHALL mengekspos `apiBase` hanya melalui `runtimeConfig.public` agar dapat diakses di sisi client maupun server.

---

### Requirement 2: Autentikasi Bearer Token pada Setiap Request

**User Story:** Sebagai talent yang sudah login, saya ingin setiap request ke API terautentikasi secara otomatis, sehingga saya tidak perlu login ulang setiap kali membuka halaman dashboard.

#### Acceptance Criteria

1. THE API_Client SHALL membaca nilai Auth_Token dari cookie `auth_token` menggunakan `useCookie('auth_token')` sebelum setiap request yang memerlukan autentikasi.
2. WHEN Auth_Token tersedia, THE API_Client SHALL menyertakan header `Authorization: Bearer {token}` pada setiap request ke endpoint yang memerlukan autentikasi.
3. WHEN Auth_Token tidak tersedia atau bernilai null, THE API_Client SHALL menghentikan pemanggilan API dan mengembalikan state error yang dapat ditangani oleh halaman.
4. WHEN server mengembalikan HTTP 401, THE API_Client SHALL menghapus Auth_Token dari cookie dan mengarahkan pengguna ke halaman login.

---

### Requirement 3: Integrasi useProfile — Profil Talent yang Login

**User Story:** Sebagai talent yang login, saya ingin melihat data profil saya yang akurat di dashboard, sehingga saya dapat memastikan informasi yang ditampilkan sesuai dengan data terbaru di sistem.

#### Acceptance Criteria

1. WHEN composable `useProfile` dipanggil, THE API_Client SHALL memanggil `GET /auth/me` untuk mendapatkan data user (id, name, email, phone, role) dari talent yang sedang login.
2. WHEN `GET /auth/me` berhasil dan `data.role` adalah `talent`, THE API_Client SHALL memanggil `GET /talents/{id}` menggunakan `talent_id` yang diperoleh dari profil user untuk mendapatkan data profil talent lengkap (stage_name, genre, verified, average_rating, media).
3. THE `useProfile` composable SHALL menggabungkan data dari `GET /auth/me` dan `GET /talents/{id}` menjadi satu objek bertipe `TalentProfile`.
4. WHEN salah satu dari kedua endpoint gagal, THE `useProfile` composable SHALL mengembalikan state `error` yang berisi pesan error dari Response_Envelope.
5. THE `useProfile` composable SHALL mengekspos `data`, `pending`, `error`, dan `refresh` agar halaman dapat merespons perubahan state.

---

### Requirement 4: Integrasi useApplications — Daftar Lamaran Talent

**User Story:** Sebagai talent, saya ingin melihat semua lamaran yang sudah saya kirim beserta statusnya, sehingga saya dapat memantau perkembangan setiap lamaran.

#### Acceptance Criteria

1. WHEN composable `useApplications` dipanggil, THE API_Client SHALL memanggil `GET /applications/my` dengan header Auth_Token.
2. WHEN `GET /applications/my` berhasil, THE `useApplications` composable SHALL mengembalikan array `Application[]` dari `response.data.applications`.
3. WHEN `GET /applications/my` mengembalikan array kosong, THE `useApplications` composable SHALL mengembalikan array kosong tanpa error.
4. IF `GET /applications/my` gagal dengan error jaringan atau HTTP 4xx/5xx, THEN THE `useApplications` composable SHALL mengembalikan state `error` dengan pesan yang dapat ditampilkan ke pengguna.
5. THE `useApplications` composable SHALL mengekspos `data`, `pending`, `error`, dan `refresh`.

---

### Requirement 5: Integrasi useBookings — Daftar Booking Talent

**User Story:** Sebagai talent, saya ingin melihat semua booking yang terkonfirmasi dan selesai, sehingga saya dapat merencanakan jadwal penampilan saya.

#### Acceptance Criteria

1. WHEN composable `useBookings` dipanggil, THE API_Client SHALL memanggil `GET /bookings/my` dengan header Auth_Token.
2. WHEN `GET /bookings/my` berhasil, THE `useBookings` composable SHALL mengembalikan array `Booking[]` dari `response.data.bookings`.
3. WHEN `GET /bookings/my` mengembalikan array kosong, THE `useBookings` composable SHALL mengembalikan array kosong tanpa error.
4. IF `GET /bookings/my` gagal, THEN THE `useBookings` composable SHALL mengembalikan state `error` dengan pesan yang dapat ditampilkan ke pengguna.
5. THE `useBookings` composable SHALL mengekspos `data`, `pending`, `error`, dan `refresh`.

---

### Requirement 6: Integrasi useInvitations — Daftar Undangan dan Respons

**User Story:** Sebagai talent, saya ingin melihat undangan dari Event Organizer dan dapat menerima atau menolaknya secara langsung, sehingga saya dapat merespons peluang manggung dengan cepat.

#### Acceptance Criteria

1. WHEN composable `useInvitations` dipanggil, THE API_Client SHALL memanggil `GET /invitations/my` dengan header Auth_Token.
2. WHEN `GET /invitations/my` berhasil, THE `useInvitations` composable SHALL mengembalikan array `Invitation[]` dari `response.data.invitations`.
3. WHEN fungsi `respondToInvitation(id, status)` dipanggil dengan `status` bernilai `accepted` atau `rejected`, THE API_Client SHALL memanggil `PUT /invitations/{id}/respond` dengan body `{ status }` dan header Auth_Token.
4. WHEN `PUT /invitations/{id}/respond` berhasil, THE `useInvitations` composable SHALL memperbarui status undangan yang bersangkutan di state lokal tanpa perlu memanggil ulang `GET /invitations/my`.
5. IF `PUT /invitations/{id}/respond` gagal, THEN THE `useInvitations` composable SHALL mengembalikan error dan mempertahankan status undangan sebelumnya di state lokal.
6. THE `useInvitations` composable SHALL mengekspos `data`, `pending`, `error`, `refresh`, dan `respondToInvitation`.

---

### Requirement 7: Integrasi useEvents — Browse Events untuk Talent

**User Story:** Sebagai talent, saya ingin melihat daftar event yang tersedia di platform, sehingga saya dapat menemukan event yang sesuai dan mengajukan lamaran.

#### Acceptance Criteria

1. WHEN composable `useEvents` dipanggil, THE API_Client SHALL memanggil `GET /events` dengan header Auth_Token.
2. WHEN `GET /events` berhasil, THE `useEvents` composable SHALL mengembalikan array `Event[]` dari `response.data.events`.
3. THE `useEvents` composable SHALL mengekspos `pagination` dari `response.data.pagination` untuk mendukung navigasi halaman.
4. WHEN parameter filter (status, genre, city, search, page) diberikan, THE API_Client SHALL menyertakan parameter tersebut sebagai query string pada `GET /events`.
5. IF `GET /events` gagal, THEN THE `useEvents` composable SHALL mengembalikan state `error` dengan pesan yang dapat ditampilkan ke pengguna.
6. THE `useEvents` composable SHALL mengekspos `data`, `pagination`, `pending`, `error`, dan `refresh`.

---

### Requirement 8: Integrasi useTalentReviews — Daftar Review Talent

**User Story:** Sebagai talent, saya ingin melihat semua review yang diberikan oleh Event Organizer kepada saya, sehingga saya dapat memantau reputasi dan kualitas penampilan saya.

#### Acceptance Criteria

1. WHEN composable `useTalentReviews` dipanggil, THE API_Client SHALL memanggil `GET /talents/{talent_id}/reviews` dengan `talent_id` dari profil talent yang sedang login.
2. WHEN `GET /talents/{talent_id}/reviews` berhasil, THE `useTalentReviews` composable SHALL mengembalikan array `TalentReviewItem[]` dari `response.data.reviews`.
3. THE `useTalentReviews` composable SHALL mengekspos metadata review: `averageRating`, `totalReviews`, `stageName`, dan `pagination`.
4. WHEN `talent_id` belum tersedia (profil belum dimuat), THE `useTalentReviews` composable SHALL menunda pemanggilan API hingga `talent_id` tersedia.
5. IF `GET /talents/{talent_id}/reviews` gagal, THEN THE `useTalentReviews` composable SHALL mengembalikan state `error` dengan pesan yang dapat ditampilkan ke pengguna.
6. THE `useTalentReviews` composable SHALL mengekspos `data`, `meta`, `pending`, `error`, dan `refresh`.

---

### Requirement 9: Integrasi useProfileSettings — Update Profil dan Password

**User Story:** Sebagai talent, saya ingin dapat memperbarui informasi profil dan mengganti password saya melalui dashboard, sehingga data akun saya selalu akurat dan aman.

#### Acceptance Criteria

1. WHEN fungsi `updateProfile(payload)` dipanggil dengan `{ name, phone }`, THE API_Client SHALL memanggil `PUT /users/profile` dengan body payload tersebut dan header Auth_Token.
2. WHEN `PUT /users/profile` berhasil, THE `useProfileSettings` composable SHALL mengembalikan Response_Envelope dengan `success: true` dan data profil yang diperbarui.
3. WHEN fungsi `changePassword(payload)` dipanggil dengan `{ current_password, new_password, new_password_confirmation }`, THE API_Client SHALL memanggil `PUT /users/password` dengan body payload tersebut dan header Auth_Token.
4. WHEN `PUT /users/password` berhasil, THE `useProfileSettings` composable SHALL mengembalikan Response_Envelope dengan `success: true`.
5. IF `PUT /users/profile` atau `PUT /users/password` mengembalikan HTTP 422, THEN THE `useProfileSettings` composable SHALL melempar error dengan pesan validasi dari `response.errors` agar dapat ditampilkan di form.
6. WHEN fungsi `uploadMedia(payload)` dipanggil, THE API_Client SHALL memanggil `POST /talents/{id}/media` dengan `multipart/form-data` dan header Auth_Token.
7. WHEN fungsi `deleteMedia(payload)` dipanggil, THE API_Client SHALL memanggil `DELETE /talents/{talent_id}/media/{media_id}` dengan header Auth_Token.

---

### Requirement 10: Penanganan Error yang Konsisten

**User Story:** Sebagai talent, saya ingin melihat pesan error yang informatif ketika terjadi masalah koneksi atau server, sehingga saya tahu apa yang terjadi dan dapat mengambil tindakan yang tepat.

#### Acceptance Criteria

1. WHEN API mengembalikan response dengan `success: false`, THE API_Client SHALL memperlakukan response tersebut sebagai error dan mengekspos `message` dari Response_Envelope.
2. WHEN terjadi error jaringan (network timeout, no connection), THE API_Client SHALL mengembalikan pesan error yang dapat dibaca pengguna, bukan stack trace teknis.
3. WHEN API mengembalikan HTTP 401, THE Dashboard SHALL mengarahkan pengguna ke halaman login dan menghapus Auth_Token dari cookie.
4. WHEN API mengembalikan HTTP 403, THE Dashboard SHALL menampilkan pesan bahwa pengguna tidak memiliki akses ke resource tersebut.
5. WHEN API mengembalikan HTTP 404, THE Dashboard SHALL menampilkan pesan bahwa data tidak ditemukan.
6. IF API mengembalikan HTTP 500, THEN THE Dashboard SHALL menampilkan pesan error umum dan menyediakan tombol untuk mencoba ulang (refresh).

---

### Requirement 11: Penghapusan useMockResource dari Composables Talent

**User Story:** Sebagai developer, saya ingin memastikan tidak ada lagi data mock yang digunakan di composables talent, sehingga dashboard selalu menampilkan data real dari backend.

#### Acceptance Criteria

1. THE `useProfile` composable SHALL tidak mengimpor atau menggunakan `useMockResource`.
2. THE `useApplications` composable SHALL tidak mengimpor atau menggunakan `useMockResource`.
3. THE `useBookings` composable SHALL tidak mengimpor atau menggunakan `useMockResource`.
4. THE `useInvitations` composable SHALL tidak mengimpor atau menggunakan `useMockResource`.
5. THE `useEvents` composable SHALL tidak mengimpor atau menggunakan `useMockResource`.
6. THE `useTalentReviews` composable SHALL tidak mengimpor atau menggunakan `useMockResource`.
7. WHEN semua composable talent telah dimigrasi, THE codebase SHALL lulus TypeScript type check (`nuxi typecheck`) tanpa error terkait perubahan ini.
