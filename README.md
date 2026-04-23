# Dishlab Backend

Backend API untuk aplikasi Dishlab. Project ini dibuat dengan `Express` dan `Prisma`, memakai database `PostgreSQL`, serta menyediakan REST API untuk mengelola data resep, bahan, dan langkah memasak.

## Fitur

- REST API untuk resep
- Validasi request dengan middleware
- Struktur modular: `routes`, `controllers`, `middlewares`, `utils`
- PostgreSQL dengan `UUID` dan relasi tabel
- Prisma ORM untuk schema dan migration
- JSON response yang konsisten
- Support pagination, search, filter, dan sorting

## Tech Stack

- Node.js
- Express
- Prisma
- PostgreSQL
- CORS
- dotenv

## Struktur Folder

```text
dishlab-be/
|-- config/
|   |-- prisma.client.js
|-- prisma/
|   |-- migrations/
|   |-- schema.prisma
|-- src/
|   |-- controllers/
|   |-- middlewares/
|   |-- routes/
|   |-- utils/
|   |-- index.js
|-- .env.example
|-- .gitignore
|-- package.json
|-- README.md
```

## Endpoint

Base URL:

```text
http://localhost:3000/api/recipes
```

Available endpoints:

- `GET /api/recipes`
- `GET /api/recipes/:id`
- `POST /api/recipes`
- `DELETE /api/recipes/:id`

## Query Parameter

Untuk `GET /api/recipes`, tersedia query berikut:

- `page`
- `limit`
- `search`
- `category`
- `kesulitan`
- `sort`

Contoh:

```http
GET /api/recipes?page=1&limit=6&search=nasi&category=food&kesulitan=mudah&sort=latest
```

## Format Request `POST /api/recipes`

```json
{
  "nama": "Nasi Goreng",
  "deskripsi": "Nasi goreng sederhana",
  "category": "food",
  "kesulitan": "mudah",
  "waktu_masak": 15,
  "porsi": 2,
  "gambar": "nasi-goreng.jpg",
  "ingredients": [
    {
      "nama": "Nasi",
      "jumlah": "1",
      "satuan": "piring"
    }
  ],
  "steps": [
    {
      "urutan": 1,
      "deskripsi": "Panaskan wajan"
    }
  ]
}
```

## Validasi Request

Middleware validasi akan menolak request jika:

- `nama`, `category`, atau `kesulitan` kosong
- `ingredients` bukan array atau jumlahnya kurang dari 1
- ada bahan tanpa `nama`
- `steps` bukan array atau jumlahnya kurang dari 1
- ada langkah tanpa `deskripsi`
- `waktu_masak` atau `porsi` bukan angka valid atau bernilai negatif

## Instalasi

### 1. Clone repository

```bash
git clone https://github.com/ltnzz/dishlab-be.git
cd dishlab-be
```

### 2. Install dependency

```bash
npm install
```

### 3. Buat file `.env`

Salin dari file contoh:

```bash
cp .env.example .env
```

Lalu isi `.env` seperti ini:

```env
PORT=3000
FE_ORIGIN=http://localhost:5173
DATABASE_URL="postgresql://postgres:password@localhost:5432/dishlab_db?schema=public"
```

Keterangan:

- `PORT`: port backend
- `FE_ORIGIN`: origin frontend yang diizinkan oleh CORS
- `DATABASE_URL`: koneksi PostgreSQL untuk Prisma

## Setup Database PostgreSQL

### Opsi A: lewat pgAdmin atau GUI

1. Buka PostgreSQL atau pgAdmin
2. Buat database baru dengan nama misalnya `dishlab_db`
3. Pastikan username, password, host, dan port sesuai dengan `DATABASE_URL`

### Opsi B: lewat SQL

Masuk ke PostgreSQL lalu jalankan:

```sql
CREATE DATABASE dishlab_db;
```

## Setup Prisma

Setelah database dan `.env` siap, jalankan langkah berikut.

### 1. Generate Prisma Client

```bash
npx prisma generate
```

### 2. Jalankan migration

Untuk development:

```bash
npx prisma migrate dev
```

Untuk server deployment:

```bash
npx prisma migrate deploy
```

### 3. Cek database via Prisma Studio

```bash
npx prisma studio
```

## Menjalankan Server

Mode development:

```bash
npm run dev
```

Mode production atau normal:

```bash
npm start
```

Jika berhasil, server akan berjalan di:

```text
http://localhost:3000
```

## Test Endpoint Cepat

### Health check

```http
GET /
```

Response:

```text
Hello, World!
```

### Ambil semua resep

```http
GET /api/recipes
```

## Catatan

- Jangan commit file `.env`
- Pastikan PostgreSQL aktif sebelum menjalankan migration
- Jika schema berubah, jalankan ulang migration atau `prisma db push` sesuai kebutuhan
- Project ini memakai relasi Prisma untuk tabel `recipes`, `ingredients`, dan `steps`

## Scripts

```bash
npm run dev
npm start
npm run format
```
