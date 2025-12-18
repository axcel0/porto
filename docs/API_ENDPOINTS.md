# 🔌 POS01 REST API - Complete Endpoint Reference

**API Base URL:** `http://localhost:8080/api/v1` (Development)  
**Production URL:** `https://api.pos01.com/api/v1`  
**API Version:** 1.0.0  
**Last Updated:** December 18, 2025

---

## 📋 Table of Contents

1. [Authentication Endpoints](#authentication-endpoints)
2. [User Management](#user-management)
3. [Product Management](#product-management)
4. [Category Management](#category-management)
5. [Store Management](#store-management)
6. [Transaction (Checkout)](#transaction-checkout)
7. [Stock Management](#stock-management)
8. [Analytics & Reports](#analytics--reports)
9. [Audit Logs](#audit-logs)
10. [Health & Monitoring](#health--monitoring)

---

## 🔐 Authentication Endpoints

### 1. Register New User
```http
POST /api/v1/auth/register
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "age": 25
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "is_active": true,
      "created_at": "2025-12-18T10:00:00Z"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Validation Rules:**
- `name`: Required, 3-100 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 8 characters, special char recommended
- `age`: Required, positive integer

**Status Codes:**
- `201` - User created successfully
- `400` - Validation error
- `409` - Email already registered

---

### 2. Login
```http
POST /api/v1/auth/login
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "is_active": true
    },
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Invalid credentials
- `401` - User not found
- `403` - User account disabled

---

### 3. Refresh Token
```http
POST /api/v1/auth/refresh
Content-Type: application/json
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIs...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Status Codes:**
- `200` - Token refreshed
- `400` - Invalid refresh token
- `401` - Refresh token expired

---

### 4. Get User Profile
```http
GET /api/v1/auth/profile
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "role": "user",
    "is_active": true,
    "created_at": "2025-12-18T10:00:00Z",
    "updated_at": "2025-12-18T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - Profile retrieved
- `401` - Unauthorized (missing/invalid token)

---

## 👥 User Management

### 1. List All Users
```http
GET /api/v1/users
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name/email
- `role` - Filter by role (user, admin, superadmin)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "role": "user",
        "is_active": true
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

---

### 2. Get User by ID
```http
GET /api/v1/users/:id
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `id` - User ID (integer)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "role": "user",
    "is_active": true,
    "created_at": "2025-12-18T10:00:00Z"
  }
}
```

**Status Codes:**
- `200` - User found
- `404` - User not found

---

### 3. Create User (Admin+)
```http
POST /api/v1/users
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Required Role:** Admin or Superadmin

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "SecurePassword123!",
  "age": 28,
  "role": "user"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "User created successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "user",
    "is_active": true
  }
}
```

---

### 4. Update User (Admin+)
```http
PUT /api/v1/users/:id
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Jane Smith Updated",
  "email": "jane.updated@example.com",
  "age": 29
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "User updated successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith Updated",
    "email": "jane.updated@example.com",
    "age": 29,
    "role": "user"
  }
}
```

---

### 5. Delete User (Admin+)
```http
DELETE /api/v1/users/:id
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "User deleted successfully"
}
```

---

### 6. Update User Role (Superadmin Only)
```http
PUT /api/v1/users/:id/role
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Required Role:** Superadmin

**Request Body:**
```json
{
  "role": "admin"
}
```

**Valid Roles:** `user`, `admin`, `superadmin`

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "User role updated successfully",
  "data": {
    "id": 2,
    "name": "Jane Smith",
    "email": "jane@example.com",
    "role": "admin"
  }
}
```

---

### 7. Get My Profile
```http
GET /api/v1/users/me
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 25,
    "role": "user"
  }
}
```

---

### 8. Update My Profile
```http
PUT /api/v1/users/me
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Updated",
  "age": 26
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "John Updated",
    "age": 26,
    "email": "john@example.com"
  }
}
```

---

### 9. Change Password
```http
PUT /api/v1/users/me/password
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "current_password": "OldPassword123!",
  "new_password": "NewPassword123!"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Password changed successfully"
}
```

---

### 10. Get User Statistics
```http
GET /api/v1/users/stats
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "total_users": 25,
    "active_users": 22,
    "inactive_users": 3,
    "by_role": {
      "user": 20,
      "admin": 4,
      "superadmin": 1
    }
  }
}
```

---

### 11. Batch Create Users (Admin+)
```http
POST /api/v1/users/batch
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "users": [
    {
      "name": "User 1",
      "email": "user1@example.com",
      "password": "Password123!",
      "age": 25,
      "role": "user"
    },
    {
      "name": "User 2",
      "email": "user2@example.com",
      "password": "Password123!",
      "age": 26,
      "role": "user"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Users created successfully",
  "data": {
    "created": 2,
    "failed": 0,
    "users": [...]
  }
}
```

---

## 📦 Product Management

### 1. List Products
```http
GET /api/v1/products
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `search` - Search by name/barcode
- `category_id` - Filter by category
- `store_id` - Filter by store
- `in_stock` - Filter by stock status (true/false)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Ember Plastik 5L",
        "barcode": "1234567890123",
        "base_price": "15000.00",
        "cost_price": "8000.00",
        "stock": 100,
        "category_id": 1,
        "category_name": "Ember",
        "store_id": 1,
        "status": "active",
        "created_at": "2025-12-18T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "pages": 8
    }
  }
}
```

---

### 2. Get Product by ID
```http
GET /api/v1/products/:id
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Ember Plastik 5L",
    "barcode": "1234567890123",
    "description": "Ember plastik warna biru 5 liter",
    "base_price": "15000.00",
    "cost_price": "8000.00",
    "stock": 100,
    "low_stock_threshold": 10,
    "unit": "pcs",
    "status": "active",
    "category": {
      "id": 1,
      "name": "Ember"
    },
    "store": {
      "id": 1,
      "name": "Toko Plastik Jaya"
    }
  }
}
```

---

### 3. Get Product by Barcode (Scanner)
```http
GET /api/v1/products/by-barcode/:barcode
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `barcode` - Product barcode (string)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Ember Plastik 5L",
    "barcode": "1234567890123",
    "base_price": "15000.00",
    "stock": 100,
    "available": true
  }
}
```

**Status Codes:**
- `200` - Product found
- `404` - Product not found

---

### 4. Create Product (Admin+)
```http
POST /api/v1/products
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Required Role:** Admin or Superadmin

**Request Body:**
```json
{
  "name": "Ember Plastik 5 Liter",
  "barcode": "1234567890123",
  "description": "Ember plastik warna biru 5 liter",
  "base_price": 15000.00,
  "cost_price": 8000.00,
  "stock": 100,
  "low_stock_threshold": 10,
  "unit": "pcs",
  "category_id": 1,
  "store_id": 1
}
```

**Validation Rules:**
- `name`: Required, 3-100 characters
- `barcode`: Optional, unique, EAN-13 format
- `base_price`: Required, > 0, decimal
- `cost_price`: Required, > 0, decimal
- `stock`: Required, >= 0, integer
- `category_id`: Required, must exist
- `store_id`: Required, must exist

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Product created successfully",
  "data": {
    "id": 1,
    "name": "Ember Plastik 5 Liter",
    "barcode": "1234567890123",
    "base_price": "15000.00",
    "cost_price": "8000.00",
    "stock": 100,
    "status": "active"
  }
}
```

---

### 5. Update Product (Admin+)
```http
PUT /api/v1/products/:id
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Ember Plastik 5 Liter - Updated",
  "base_price": 16000.00,
  "stock": 95
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Product updated successfully",
  "data": {
    "id": 1,
    "name": "Ember Plastik 5 Liter - Updated",
    "base_price": "16000.00",
    "stock": 95
  }
}
```

---

### 6. Delete Product (Admin+)
```http
DELETE /api/v1/products/:id
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Product deleted successfully"
}
```

---

### 7. Get Low Stock Products (Admin+)
```http
GET /api/v1/products/low-stock
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `store_id` - Filter by store

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": 1,
        "name": "Ember Plastik 5L",
        "stock": 5,
        "low_stock_threshold": 10,
        "status": "low_stock"
      }
    ],
    "total": 8
  }
}
```

---

## 🏷️ Category Management

### 1. List Categories
```http
GET /api/v1/categories
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `store_id` - Filter by store

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Ember",
        "description": "Produk ember plastik",
        "store_id": 1
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15
    }
  }
}
```

---

### 2. Get Category by ID
```http
GET /api/v1/categories/:id
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Ember",
    "description": "Produk ember plastik",
    "store_id": 1,
    "created_at": "2025-12-18T10:00:00Z"
  }
}
```

---

### 3. Create Category (Admin+)
```http
POST /api/v1/categories
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Ember",
  "description": "Produk ember plastik",
  "store_id": 1
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Category created successfully",
  "data": {
    "id": 1,
    "name": "Ember",
    "description": "Produk ember plastik",
    "store_id": 1
  }
}
```

---

### 4. Update Category (Admin+)
```http
PUT /api/v1/categories/:id
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Category updated successfully",
  "data": {...}
}
```

---

### 5. Delete Category (Admin+)
```http
DELETE /api/v1/categories/:id
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Category deleted successfully"
}
```

---

## 🏪 Store Management

### 1. List Stores
```http
GET /api/v1/stores
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "stores": [
      {
        "id": 1,
        "name": "Toko Plastik Jaya",
        "address": "Jl. Merdeka No. 123",
        "phone": "021-12345678",
        "email": "toko@example.com"
      }
    ]
  }
}
```

---

### 2. Get Store by ID
```http
GET /api/v1/stores/:id
Authorization: Bearer {access_token}
```

---

### 3. Create Store (Superadmin)
```http
POST /api/v1/stores
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Toko Plastik Jaya",
  "address": "Jl. Merdeka No. 123",
  "phone": "021-12345678",
  "email": "toko@example.com"
}
```

---

### 4. Update Store (Superadmin)
```http
PUT /api/v1/stores/:id
Authorization: Bearer {access_token}
Content-Type: application/json
```

---

### 5. Delete Store (Superadmin)
```http
DELETE /api/v1/stores/:id
Authorization: Bearer {access_token}
```

---

## 🛒 Transaction (Checkout)

### 1. Checkout / Create Transaction
```http
POST /api/v1/transactions
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "store_id": 1,
  "items": [
    {
      "product_id": 1,
      "quantity": 2
    },
    {
      "product_id": 2,
      "quantity": 1
    }
  ],
  "payment_method": "cash",
  "notes": "Customer paid with Rp 100,000"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Transaction completed successfully",
  "data": {
    "transaction": {
      "id": 1,
      "transaction_number": "TXN-20251218-0001",
      "store_id": 1,
      "user_id": 1,
      "transaction_date": "2025-12-18T10:15:30Z",
      "subtotal": "45000.00",
      "discount_amount": "0.00",
      "tax_amount": "0.00",
      "total_amount": "45000.00",
      "payment_method": "cash",
      "payment_status": "completed",
      "items": [
        {
          "product_id": 1,
          "product_name": "Ember Plastik 5 Liter",
          "quantity": 2,
          "unit_price": "15000.00",
          "subtotal": "30000.00"
        },
        {
          "product_id": 2,
          "product_name": "Sapu Lidi",
          "quantity": 1,
          "unit_price": "15000.00",
          "subtotal": "15000.00"
        }
      ],
      "kasir": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    },
    "receipt": {
      "store_name": "Toko Plastik Jaya",
      "store_address": "Jl. Merdeka No. 123",
      "store_phone": "021-12345678",
      "transaction_number": "TXN-20251218-0001",
      "date": "18 Dec 2025 10:15",
      "kasir": "John Doe",
      "items": [
        {
          "name": "Ember Plastik 5 Liter",
          "quantity": 2,
          "unit_price": "15,000",
          "subtotal": "30,000"
        }
      ],
      "subtotal": "45,000",
      "discount": "0",
      "tax": "0",
      "total": "45,000",
      "payment_method": "CASH"
    }
  }
}
```

**Validation Rules:**
- `store_id`: Required, must exist
- `items`: Required, min 1 item
- `items[].product_id`: Required, must exist, in stock
- `items[].quantity`: Required, > 0, available stock
- `payment_method`: Required, one of: cash, debit, credit

**Status Codes:**
- `201` - Transaction created
- `400` - Invalid request
- `422` - Insufficient stock

---

### 2. List Transactions
```http
GET /api/v1/transactions
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `store_id` - Filter by store
- `date_from` - Start date (YYYY-MM-DD)
- `date_to` - End date (YYYY-MM-DD)
- `payment_method` - Filter by payment method

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "transactions": [
      {
        "id": 1,
        "transaction_number": "TXN-20251218-0001",
        "transaction_date": "2025-12-18T10:15:30Z",
        "total_amount": "45000.00",
        "payment_method": "cash",
        "kasir_name": "John Doe"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

---

### 3. Get Transaction by ID
```http
GET /api/v1/transactions/:id
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "transaction_number": "TXN-20251218-0001",
    "transaction_date": "2025-12-18T10:15:30Z",
    "subtotal": "45000.00",
    "total_amount": "45000.00",
    "payment_method": "cash",
    "items": [...]
  }
}
```

---

### 4. Get Receipt by Transaction Number
```http
GET /api/v1/transactions/receipt/:number
Authorization: Bearer {access_token}
```

**Path Parameters:**
- `number` - Transaction number (e.g., TXN-20251218-0001)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "store_name": "Toko Plastik Jaya",
    "transaction_number": "TXN-20251218-0001",
    "date": "18 Dec 2025 10:15",
    "items": [...],
    "total": "45,000",
    "payment_method": "CASH"
  }
}
```

---

### 5. Get Receipt by ID
```http
GET /api/v1/transactions/:id/receipt
Authorization: Bearer {access_token}
```

---

## 📦 Stock Management

### 1. Stock In (Restok)
```http
POST /api/v1/stock/in
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Required Role:** Admin or Superadmin

**Request Body:**
```json
{
  "product_id": 1,
  "quantity": 50,
  "reason": "restok",
  "notes": "Pembelian dari supplier ABC"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Stock in successfully",
  "data": {
    "product_id": 1,
    "product_name": "Ember Plastik 5L",
    "old_stock": 100,
    "quantity": 50,
    "new_stock": 150,
    "created_at": "2025-12-18T10:30:00Z"
  }
}
```

---

### 2. Stock Adjustment
```http
POST /api/v1/stock/adjust
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "product_id": 1,
  "quantity_change": -5,
  "reason": "damage",
  "notes": "5 pcs rusak saat pengiriman"
}
```

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Stock adjusted successfully",
  "data": {
    "product_id": 1,
    "product_name": "Ember Plastik 5L",
    "old_stock": 100,
    "new_stock": 95,
    "change": -5,
    "reason": "damage"
  }
}
```

---

### 3. List Stock Movements
```http
GET /api/v1/stock/movements
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `product_id` - Filter by product
- `type` - Filter by type (in, out, adjustment)
- `date_from` - Start date
- `date_to` - End date

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "movements": [
      {
        "id": 1,
        "product_id": 1,
        "product_name": "Ember Plastik 5L",
        "type": "out",
        "quantity": 2,
        "old_stock": 100,
        "new_stock": 98,
        "reason": "sale",
        "created_at": "2025-12-18T10:15:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 500
    }
  }
}
```

---

### 4. Get Product Stock History
```http
GET /api/v1/stock/movements/product/:product_id
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "product_id": 1,
    "product_name": "Ember Plastik 5L",
    "current_stock": 98,
    "movements": [...]
  }
}
```

---

## 📊 Analytics & Reports

### 1. Daily Summary
```http
GET /api/v1/analytics/daily
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `date` - Date in YYYY-MM-DD format (default: today)
- `store_id` - Filter by store

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "date": "2025-12-18",
    "total_transactions": 25,
    "total_items_sold": 87,
    "total_revenue": "2450000.00",
    "total_profit": "1205000.00",
    "average_transaction": "98000.00",
    "payment_methods": {
      "cash": 18,
      "debit": 5,
      "credit": 2
    },
    "top_products": [
      {
        "product_id": 1,
        "product_name": "Ember Plastik 5L",
        "quantity_sold": 32,
        "revenue": "480000.00"
      }
    ]
  }
}
```

---

### 2. Range Summary
```http
GET /api/v1/analytics/summary
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `date_from` - Start date (YYYY-MM-DD)
- `date_to` - End date (YYYY-MM-DD)
- `store_id` - Filter by store

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "period": {
      "from": "2025-12-01",
      "to": "2025-12-18"
    },
    "total_transactions": 450,
    "total_revenue": "12500000.00",
    "total_profit": "6200000.00",
    "average_daily_revenue": "694117.65",
    "days_count": 18,
    "growth_vs_previous_period": "15.5%"
  }
}
```

---

### 3. Payment Breakdown
```http
GET /api/v1/analytics/payments
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `date_from` - Start date
- `date_to` - End date
- `store_id` - Filter by store

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "payment_methods": {
      "cash": {
        "count": 300,
        "total": "8500000.00",
        "percentage": 68.0
      },
      "debit": {
        "count": 120,
        "total": "3500000.00",
        "percentage": 28.0
      },
      "credit": {
        "count": 30,
        "total": "500000.00",
        "percentage": 4.0
      }
    },
    "total_revenue": "12500000.00"
  }
}
```

---

### 4. Top Products
```http
GET /api/v1/analytics/top-products
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `date_from` - Start date
- `date_to` - End date
- `limit` - Number of products (default: 10)
- `store_id` - Filter by store

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "period": {
      "from": "2025-12-01",
      "to": "2025-12-18"
    },
    "top_products": [
      {
        "rank": 1,
        "product_id": 1,
        "product_name": "Ember Plastik 5L",
        "category": "Ember",
        "quantity_sold": 320,
        "revenue": "4800000.00",
        "profit": "2240000.00",
        "profit_margin": "46.67%"
      }
    ]
  }
}
```

---

## 📋 Audit Logs

### 1. Get My Audit Logs
```http
GET /api/v1/audit-logs/me
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "logs": [
      {
        "id": 1,
        "user_id": 1,
        "action": "login",
        "resource": "auth",
        "success": true,
        "created_at": "2025-12-18T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 50
    }
  }
}
```

---

### 2. Get All Audit Logs (Superadmin)
```http
GET /api/v1/audit-logs
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `page` - Page number
- `limit` - Items per page
- `user_id` - Filter by user
- `action` - Filter by action
- `resource` - Filter by resource
- `date_from` - Start date
- `date_to` - End date

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "logs": [...]
  }
}
```

---

### 3. Get Audit Log by ID (Superadmin)
```http
GET /api/v1/audit-logs/:id
Authorization: Bearer {access_token}
```

---

### 4. Get Audit Statistics (Superadmin)
```http
GET /api/v1/audit-logs/stats
Authorization: Bearer {access_token}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "total_logs": 5000,
    "by_action": {
      "login": 500,
      "logout": 500,
      "create": 1200,
      "update": 1500,
      "delete": 800,
      "checkout": 800
    },
    "by_resource": {
      "auth": 1000,
      "user": 600,
      "product": 1200,
      "transaction": 1000,
      "stock": 1200
    }
  }
}
```

---

### 5. Cleanup Old Logs (Superadmin)
```http
DELETE /api/v1/audit-logs/cleanup
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `days` - Delete logs older than X days (default: 90)

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Old logs cleaned up",
  "data": {
    "deleted": 150
  }
}
```

---

## 🏥 Health & Monitoring

### 1. Health Check
```http
GET /health
```

**Response (200 OK):**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-18T10:00:00Z",
  "components": {
    "database": {
      "status": "healthy",
      "message": "database is responsive"
    },
    "disk": {
      "status": "healthy",
      "message": "disk space is adequate"
    },
    "memory": {
      "status": "healthy",
      "message": "memory usage is normal"
    }
  }
}
```

---

### 2. Readiness Check
```http
GET /ready
```

**Response (200 OK):**
```json
{
  "status": "ready",
  "timestamp": "2025-12-18T10:00:00Z"
}
```

---

### 3. Prometheus Metrics
```http
GET /metrics
```

**Response:** Prometheus format metrics

---

## 🔑 Authentication Header

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer {access_token}
```

**Example:**
```bash
curl -X GET http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## 📝 Response Format

### Success Response
```json
{
  "status": "success",
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

---

## 🔄 Pagination

Paginated responses include:
```json
{
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

---

## 🔐 Token Expiration

- **Access Token:** 15 minutes
- **Refresh Token:** 7 days

Use the refresh endpoint to get a new access token when it expires.

---

## 📱 Error Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 400 | Bad Request | Validation error |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Business logic error |
| 500 | Internal Error | Server error |

---

**Last Updated:** December 18, 2025  
**API Version:** 1.0.0
