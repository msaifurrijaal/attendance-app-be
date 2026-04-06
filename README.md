# 🕐 Attendance App — Backend

> REST API untuk aplikasi absensi karyawan WFH berbasis NestJS. Dirancang untuk memudahkan HR dalam memantau kehadiran karyawan dan mengelola data master secara efisien.

---

## 📋 Daftar Isi

- [Instalasi](#-instalasi)
- [Gambaran Aplikasi](#-gambaran-aplikasi)
- [Tech Stack](#-tech-stack)
- [Akun Bawaan](#-akun-bawaan)

---

## 🚀 Instalasi

### Langkah Instalasi

**1. Clone repository**

```bash
git clone <repo-url>
cd attendance-app-be
```

**2. Install dependencies**

```bash
npm install
```

**3. Konfigurasi environment**

Buat file `.env` di root project:

```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=attendance_app      # sesuaikan dengan nama database Anda

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=1d
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_REFRESH_EXPIRES_IN=7d

# App
APP_URL=http://localhost:3000
PORT=3000
```

> ⚠️ Pastikan nilai `JWT_SECRET` dan `JWT_REFRESH_SECRET` menggunakan string yang kuat dan unik.

**4. Buat database**

```sql
CREATE DATABASE attendance_app;
```

> Sesuaikan nama database dengan nilai `DB_NAME` di file `.env`.

**5. Jalankan migrasi**

```bash
npm run typeorm migration:run
```

**6. Jalankan seeder**

```bash
npm run seed
```

> Seeder akan membuat data awal untuk **roles**, **departments**, dan **users**. Lihat bagian [Akun Bawaan](#-akun-bawaan) untuk detail kredensial.

**7. Jalankan aplikasi**

```bash
# Development
npm run start:dev

# Production
npm run start:prod
```

Aplikasi akan berjalan di `http://localhost:3000`

Dokumentasi Swagger tersedia di `http://localhost:3000/docs`

---

## 🌟 Gambaran Aplikasi

Attendance App adalah sistem absensi berbasis web untuk karyawan yang bekerja dari rumah (WFH). Aplikasi ini memiliki dua peran utama: **Admin HR** dan **Employee**.

### Fitur Utama

- 🔐 **Autentikasi & Otorisasi**
  - Login dengan JWT Access Token & Refresh Token
  - Role-based access control (RBAC) — Admin HR dan Employee

- 👤 **Manajemen Karyawan** *(Admin HR)*
  - CRUD data karyawan lengkap dengan foto profil
  - Filter berdasarkan department dan pencarian nama
  - Export data karyawan ke Excel
  - Update password karyawan

- 🏢 **Manajemen Department** *(Admin HR)*
  - CRUD department
  - Soft delete — data tidak hilang permanen
  - Filter dan pencarian

- ✅ **Absensi Karyawan**
  - Check-in dengan upload foto sebagai bukti WFH
  - Check-out dengan upload foto
  - Timestamp otomatis dalam format UTC
  - Riwayat absensi dengan filter tanggal

- 📊 **Monitoring Absensi** *(Admin HR)*
  - Lihat semua absensi karyawan
  - Filter berdasarkan karyawan, department, dan rentang tanggal
  - Export data absensi ke Excel

- 📁 **Upload File**
  - Upload foto profil dan foto absensi
  - Validasi tipe file (jpg, jpeg, png, webp) dan ukuran maksimal 2MB
  - File disimpan di internal storage server

---

## 🛠 Tech Stack

| Teknologi | Keterangan |
|-----------|------------|
| **NestJS** | Framework utama backend |
| **TypeORM** | ORM untuk database |
| **MySQL** | Database |
| **JWT** | Autentikasi |
| **Multer** | Upload file |
| **Swagger** | Dokumentasi API |
| **bcrypt** | Enkripsi password |

---

## 👥 Akun Bawaan

Setelah menjalankan seeder, tersedia akun berikut:

| Nama | Email | Password | Role | Department |
|------|-------|----------|------|------------|
| Admin HR | `adminhr@mail.com` | `admin123` | Admin HR | Human Resource |
| Developer Backend | `devbe@mail.com` | `employee123` | Employee | Information Technology |
| Developer Frontend | `devfe@mail.com` | `employee123` | Employee | Information Technology |

> 💡 Anda dapat melihat detail lengkap data seeder di folder `src/database/seeders/`.


---

<div align="center">
  <p>Made with ❤️ using NestJS</p>
</div>