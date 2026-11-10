# Tutorial 1: Konfigurasi Environment & Rename Identitas Web

Dokumen ini akan menjelaskan bagaimana cara mengatur nama website Anda dan mengkonfigurasi file `.env`.

## 1. File Konfigurasi .env
Terdapat **Dua (2)** file `.env` di dalam project ini:
1. File `.env` Utama (berada di folder paling luar/root). Ini untuk Backend.
2. File `.env` Nuxt (berada di dalam folder `nuxt/`). Ini khusus variabel publik untuk dirender ke halaman Frontend.

---

## 2. Cara Mengganti Nama Web & Identitas (Pengaturan Dasar)

Buka file `.env` utama di root project, lalu cari bagian ini:

```env
### App Identity
WEB_NAME=GantiDenganNamaTokoAnda
AUTHOR_NAME=NamaAnda

### Konfigurasi Domain
DOMAIN=https://domain-anda.com
ADMIN_EMAIL=email-utama-anda@gmail.com
```

Lalu buka file `nuxt/.env` (Di dalam folder nuxt), dan samakan data berikut:

```env
# Project Info
NUXT_PUBLIC_TITLE=GantiDenganNamaTokoAnda
NUXT_PUBLIC_DESCRIPTION=Deskripsi toko Anda untuk SEO Google.
NUXT_PUBLIC_BASE_URL=https://domain-anda.com
```

> **INFO PENTING**: Jika Anda menggunakan mode Development di komputer lokal, pastikan `DOMAIN` dan `NUXT_PUBLIC_BASE_URL` diset menggunakan `http://localhost:3000` (untuk API backend) agar tidak ada masalah koneksi.

---

## 3. Konfigurasi Kontak Admin

Kontak ini akan tampil di bagian Footer maupun Hubungi Kami di halaman depan.
Buka file `.env` utama, scroll ke bawah bagian `Contact Information`:

```env
NUXT_PUBLIC_CONTACT_WHATSAPP=628123456789  (Gunakan format 62 tanpa +)
NUXT_PUBLIC_CONTACT_TELEGRAM=UsernameTeleAnda (Tanpa @)
```

Jika semuanya sudah diganti, Anda diharuskan melakukan restart aplikasi agar konfigurasi yang baru bisa terbaca oleh sistem (`yarn dev` atau `npm run dev` harus dimatikan dengan CTRL+C dan dinyalakan ulang).
