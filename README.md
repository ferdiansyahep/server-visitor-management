# Vigi-Gate Server

Backend API untuk sistem visitor management berbasis Express, Prisma, PostgreSQL, dan Gemini AI.

## Fitur

- CRUD data visitor.
- Perhitungan status risiko otomatis berdasarkan jam kunjungan dan frekuensi kunjungan harian.
- Ringkasan kunjungan menggunakan Gemini AI.
- Server-Sent Events untuk broadcast data visitor baru secara real-time.

## Teknologi

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- Google Gemini API

## Struktur Proyek

- `src/index.js` - entry point server.
- `src/routes/visitor.route.js` - daftar endpoint visitor.
- `src/controllers/visitor.controller.js` - handler request/response.
- `src/services/visitor.service.js` - logika bisnis, Prisma, dan Gemini.
- `prisma/schema.prisma` - schema database.

## Prasyarat

- Node.js 18+.
- PostgreSQL.
- API key Gemini.

## Instalasi

1. Install dependency:

   ```bash
   npm install
   ```

2. Siapkan file `.env`:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/vigi_gate"
   GEMINI_API_KEY="your_gemini_api_key"
   PORT=3000
   ```

3. Jalankan migrasi Prisma:

   ```bash
   npx prisma migrate dev
   ```

4. Generate Prisma Client jika diperlukan:

   ```bash
   npx prisma generate
   ```

## Menjalankan Aplikasi

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

## Endpoint API

Base URL: `/api`

- `GET /visitors` - ambil semua visitor.
- `POST /visitors` - buat visitor baru.
- `GET /visitors/:id` - ambil visitor berdasarkan ID.
- `DELETE /visitors/:id` - hapus visitor.
- `GET /ai-summary` - ringkasan kunjungan dari Gemini AI.
- `GET /stream` - koneksi SSE untuk menerima event visitor baru.

## Model Database

Tabel utama yang digunakan adalah `Visitor` dengan kolom:

- `id`
- `nama`
- `nik`
- `tujuan`
- `fotoUrl`
- `waktuMasuk`
- `statusRisiko`

## Catatan

- Jika `waktuMasuk` tidak dikirim saat membuat visitor, server akan mengisi waktu saat request dibuat.
- Status risiko dihitung otomatis dengan aturan waktu kunjungan dan jumlah kunjungan hari itu.