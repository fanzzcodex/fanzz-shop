# Tutorial 3: Panduan Deployment ke VPS (Ubuntu 20.04 / 22.04)

Dokumen ini menjelaskan cara mem-publish (deploy) web shop Anda ke server VPS menggunakan Node.js, PM2, dan Nginx Reverse Proxy.

## Prasyarat Server
- OS Linux Ubuntu 20.04 / 22.04.
- Git, Node.js (v18+), Yarn, dan Nginx sudah terinstall.
- Domain yang sudah dipointing ke IP VPS Anda (Contoh: `shop.domainanda.com`).

---

## Langkah 1: Persiapan Server

Buka terminal SSH Anda dan jalankan perintah dasar:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl nginx build-essential
```

Install Node.js (v18 atau v20):
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
sudo npm install -g yarn pm2
```

## Langkah 2: Clone & Build Aplikasi

1. Clone project dari Github/Gitlab Anda ke VPS (misalnya ke `/var/www/web-shop`).
   ```bash
   cd /var/www
   git clone https://github.com/UsernameAnda/repo-web-shop.git web-shop
   cd web-shop
   ```

2. Jalankan instalasi Node Modules untuk Backend.
   ```bash
   yarn install
   ```

3. Masuk ke folder Nuxt dan install dependencies Frontend, lalu Build (Generate).
   ```bash
   cd nuxt
   npm install
   npm run build
   # Atau jika Anda menggunakan mode SSR: npm run generate
   cd ..
   ```

## Langkah 3: Konfigurasi .env
Buat file `.env` di server Anda dengan kredensial Production sungguhan (Upstash, Xendit, SMTP, OAuth, dll).
Gunakan editor seperti `nano` atau `vim`:
```bash
nano .env
```
*(Lihat file `.env.example` atau panduan sebelumnya untuk apa saja yang harus diisi).*

**SANGAT PENTING**:
Pastikan `DOMAIN` diset ke URL live Anda (misal `https://shop.domainanda.com`) dan `PORT=3000`.

## Langkah 4: Menjalankan Aplikasi Menggunakan PM2
PM2 akan memastikan aplikasi Node.js hidup terus-menerus (bahkan jika server restart/crash).

```bash
# Di dalam folder root web-shop
pm2 start index.js --name "web-shop"
pm2 save
pm2 startup
```

Sekarang backend dan frontend app Anda berjalan di VPS, tepatnya di `localhost:3000`.

## Langkah 5: Konfigurasi Nginx & SSL (HTTPS)
Nginx bertugas membuka port 80 dan 443 ke publik dan meneruskannya ke port 3000.

Buat file konfigurasi Nginx:
```bash
sudo nano /etc/nginx/sites-available/web-shop
```

Isi dengan script ini (ganti `shop.domainanda.com` dengan domain asli Anda):
```nginx
server {
    server_name shop.domainanda.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # IP Forwarding untuk menangkap IP Real User
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Aktifkan profil Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/web-shop /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

**Install SSL (Sangat Wajib untuk Login & Payment):**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d shop.domainanda.com
```

Selesai. Website Anda sekarang sudah live.
