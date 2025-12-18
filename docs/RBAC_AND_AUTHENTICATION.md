# 🔐 RBAC & Authentication Guide - POS01 System

**Last Updated:** December 18, 2025  
**System:** POS01 REST API  
**Authentication:** JWT (JSON Web Token)

---

## 📋 Table of Contents

1. [Role-Based Access Control (RBAC) Overview](#role-based-access-control-rbac-overview)
2. [Available Roles & Permissions](#available-roles--permissions)
3. [How to Create Superadmin Account](#how-to-create-superadmin-account)
4. [Login Process for Each Role](#login-process-for-each-role)
5. [JWT Token Management](#jwt-token-management)
6. [Endpoint Permission Matrix](#endpoint-permission-matrix)
7. [Common Authentication Scenarios](#common-authentication-scenarios)
8. [Testing RBAC](#testing-rbac)

---

## 🔐 Role-Based Access Control (RBAC) Overview

POS01 menggunakan **3-tier RBAC system** untuk mengontrol akses ke API endpoints:

### System Architecture
```
┌─────────────────────────────────────────────┐
│         JWT Token Authentication            │
│  (Validates identity & loads user info)     │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│      RBAC Middleware (Role Check)           │
│  (Checks if user role has permission)       │
└─────────────────┬───────────────────────────┘
                  │
                  ↓
┌─────────────────────────────────────────────┐
│         Protected Endpoint Access           │
│    (Execute business logic if allowed)      │
└─────────────────────────────────────────────┘
```

### How It Works

1. **User logs in** → Receives JWT token with role embedded
2. **Each API request** → Includes `Authorization: Bearer <token>` header
3. **Middleware validates** → Checks if token is valid & extracts role
4. **RBAC checks permission** → Compares user role vs required role
5. **Access granted/denied** → Execute endpoint or return 403 Forbidden

---

## 👥 Available Roles & Permissions

### **1. User Role** (`user`)
**Default role** assigned at registration.

✅ **Allowed Actions:**
- View own profile (`GET /api/v1/users/me`)
- Update own profile (`PUT /api/v1/users/:id` - own ID only)
- View all products (`GET /api/v1/products`)
- View all categories (`GET /api/v1/categories`)
- **Cannot create/update/delete** anything

**Use Case:** Regular app users, read-only access for public data.

---

### **2. Admin Role** (`admin`)
**Middle-tier administrative role.**

✅ **Allowed Actions:**
- **All User permissions** +
- Create/Update/Delete users (`POST/PUT/DELETE /api/v1/users`)
- Batch create users (`POST /api/v1/users/batch`)
- View audit logs (`GET /api/v1/audit-logs`)
- Cleanup old audit logs (`DELETE /api/v1/audit-logs/cleanup`)
- **Cannot:**
  - Change user roles (superadmin only)
  - Manage products/categories/stores
  - View analytics

**Use Case:** HR managers, user management team.

---

### **3. Superadmin Role** (`superadmin`)
**Full system access** - highest privilege level.

✅ **Allowed Actions:**
- **All Admin permissions** +
- **Change user roles** (`PUT /api/v1/users/:id/role`)
- **Full CRUD on:**
  - Products (`POST/PUT/DELETE /api/v1/products`)
  - Categories (`POST/PUT/DELETE /api/v1/categories`)
  - Stores (`POST/PUT/DELETE /api/v1/stores`)
  - Stock movements (`POST /api/v1/stock`)
- **Analytics & Reports:**
  - Revenue analytics (`GET /api/v1/analytics/revenue`)
  - Product analytics (`GET /api/v1/analytics/products`)
  - Transaction analytics (`GET /api/v1/analytics/transactions`)
- **Create transactions** (`POST /api/v1/transactions`)

**Use Case:** System administrators, business owners, top management.

---

## 🚀 How to Create Superadmin Account

### Method 1: Using Promote Script (Recommended)

**Step 1:** Register a regular user first
```bash
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Super Admin",
    "email": "superadmin@pos01.com",
    "password": "SuperSecure123!",
    "age": 30
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@pos01.com",
      "role": "user",  ← Default role
      "is_active": true
    },
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc..."
  }
}
```

**Step 2:** Promote user to superadmin using script
```bash
cd "/home/axels/GO Lang Project 01"
go run scripts/promote_user.go superadmin@pos01.com superadmin
```

**Output:**
```
✅ Successfully updated user:
   Email: superadmin@pos01.com
   Name: Super Admin
   Old Role: user
   New Role: superadmin

🔑 User can now login with updated role permissions!
```

**Step 3:** Login with superadmin account
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@pos01.com",
    "password": "SuperSecure123!"
  }'
```

**Response:**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "Super Admin",
      "email": "superadmin@pos01.com",
      "role": "superadmin",  ← Now superadmin!
      "is_active": true
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Method 2: Direct Database Edit (Advanced)

**Using SQLite CLI:**
```bash
sqlite3 goproject.db

# View users
SELECT id, name, email, role FROM users;

# Promote user with ID 1 to superadmin
UPDATE users SET role = 'superadmin' WHERE id = 1;

# Verify
SELECT id, name, email, role FROM users WHERE id = 1;

# Exit
.exit
```

---

### Method 3: Create Multiple Admins (Batch)

```bash
# Create superadmin
go run scripts/promote_user.go admin1@pos01.com superadmin

# Create regular admin
go run scripts/promote_user.go admin2@pos01.com admin

# Create another superadmin
go run scripts/promote_user.go owner@pos01.com superadmin
```

---

## 🔑 Login Process for Each Role

### **1. Login as User (Default)**

```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "MyPassword123",
    "age": 25
  }'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "MyPassword123"
  }'
```

**Accessible Endpoints:**
- ✅ `GET /api/v1/users/me` - View own profile
- ✅ `GET /api/v1/products` - View products
- ✅ `GET /api/v1/categories` - View categories
- ❌ Cannot create/update/delete anything

---

### **2. Login as Admin**

```bash
# Register as user first
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Manager",
    "email": "admin@pos01.com",
    "password": "AdminPass123!",
    "age": 35
  }'

# Promote to admin
go run scripts/promote_user.go admin@pos01.com admin

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pos01.com",
    "password": "AdminPass123!"
  }'
```

**Accessible Endpoints:**
- ✅ All User permissions
- ✅ `POST /api/v1/users` - Create users
- ✅ `PUT /api/v1/users/:id` - Update users
- ✅ `DELETE /api/v1/users/:id` - Delete users
- ✅ `GET /api/v1/audit-logs` - View audit logs
- ❌ Cannot change roles (superadmin only)
- ❌ Cannot manage products/categories/stores

---

### **3. Login as Superadmin**

```bash
# Register as user first
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Administrator",
    "email": "superadmin@pos01.com",
    "password": "SuperSecure123!",
    "age": 40
  }'

# Promote to superadmin
go run scripts/promote_user.go superadmin@pos01.com superadmin

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "superadmin@pos01.com",
    "password": "SuperSecure123!"
  }'
```

**Accessible Endpoints:**
- ✅ **ALL ENDPOINTS** - Full system access
- ✅ Change user roles
- ✅ Manage products/categories/stores
- ✅ View analytics
- ✅ Manage stock movements
- ✅ Create transactions

---

## 📝 JWT Token Management

### **Token Structure**

When you login, you receive 2 tokens:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJlbWFpbCI6InN1cGVyYWRtaW5AcG9zMDEuY29tIiwicm9sZSI6InN1cGVyYWRtaW4iLCJleHAiOjE3MzQ1MzI4MDB9.abc123",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTczNTEzNzYwMH0.def456"
}
```

**Access Token:**
- Used for API requests
- Expires in **15 minutes**
- Contains: `user_id`, `email`, `role`

**Refresh Token:**
- Used to get new access token
- Expires in **7 days**
- More secure, stored separately

### **How to Use Tokens**

**1. Include in every API request:**
```bash
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**2. Refresh expired access token:**
```bash
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }'
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### **Token Validation Process**

```
1. Extract token from: Authorization: Bearer <token>
   ↓
2. Verify signature using JWT secret
   ↓
3. Check expiration time
   ↓
4. Extract user_id and role from claims
   ↓
5. Load full user from database
   ↓
6. Check if user is active
   ↓
7. Attach user info to request context
   ↓
8. RBAC middleware checks role permission
   ↓
9. Execute endpoint or return 403 Forbidden
```

---

## 📊 Endpoint Permission Matrix

| Endpoint | User | Admin | Superadmin |
|----------|------|-------|------------|
| **Authentication** |
| `POST /api/v1/auth/register` | ✅ Public | ✅ Public | ✅ Public |
| `POST /api/v1/auth/login` | ✅ Public | ✅ Public | ✅ Public |
| `POST /api/v1/auth/refresh` | ✅ | ✅ | ✅ |
| `POST /api/v1/auth/logout` | ✅ | ✅ | ✅ |
| **Users** |
| `GET /api/v1/users/me` | ✅ | ✅ | ✅ |
| `GET /api/v1/users` | ❌ | ✅ | ✅ |
| `GET /api/v1/users/:id` | ❌ | ✅ | ✅ |
| `POST /api/v1/users` | ❌ | ✅ | ✅ |
| `POST /api/v1/users/batch` | ❌ | ✅ | ✅ |
| `PUT /api/v1/users/:id` | ⚠️ Own only | ✅ | ✅ |
| `DELETE /api/v1/users/:id` | ❌ | ✅ | ✅ |
| `PUT /api/v1/users/:id/role` | ❌ | ❌ | ✅ |
| `POST /api/v1/users/:id/activate` | ❌ | ✅ | ✅ |
| `POST /api/v1/users/:id/deactivate` | ❌ | ✅ | ✅ |
| **Products** |
| `GET /api/v1/products` | ✅ | ✅ | ✅ |
| `GET /api/v1/products/:id` | ✅ | ✅ | ✅ |
| `GET /api/v1/products/by-barcode/:barcode` | ✅ | ✅ | ✅ |
| `POST /api/v1/products` | ❌ | ❌ | ✅ |
| `POST /api/v1/products/batch` | ❌ | ❌ | ✅ |
| `PUT /api/v1/products/:id` | ❌ | ❌ | ✅ |
| `DELETE /api/v1/products/:id` | ❌ | ❌ | ✅ |
| **Categories** |
| `GET /api/v1/categories` | ✅ | ✅ | ✅ |
| `GET /api/v1/categories/:id` | ✅ | ✅ | ✅ |
| `POST /api/v1/categories` | ❌ | ❌ | ✅ |
| `PUT /api/v1/categories/:id` | ❌ | ❌ | ✅ |
| `DELETE /api/v1/categories/:id` | ❌ | ❌ | ✅ |
| **Stores** |
| `GET /api/v1/stores` | ✅ | ✅ | ✅ |
| `GET /api/v1/stores/:id` | ✅ | ✅ | ✅ |
| `POST /api/v1/stores` | ❌ | ❌ | ✅ |
| `PUT /api/v1/stores/:id` | ❌ | ❌ | ✅ |
| `DELETE /api/v1/stores/:id` | ❌ | ❌ | ✅ |
| **Transactions** |
| `GET /api/v1/transactions` | ❌ | ❌ | ✅ |
| `GET /api/v1/transactions/:id` | ❌ | ❌ | ✅ |
| `POST /api/v1/transactions` | ⚠️ | ⚠️ | ✅ |
| **Stock** |
| `GET /api/v1/stock` | ❌ | ❌ | ✅ |
| `POST /api/v1/stock` | ❌ | ❌ | ✅ |
| **Analytics** |
| `GET /api/v1/analytics/revenue` | ❌ | ❌ | ✅ |
| `GET /api/v1/analytics/products` | ❌ | ❌ | ✅ |
| `GET /api/v1/analytics/transactions` | ❌ | ❌ | ✅ |
| `GET /api/v1/analytics/kasir` | ❌ | ❌ | ✅ |
| **Audit Logs** |
| `GET /api/v1/audit-logs` | ❌ | ✅ | ✅ |
| `GET /api/v1/audit-logs/:id` | ❌ | ✅ | ✅ |
| `GET /api/v1/audit-logs/stats` | ❌ | ✅ | ✅ |
| `DELETE /api/v1/audit-logs/cleanup` | ❌ | ✅ | ✅ |
| **Health** |
| `GET /health` | ✅ Public | ✅ Public | ✅ Public |

**Legend:**
- ✅ = Full access
- ❌ = No access (403 Forbidden)
- ⚠️ = Conditional access (e.g., own resources only)
- 🌐 Public = No authentication required

---

## 🎯 Common Authentication Scenarios

### **Scenario 1: First Time Setup**

```bash
# 1. Start server
cd "/home/axels/GO Lang Project 01/cmd/api"
go run main.go

# 2. Register first user
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Admin",
    "email": "admin@pos01.com",
    "password": "AdminPass123!",
    "age": 30
  }'

# 3. Promote to superadmin
cd ..
go run scripts/promote_user.go admin@pos01.com superadmin

# 4. Login as superadmin
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pos01.com",
    "password": "AdminPass123!"
  }' | jq '.data.access_token' -r

# 5. Save token to variable
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pos01.com","password":"AdminPass123!"}' \
  | jq -r '.data.access_token')

# 6. Test superadmin access
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN"
```

---

### **Scenario 2: Create Team Members**

```bash
# Login as superadmin first
TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pos01.com","password":"AdminPass123!"}' \
  | jq -r '.data.access_token')

# Create HR manager (admin role)
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "HR Manager",
    "email": "hr@pos01.com",
    "password": "HrPass123!",
    "age": 35
  }'

# Promote to admin
go run scripts/promote_user.go hr@pos01.com admin

# Create kasir/cashier (user role)
curl -X POST http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Kasir 1",
    "email": "kasir1@pos01.com",
    "password": "Kasir123!",
    "age": 25
  }'
# Note: kasir stays as "user" role (no promotion needed)
```

---

### **Scenario 3: Testing RBAC Permissions**

```bash
# Login as regular user
USER_TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kasir1@pos01.com","password":"Kasir123!"}' \
  | jq -r '.data.access_token')

# Try to create product (should fail - 403 Forbidden)
curl -X POST http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "barcode": "1234567890123",
    "base_price": 10000,
    "cost_price": 7000,
    "stock": 100,
    "category_id": 1
  }'

# Response:
# {
#   "success": false,
#   "message": "forbidden: insufficient permissions"
# }

# Login as superadmin
ADMIN_TOKEN=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pos01.com","password":"AdminPass123!"}' \
  | jq -r '.data.access_token')

# Try to create product (should succeed - 201 Created)
curl -X POST http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "barcode": "1234567890123",
    "base_price": 10000,
    "cost_price": 7000,
    "stock": 100,
    "category_id": 1
  }'
```

---

### **Scenario 4: Token Expiration & Refresh**

```bash
# Login
RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pos01.com","password":"AdminPass123!"}')

# Extract tokens
ACCESS_TOKEN=$(echo $RESPONSE | jq -r '.data.access_token')
REFRESH_TOKEN=$(echo $RESPONSE | jq -r '.data.refresh_token')

# Use access token (works)
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Wait 16 minutes (access token expires after 15 minutes)
# Try to use expired access token (fails - 401 Unauthorized)
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $ACCESS_TOKEN"

# Refresh to get new access token
NEW_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d "{\"refresh_token\":\"$REFRESH_TOKEN\"}")

NEW_ACCESS_TOKEN=$(echo $NEW_RESPONSE | jq -r '.data.access_token')

# Use new access token (works)
curl -X GET http://localhost:8080/api/v1/users/me \
  -H "Authorization: Bearer $NEW_ACCESS_TOKEN"
```

---

## 🧪 Testing RBAC

### **Quick Test Script**

Save as `test_rbac.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:8080/api/v1"

echo "🧪 Testing RBAC Permissions"
echo "=============================="

# 1. Login as regular user
echo ""
echo "1️⃣ Testing User Role..."
USER_TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"kasir1@pos01.com","password":"Kasir123!"}' \
  | jq -r '.data.access_token')

echo "   ✅ Can view products:"
curl -s -X GET $BASE_URL/products \
  -H "Authorization: Bearer $USER_TOKEN" \
  | jq '.success'

echo "   ❌ Cannot create product:"
curl -s -X POST $BASE_URL/products \
  -H "Authorization: Bearer $USER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test"}' \
  | jq '.message'

# 2. Login as admin
echo ""
echo "2️⃣ Testing Admin Role..."
ADMIN_TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"hr@pos01.com","password":"HrPass123!"}' \
  | jq -r '.data.access_token')

echo "   ✅ Can view users:"
curl -s -X GET $BASE_URL/users \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  | jq '.success'

echo "   ❌ Cannot change roles:"
curl -s -X PUT $BASE_URL/users/1/role \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"superadmin"}' \
  | jq '.message'

# 3. Login as superadmin
echo ""
echo "3️⃣ Testing Superadmin Role..."
SUPERADMIN_TOKEN=$(curl -s -X POST $BASE_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pos01.com","password":"AdminPass123!"}' \
  | jq -r '.data.access_token')

echo "   ✅ Can create product:"
curl -s -X POST $BASE_URL/products \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "RBAC Test Product",
    "barcode": "9999999999999",
    "base_price": 50000,
    "cost_price": 30000,
    "stock": 50,
    "category_id": 1
  }' \
  | jq '.success'

echo "   ✅ Can change roles:"
curl -s -X PUT $BASE_URL/users/2/role \
  -H "Authorization: Bearer $SUPERADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"admin"}' \
  | jq '.success'

echo ""
echo "=============================="
echo "✅ RBAC Test Complete!"
```

**Run:**
```bash
chmod +x test_rbac.sh
./test_rbac.sh
```

---

## 🔒 Security Best Practices

### **1. Password Requirements**
```
✅ Minimum 8 characters
✅ Include uppercase (A-Z)
✅ Include lowercase (a-z)
✅ Include numbers (0-9)
✅ Special characters recommended (!@#$%^&*)
```

### **2. Token Storage**
```
✅ Store access_token in memory (React state, Zustand)
✅ Store refresh_token in httpOnly cookie (safer)
❌ Never store tokens in localStorage (XSS risk)
❌ Never log tokens to console
```

### **3. Role Change Audit**
```
✅ All role changes logged in audit_logs table
✅ Include: who changed, old role, new role, timestamp
✅ Only superadmin can change roles
✅ Email notification sent on role change
```

### **4. Token Expiration**
```
Access Token:  15 minutes (short-lived)
Refresh Token: 7 days (long-lived)
Session: Ends on logout or refresh token expiry
```

---

## 📚 Additional Resources

- **Full API Documentation:** `/docs/API_ENDPOINTS.md`
- **Next.js Integration:** `/docs/NEXTJS_QUICK_REFERENCE.md`
- **Copilot Prompt:** `/docs/NEXTJS_COPILOT_PROMPT.md`
- **System Architecture:** `/docs/POS_DOCUMENTATION.md`

---

## 🎯 Quick Reference Commands

### **Create Superadmin:**
```bash
go run scripts/promote_user.go <email> superadmin
```

### **Create Admin:**
```bash
go run scripts/promote_user.go <email> admin
```

### **Downgrade to User:**
```bash
go run scripts/promote_user.go <email> user
```

### **Check User Role:**
```bash
sqlite3 goproject.db "SELECT email, role FROM users WHERE email='<email>';"
```

### **List All Users:**
```bash
# Login as admin/superadmin first
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer <token>"
```

---

**🎉 You're now ready to manage roles and permissions in POS01!**

For frontend implementation, see `NEXTJS_COPILOT_PROMPT.md` for complete role-based UI rendering examples.
