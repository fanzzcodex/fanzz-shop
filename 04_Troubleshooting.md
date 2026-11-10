# Tutorial 4: Troubleshooting & Error Handling
*(Cara Menganalisa dan Memperbaiki Kendala Umum)*

Beberapa `error` mungkin sering terjadi akibat salah setup. Berikut solusinya:

## 1. Web Putih Kosong/Blank (Frontend)
**Penyebab:**
- Gagal load environment variables `NUXT_PUBLIC_BASE_URL`.
- Modul Node (Vue/Nuxt) belum di-build.

**Solusi:**
Pastikan jalankan perintah `npm run build` atau `npm run generate` di dalam folder `nuxt/`. Cek juga file `.env` dan `nuxt/.env` sudah memiliki variabel base URL. Masuk ke mode Development (`yarn dev` & `npm run dev`) untuk melihat console *Error* merah.

## 2. API Menolak Request (Method Not Allowed / CORS Error)
**Penyebab:**
- Browser mencegat permintaan karena domain API berbeda dari domain Frontend.
- Port yang dituju firewall (VPS) belum dibuka.

**Solusi:**
- Buka file `app.js`, pastikan `app.use(cors())` aktif atau domain yang didaftarkan sudah benar.
- Pastikan URL `/api/data/` sesuai. Variabel `NUXT_PUBLIC_BASE_URL` jangan tertukar URL backend dengan frontend apabila Anda mendeploynya secara terpisah (ex: Vercel + Backend Render).

## 3. Bot WhatsApp Tidak Mengirim Pesan
**Penyebab:**
- Kuota akun *Fonnte* Anda habis.
- Nomor HP pemilik atau pelanggan salah format (Harus 628... / tanpa plus / tanpa karakter strip).
- Token tidak valid.

## 4. Upstash Redis Rest URL "Invalid Token / Connection Timeout"
**Penyebab:**
Kredensial Redis Anda salah atau database di Upstash telah ditangguhkan (karena lama tidak dibuka/Free Plan dibekukan).

**Solusi:**
Login ulang ke console Upstash, buat database baru atau copy ulang REST URL dan Token-nya, lalu ganti di `.env`.

## 5. Google Login Menampilkan "Error 400: redirect_uri_mismatch"
**Penyebab:**
Domain website baru Anda belum didaftarkan di Google Cloud Console.

**Solusi:**
Masuk ke `console.cloud.google.com` > Credentials > OAuth 2.0 Client IDs.
Di bagian `Authorized origin` dan `Authorized redirect URIs`, masukkan protokol `https://` domain baru Anda secara tepat (bahkan slash `/` di ujung url sangat berpengaruh).

## 6. PM2 (Backend) Muncul 'Restarting Continuously'
Status log pm2 (`pm2 logs`) memunculkan error Node.JS / Crash.
**Penyebab:**
Aplikasi dipaksa berjalan namun ada variabel wajib (seperti Upstash Redis) yang kosong, sehingga Node.JS otomatis melakukan `process.exit(1)`.

**Solusi:**
Jalankan node index.js secara manual di terminal VPS untuk melihat error log secara persis. Perbaiki variabel yang diminta, dan coba kembali.
