# Tutorial 2: Panduan Mendapatkan API Keys

Project ini membutuhkan beberapa integrasi API dari pihak ketiga agar bisa berjalan maksimal. Berikut adalah cara mengambilnya:

## 1. Upstash Redis (Wajib untuk Database/Cache)
Aplikasi ini menggunakan Redis untuk menyimpan session dan caching (keranjang, status bayar dll).
1. Buka [https://console.upstash.com](https://console.upstash.com) dan buat akun (Gratis).
2. Klik tombol **Create Database**, beri nama sesuka Anda, pilih region (pilih negara asia seperti Singapore).
3. Setelah database jadi, scroll ke bagian **REST API**.
4. Disana akan ada dua kode: `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`.
5. Copy keduanya dan masukkan ke dalam file `.env` utama.

---

## 2. SMTP Email (Untuk Kirim Invoice/Notifikasi)
Digunakan agar website bisa mengirim email struk pembelian ke pelanggan.
1. Gunakan email Gmail Anda.
2. Buka Pengaturan Google ID -> **Security (Keamanan)**.
3. Aktifkan **2-Step Verification (Verifikasi 2 Langkah)**.
4. Setelah aktif, cari menu **App Passwords (Sandi Aplikasi)**.
5. Buat sandi baru (Pilih "Lainnya", ketik "NodeMailer" atau nama web anda).
6. Copy passowrd 16 digit yang muncul (tanpa spasi).
7. Paste di `.env` pada baris `EMAIL_PASSWORD=`, dan isi email Anda di `EMAIL_USER=`.

---

## 3. API Payment Gateway (Pilih Salah Satu)
Agar pembeli bisa transfer pake Virtual Account / QRIS.

### A. Menggunakan Xendit (Default)
1. Daftar akun di [Xendit](https://xendit.co).
2. Buka menu **Settings -> API Keys**.
3. Generate Secret Key baru. Beri akses untuk Invoice/Money In.
4. Copy dan letakkan di `XENDIT_APIKEY=`.

### B. Menggunakan Tripay
1. Daftar merchant di [Tripay](https://tripay.co.id/).
2. Buat Merchant baru di dashboard, lalu minta Aktifasi.
3. Di Merchant detail, Anda akan mendapatkan API Key, Private Key, dan Kode Merchant.
4. Isi ketiganya di `.env`.
5. Ubah pengaturan gateway di `.env`: `PAYMENT_GATEWAY=tripay`.

---

## 4. Google OAuth (Untuk Fitur Login dengan Google)
Agar pelanggan tidak perlu daftar manual.
1. Buka [Google Cloud Console](https://console.cloud.google.com).
2. Buat project baru. Pergi ke **APIs & Services -> Credentials**.
3. Klik **Create Credentials -> OAuth client ID**.
4. Tipe aplikasi: **Web Application**.
5. Di bagian **Authorized JavaScript origins**, isi domain Anda (Contoh: `http://localhost:5173` & `http://localhost:3000` untuk lokal, dan URL domain website online Anda).
6. Copy `Client ID` dan paste ke `GOOGLE_CLIENT_ID=` serta `NUXT_PUBLIC_GOOGLE_CLIENT_ID=` (di file nuxt/.env).

---

## 5. Google reCAPTCHA v3
Untuk anti-spam & anti-bot di form login/register.
1. Buka [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin/).
2. Tambahkan website, pilih **reCAPTCHA v3**.
3. Masukkan domain Anda (berlaku juga untuk localhost).
4. Copy Site Key dan paste ke `.env` pada parameter `NUXT_PUBLIC_RECAPTCHA_SITE_KEY=`.
5. Copy Secret Key ke `RECAPTCHA_SECRET_KEY=`.

---

## 6. Telegram Bot & Fonnte WhatsApp Bot (Notifikasi Admin)
Agar Admin dapat pesan notifikasi ke HP saat ada yang beli.

**Telegram:**
1. Chat dengan [@BotFather](https://t.me/botfather) di app Telegram.
2. Ketik `/newbot`, ikuti petunjuknya. Nanti akan dikasih Token panjang. Paste ke `TELEGRAM_BOT_TOKEN=`.
3. Untuk mengetahui User ID Anda (agar pesan terkirim ke anda), chat ke [@userinfobot](https://t.me/userinfobot). Paste hasil ID nya ke `TELEGRAM_OWNER_ID=`.

**WhatsApp (Fonnte):**
1. Daftar di [Fonnte](https://fonnte.com).
2. Lakukan Device Scan/Tautkan nomor WA bot Anda.
3. Buka menu API -> Copy Token-nya.
4. Paste token ke `FONNTE_TOKEN=`.
