# 🎟️ Event Ticketing System API

![Node.js](https://img.shields.io/badge/Node.js-24_LTS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma_7-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Sebuah RESTful API yang dirancang untuk menangani sistem pemesanan tiket bioskop/event. Proyek ini mendemonstrasikan penyelesaian masalah arsitektur _backend_ dunia nyata, seperti _high concurrency_ (war ticket), _background jobs_, dan integrasi _payment gateway_ (Midtran).

## ✨ Fitur Utama

1. **🛡️ Penanganan Race Condition (Konkurensi Tinggi)**
   Menggunakan **redis distributed lock (`SET NX EX`)** untuk memastikan bahwa ketika ribuan pengguna mencoba membeli kursi yang sama di milidetik yang sama, hanya satu pengguna yang berhasil mendapatkan "kunci" selama 10 menit.
2. **⏳ Delay Queue & Background Jobs (BullMQ)**
   Menggunakan **BullMQ + Redis** sebagai _message broker_. Sistem secara otomatis membatalkan pesanan (expired) dan melepaskan kunci kursi jika pengguna gagal menyelesaikan pembayaran tepat dalam 10 menit.
3. **💳 Integrasi Midtrans Core API & Webhook Security**
   Menerapkan _server-to-server_ API untuk menghasilkan nomor virtual account. Melindungi _endpoint_ webhook dari serangan manipulasi data (_spoofing_) menggunakan validasi kriptografi **HMAC SHA-512**.
4. **🔄 Idempotency pada Sistem Pembayaran**
   Mencegah penerbitan tiket ganda atau inkonsistensi data jika Midtrans mengirimkan _webhook_ yang sama berkali-kali akibat masalah jaringan.
5. **🏛️ Clean Architecture (Layered Pattern)**
   Struktur kode dipisahkan dengan ketat menjadi `Routes -> Controllers -> Services -> Repositories`, memastikan kode mudah diuji (_testable_) dan mudah dipelihara (_maintainable_).
6. **🔒 Keamanan Lanjutan**
   Menggunakan otentikasi **JWT** dan _Role-Based Access Control_ (RBAC), memastikan _Admin_ dan _User_ memiliki hak akses yang dipisahkan secara aman.

---

## 🛠️ Tech Stack Utama

- **Runtime & Languange:** Node.js (v24 LTS), TypeScript (ESM / NodeNext)
- **Framework:** Express.js
- **Database (SQL):** PostgreSQL + Prisma ORM 7 (menggunakan `@prisma/adapter-pg`)
- **In-Memory Cache & Message Broker:** Redis + BullMQ
- **Environment & Tooling:** Docker, Docker Compose, pnpm
- **Security:** bcrypt, jsonwebtoken, crypto (HMAC)

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### Prasyarat:

Pastikan Anda telah menginstal:

- [Node.js](https://nodejs.org/) (v24+)
- [pnpm](https://pnpm.io/)
- [Docker & Docker Compose](https://www.docker.com/) (atau Podman)

### Langkah Instalasi:

1. **Clone Repositori**

   ```bash
   git clone https://github.com/danielnalle/my-ticket-api.git
   cd my-ticket-api
   ```

2. **Setup Environment Variables**
   Duplikat file `.env.example` menjadi `.env` dan sesuaikan nilainya (terutama kredensial Midtrans Anda).

   ```bash
   cp .env.example .env
   ```

3. **Jalankan Database dan Redis menggunakan Docker**

   ```bash
   docker-compose up -d
   ```

4. **Instal Dependensi (Menggunakan pnpm)**

   ```bash
   pnpm install
   ```

5. **Jalankan Migrasi Database (Prisma)**
   Perintah ini akan membuat tabel di PostgreSQL dan meng-_generate_ Prisma Client.

   ```bash
   pnpm prisma migrate dev --name init
   pnpm prisma generate
   ```

6. **Jalankan Server Development**
   ```bash
   pnpm run dev
   ```
   Server akan berjalan di `http://localhost:3000` dan worker BullMQ akan otomatis memantau antrean.

---

## 📚 Dokumentasi API (Endpoints) (_On Progress_)

Daftar lengkap _request body_, _header_, dan simulasi alur dapat diakses melalui koleksi Postman yang telah disediakan:

[![Run in Postman](https://run.pstmn.io/button.svg)](URL_POSTMAN_COLLECTION_ANDA_NANTI)

**Ringkasan Endpoint:**

- `POST /api/users/register` - Mendaftar akun baru
- `POST /api/users/login` - Mendapatkan JWT Token
- `POST /api/events` - (Admin Only) Membuat event beserta _auto-generate_ status ratusan kursi secara _atomic_.
- `GET /api/events/:id` - Melihat detail event dan status kursi saat ini (_Available, Locked, Sold_)
- `POST /api/reservations/book` - Mengunci kursi (Redis Lock) & mendapatkan Virtual Account.
- `POST /api/webhooks/payment` - Endpoint aman untuk Midtrans memvalidasi pembayaran sukses.

---

## 🔮 Rencana Pengembangan Mendatang (Future Improvements)

Sebagai _Engineer_, saya menyadari bahwa sistem ini dapat terus dikembangkan untuk menangani skala yang lebih masif. Beberapa hal yang direncanakan untuk iterasi selanjutnya (V2):

1. **Automated Testing:** Menerapkan _Unit Testing_ & _Integration Testing_ menggunakan `Jest` dan `Supertest` dengan _mocking_ untuk Prisma dan Redis.
2. **Rate Limiting:** Mengimplementasikan IP/User Rate Limiting (misal maksimal 5 request per detik per user) untuk mencegah serangan bot (_Denial of Inventory_).
3. **Database Indexing:** Mengoptimalkan _query_ pencarian _Event_ berdasarkan waktu dan lokasi menggunakan Index di PostgreSQL.
