# API Motorbike Repair Shop Management

Ini adalah *backend* API untuk Aplikasi Manajemen Bengkel Motor. Proyek ini dibangun menggunakan Node.js, Express, dan Prisma ORM dengan database MySQL.

## Fitur Utama

- **Otentikasi Pengguna**: Sistem registrasi dan login yang aman menggunakan JWT (JSON Web Tokens) dan algoritma bcrypt untuk enkripsi kata sandi.
- **Manajemen Mekanik (dengan Sistem Perangkingan)**: Mengelola data mekanik dan menilai kinerjanya. Aplikasi ini menerapkan algoritma **MEREC** dan **MOORA** untuk mengevaluasi dan merutkan (merangking) mekanik terbaik berdasarkan rekam jejak layanannya.
- **Manajemen Inventaris Barang (Sparepart)**: Mengelola katalog suku cadang, melacak ketersediaan stok, dan menetapkan harga barang.
- **Pemrosesan Pesanan (Order)**: Menangani berbagai tipe pesanan, baik itu pembelian *sparepart* langsung (`transaction`) maupun pesanan perbaikan motor oleh mekanik (`services`). Sistem secara otomatis akan menghitung total biaya, mengurangi stok barang yang terpakai, serta mencatat waktu kejadian menggunakan zona waktu Indonesia (WIB).
- **Caching**: Memanfaatkan Redis untuk pengoptimalan performa dan caching data.
- **Logging & Manajemen File**: Dilengkapi dengan Winston untuk mencatat aktivitas (*logging*) sistem dan `express-fileupload` untuk penanganan unggahan file, seperti foto mekanik atau barang.

## Teknologi yang Digunakan

- **Runtime**: Node.js
- **Framework**: Express.js
- **ORM**: Prisma (Prisma Client)
- **Database**: MySQL
- **Validasi Data**: Joi
- **Testing**: Jest & Supertest
- **Caching**: Redis
- **Keamanan**: JsonWebToken (JWT), bcrypt

## Prasyarat

Sebelum menjalankan aplikasi, pastikan Anda telah menginstal beberapa sistem berikut di perangkat Anda:
- Node.js (direkomendasikan versi 18 atau lebih baru)
- MySQL Server (sudah berjalan)
- Redis Server (sudah berjalan)

## Panduan Instalasi & Menjalankan Aplikasi

1. Clone repositori ini dan masuk ke direktori proyek:
   ```bash
   cd api-motorbike-repairshop-management-application
   ```

2. Install semua dependensi yang dibutuhkan:
   ```bash
   npm install
   ```

3. Konfigurasi Variabel Lingkungan (*Environment Variables*):
   Buat file `.env` di *root* direktori dan atur variabel yang diperlukan, termasuk:
   - `DATABASE_URL` (Koneksi ke database MySQL)
   - Konfigurasi JWT Secret
   - Konfigurasi host dan port Redis

4. Sinkronisasi Database menggunakan Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
   *(Atau gunakan `npx prisma migrate dev` jika Anda mengembangkan skema baru)*

5. Jalankan aplikasi:
   ```bash
   node index.js
   ```

## Menjalankan Pengujian (Testing)

Aplikasi ini dilengkapi dengan sekumpulan *unit testing* dan *integration testing* menggunakan Jest. Untuk menjalankannya, gunakan perintah:

```bash
npm run test
```

## Struktur Folder Utama

- `src/controller/` : Menangani proses penerimaan *HTTP request* dan membalas dengan *response*.
- `src/service/` : Berisi inti *business logic* aplikasi (seperti logika transaksi, algoritma perankingan, penjadwalan, dll).
- `src/validation/` : Skema validasi data menggunakan Joi untuk memastikan *request* yang masuk telah sesuai.
- `src/error/` : *Class* untuk menyeragamkan format *error response*.
- `src/application/` : Konfigurasi global aplikasi termasuk koneksi database, integrasi middleware, log, dll.
- `prisma/` : Konfigurasi skema database (`schema.prisma`).
- `src/test/` : Direktorium penyimpanan seluruh *test script*.
