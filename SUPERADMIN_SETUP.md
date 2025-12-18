# 🔐 Cara Aktifkan Akun Superadmin

## Kenapa Perlu Superadmin?
- Register default role: **`user`** (akses terbatas)
- Superadmin punya **akses penuh** ke semua endpoint (CRUD products, stores, analytics, ubah role, dll)

## 🚀 Langkah Cepat

### 1. Register User Biasa Dulu
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@pos.local",
    "password": "SuperSecure123!",
    "age": 30
  }'
```

### 2. Promote Jadi Superadmin (Backend Script)
```bash
cd "/home/axels/GO Lang Project 01"
go run scripts/promote_user.go superadmin@pos.local superadmin
```

**Output:**
```
✅ Successfully updated user:
   Email: superadmin@pos.local
   Old Role: user
   New Role: superadmin
```

### 3. Login di Frontend
- Buka http://localhost:3000/auth/login
- Email: `superadmin@pos.local`
- Password: `SuperSecure123!`
- ✅ Sekarang role-nya **superadmin**, menu tambahan muncul!

---

## 🎯 3 Role di Sistem

| Role        | Akses                                              |
|-------------|---------------------------------------------------|
| **user**    | View products, categories, checkout, orders       |
| **admin**   | + User CRUD, audit logs                           |
| **superadmin** | + Product/Category/Store CRUD, Analytics, Role management |

---

## 📋 Alternatif: Edit Manual di Database (Dev Only)

**SQLite:**
```bash
sqlite3 goproject.db
UPDATE users SET role = 'superadmin' WHERE email = 'your@email.com';
.exit
```

**PostgreSQL/MySQL:**
```sql
UPDATE users SET role = 'superadmin' WHERE email = 'your@email.com';
```

---

## ✅ Verifikasi

Setelah login, di dashboard kamu akan lihat:
- Badge role: **SUPERADMIN**
- Menu tambahan:
  - User Management
  - Analytics
  - Stock Ops
  - Stores
  - Audit Logs
  - Role Settings

---

**Referensi lengkap:** `docs/RBAC_AND_AUTHENTICATION.md`
