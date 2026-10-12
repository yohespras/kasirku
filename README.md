# KasirPintar - Modern Point of Sale (POS) & Inventaris Toko

Aplikasi Kasir POS modern, offline-ready (PWA), scan barcode kamera, cetak struk thermal, laporan keuangan, dan integrasi Google Sheets Cloud Database.

---

## 🚀 Cara Menjalankan & Mengonlinekan di GitHub Pages

Aplikasi ini sudah dilengkapi dengan **GitHub Actions Workflow** otomatis (`.github/workflows/deploy.yml`) dan konfigurasi jalur relatif (`base: './'`).

### Langkah 1: Buat Repositori di GitHub
1. Buka [github.com](https://github.com) dan login ke akun Anda.
2. Klik tombol **"New"** untuk membuat repositori baru.
3. Beri nama repositori, misalnya: `kasir-pintar` atau `pos-toko`.
4. Pilih **Public** (agar GitHub Pages gratis dapat aktif).
5. Klik **Create repository**.

### Langkah 2: Upload / Push Kode ke GitHub
Buka terminal di folder proyek ini dan jalankan perintah berikut:

```bash
git init
git add .
git commit -m "Initial commit KasirPintar POS"
git branch -M main
git remote add origin https://github.com/USERNAME/kasir-pintar.git
git push -u origin main
```
*(Ganti `USERNAME` dengan username GitHub Anda dan `kasir-pintar` dengan nama repositori Anda).*

### Langkah 3: Aktifkan GitHub Pages di Repositori
1. Buka repositori Anda di GitHub.
2. Klik menu **Settings** (Pengaturan) di bagian atas.
3. Di bilah sisi kiri, klik **Pages**.
4. Di bagian **Build and deployment > Source**, pilih:
   👉 **GitHub Actions**
5. GitHub Actions akan otomatis melakukan kompilasi (`npm run build`) dan menerbitkan website Anda.
6. Tunggu sekitar 1-2 menit, website kasir Anda langsung aktif secara online di:
   ```
   https://USERNAME.github.io/kasir-pintar/
   ```

---

## ⚡ Opsi Hosting Gratis Lainnya

### 1. Vercel (Rekomendasi Terbaik untuk Toko)
1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
2. Klik **"Add New Project"** dan pilih repositori `kasir-pintar`.
3. Vercel akan otomatis membaca file `vercel.json` bawaan.
4. Klik **Deploy**. Website kasir langsung live dengan domain kustom toko Anda!

### 2. Netlify (Drag and Drop Folder dist/)
1. Jalankan `npm run build` di komputer Anda.
2. Buka [app.netlify.com/drop](https://app.netlify.com/drop).
3. Tarik folder `dist/` ke browser. Website langsung aktif online!

---

## 🛠️ Menjalankan di Komputer Lokal

```bash
# 1. Install dependensi
npm install

# 2. Jalankan server lokal
npm run dev

# 3. Build produksi
npm run build
```

---

## ✨ Fitur Unggulan
* **Offline-First PWA:** Berjalan normal tanpa koneksi internet dengan database lokal.
* **Scan Barcode Kamera:** Mendeteksi barcode produk langsung menggunakan kamera HP / laptop.
* **Cetak Struk Thermal:** Format 58mm & 80mm siap cetak ke printer struk bluetooth atau USB.
* **Manajemen Pengguna & PIN Real:** Akun admin toko dan kasir dengan keamanan PIN/Password asli.
* **Database Google Sheets:** Sinkronisasi cloud riwayat transaksi real-time ke spreadsheet Anda.
