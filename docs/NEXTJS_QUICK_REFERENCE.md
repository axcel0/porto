# 📚 POS01 Dashboard - Quick Reference Guide

**For:** Next.js Developers  
**Last Updated:** December 18, 2025

---

## 🚀 Quick Start (5 minutes)

```bash
# 1. Create Next.js project
npx create-next-app@latest pos01-dashboard --typescript --tailwind --app

# 2. Install dependencies
npm install axios zustand react-hook-form zod @hookform/resolvers @shadcn/ui lucide-react recharts

# 3. Initialize ShadcnUI
npx shadcn-ui@latest init

# 4. Create folder structure
mkdir -p src/{app,components,lib,hooks,types,store,services,config}

# 5. Copy .env.example to .env.local
# Configure API URL and other variables

# 6. Start dev server
npm run dev
```

---

## 🔌 API Base URL

```typescript
// .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
```

---

## 📋 All Available Endpoints

### Authentication
```
POST   /auth/register          - Register new user
POST   /auth/login             - User login
POST   /auth/refresh           - Refresh access token
GET    /auth/profile           - Get user profile [Protected]
```

### Users
```
GET    /users                  - List users [Protected]
GET    /users/:id              - Get user [Protected]
GET    /users/me               - Get own profile [Protected]
GET    /users/stats            - User statistics [Protected]
POST   /users                  - Create user [Admin+]
POST   /users/batch            - Batch create [Admin+]
PUT    /users/:id              - Update user [Admin+]
PUT    /users/me               - Update own profile [Protected]
PUT    /users/me/password      - Change password [Protected]
PUT    /users/:id/role         - Change role [Superadmin]
DELETE /users/:id              - Delete user [Admin+]
```

### Products
```
GET    /products               - List products [Protected]
GET    /products/:id           - Get product [Protected]
GET    /products/by-barcode/:barcode  - Get by barcode [Protected]
GET    /products/low-stock     - Low stock items [Admin+]
POST   /products               - Create product [Admin+]
PUT    /products/:id           - Update product [Admin+]
DELETE /products/:id           - Delete product [Admin+]
```

### Categories
```
GET    /categories             - List categories [Protected]
GET    /categories/:id         - Get category [Protected]
POST   /categories             - Create [Admin+]
PUT    /categories/:id         - Update [Admin+]
DELETE /categories/:id         - Delete [Admin+]
```

### Stores
```
GET    /stores                 - List stores [Protected]
GET    /stores/:id             - Get store [Protected]
POST   /stores                 - Create [Superadmin]
PUT    /stores/:id             - Update [Superadmin]
DELETE /stores/:id             - Delete [Superadmin]
```

### Transactions
```
GET    /transactions           - List transactions [Protected]
GET    /transactions/:id       - Get transaction [Protected]
GET    /transactions/receipt/:number - Get receipt [Protected]
GET    /transactions/:id/receipt    - Get receipt by ID [Protected]
POST   /transactions           - Checkout/Create [Protected]
```

### Stock Management
```
GET    /stock/movements        - List movements [Protected]
GET    /stock/movements/product/:product_id - Product history [Protected]
POST   /stock/in               - Stock in [Admin+]
POST   /stock/adjust           - Stock adjust [Admin+]
```

### Analytics
```
GET    /analytics/daily        - Daily summary [Admin+]
GET    /analytics/summary      - Range summary [Admin+]
GET    /analytics/payments     - Payment breakdown [Admin+]
GET    /analytics/top-products - Top products [Admin+]
```

### Audit Logs
```
GET    /audit-logs             - List logs [Superadmin]
GET    /audit-logs/me          - My logs [Protected]
GET    /audit-logs/:id         - Get log [Superadmin]
GET    /audit-logs/stats       - Statistics [Superadmin]
DELETE /audit-logs/cleanup     - Cleanup old [Superadmin]
```

### Health
```
GET    /health                 - Health check
GET    /ready                  - Readiness check
GET    /metrics                - Prometheus metrics
```

---

## 🔐 Authentication Flow

### 1. Register
```typescript
const response = await api.post('/auth/register', {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePassword123!',
  age: 25,
});

localStorage.setItem('accessToken', response.data.data.access_token);
localStorage.setItem('refreshToken', response.data.data.refresh_token);
```

### 2. Login
```typescript
const response = await api.post('/auth/login', {
  email: 'john@example.com',
  password: 'SecurePassword123!',
});

localStorage.setItem('accessToken', response.data.data.access_token);
localStorage.setItem('refreshToken', response.data.data.refresh_token);
```

### 3. Use Token in Requests
```typescript
// Automatically added by axios interceptor
const config = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
};
```

### 4. Refresh Token
```typescript
const response = await api.post('/auth/refresh', {
  refresh_token: refreshToken,
});

localStorage.setItem('accessToken', response.data.data.access_token);
localStorage.setItem('refreshToken', response.data.data.refresh_token);
```

### 5. Logout
```typescript
localStorage.removeItem('accessToken');
localStorage.removeItem('refreshToken');
router.push('/auth/login');
```

---

## 📦 Request/Response Examples

### Register Request
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "age": 25
}
```

### Register Response (201)
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

### Create Product Request
```json
{
  "name": "Ember Plastik 5L",
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

### Checkout Request
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
  "notes": ""
}
```

### Checkout Response (201)
```json
{
  "status": "success",
  "message": "Transaction completed successfully",
  "data": {
    "transaction": {
      "id": 1,
      "transaction_number": "TXN-20251218-0001",
      "transaction_date": "2025-12-18T10:15:30Z",
      "subtotal": "45000.00",
      "total_amount": "45000.00",
      "payment_method": "cash",
      "items": [...]
    },
    "receipt": {...}
  }
}
```

---

## 🎨 Component Templates

### API Call Hook
```typescript
// hooks/useApi.ts
import { useState, useCallback } from 'react';
import { api } from '@/lib/api-client';

export function useApi<T>(
  request: () => Promise<T>,
  onSuccess?: (data: T) => void,
  onError?: (error: Error) => void
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await request();
      setData(result);
      onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err as Error;
      setError(error);
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { data, error, isLoading, execute };
}
```

### API Client Setup
```typescript
// lib/api-client.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          { refresh_token: refreshToken }
        );

        const { access_token } = response.data.data;
        localStorage.setItem('accessToken', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { api };
```

### Protected Route Wrapper
```typescript
// components/ProtectedRoute.tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string[];
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
    if (requiredRole && user && !requiredRole.includes(user.role)) {
      router.push('/dashboard');
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
```

### Auth Hook
```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  is_active: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // Fetch user profile
      api.get('/auth/profile')
        .then((res) => setUser(res.data.data))
        .catch(() => localStorage.clear())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return { user, isLoading, logout };
}
```

### Form Component Example
```typescript
// components/products/ProductForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TextArea } from '@/components/ui/textarea';

const schema = z.object({
  name: z.string().min(3).max(100),
  barcode: z.string().optional(),
  base_price: z.number().positive(),
  cost_price: z.number().positive(),
  stock: z.number().nonnegative(),
  category_id: z.number().positive(),
  store_id: z.number().positive(),
});

type FormData = z.infer<typeof schema>;

export function ProductForm({ onSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Product Name *</label>
        <Input {...register('name')} placeholder="Enter product name" />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label>Barcode</label>
        <Input {...register('barcode')} placeholder="EAN-13 barcode" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Base Price *</label>
          <Input
            {...register('base_price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="15000.00"
          />
        </div>

        <div>
          <label>Cost Price *</label>
          <Input
            {...register('cost_price', { valueAsNumber: true })}
            type="number"
            step="0.01"
            placeholder="8000.00"
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Product'}
      </Button>
    </form>
  );
}
```

---

## 🔄 Common Patterns

### Fetching List with Pagination
```typescript
const [page, setPage] = useState(1);
const { data: products, execute: fetchProducts } = useApi(() =>
  api.get('/products', { params: { page, limit: 20 } })
);

useEffect(() => {
  fetchProducts();
}, [page]);
```

### Handling Errors
```typescript
const { execute: createProduct } = useApi(
  () => api.post('/products', formData),
  (data) => {
    toast.success('Product created!');
    router.push('/dashboard/products');
  },
  (error) => {
    toast.error(error.message);
  }
);
```

### Form Validation with Zod
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
  name: z.string().min(3).max(100),
});

const form = useForm({ resolver: zodResolver(schema) });
```

---

## 🎯 Role-Based Rendering

```typescript
function AdminOnlyFeature() {
  const { user } = useAuth();
  
  if (!user || !['admin', 'superadmin'].includes(user.role)) {
    return null;
  }
  
  return <div>Admin feature here</div>;
}
```

---

## 📊 Data Table from ShadcnUI

```typescript
import { DataTable } from '@/components/ui/data-table';
import { ColumnDef } from '@tanstack/react-table';

const columns: ColumnDef<Product>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'base_price',
    header: 'Price',
    cell: ({ row }) => `Rp ${parseInt(row.getValue('base_price')).toLocaleString()}`,
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
    cell: ({ row }) => {
      const stock = row.getValue('stock') as number;
      return (
        <span className={stock < 10 ? 'text-red-500 font-bold' : ''}>
          {stock}
        </span>
      );
    },
  },
];

export function ProductTable() {
  const { data: products } = useApi(() => api.get('/products'));
  
  return <DataTable columns={columns} data={products || []} />;
}
```

---

## 🎨 Useful Tailwind Classes for POS

```typescript
// Currency formatting
<span className="font-mono font-semibold">
  Rp {price.toLocaleString('id-ID')}
</span>

// Stock status badges
<span className={stock < 10 ? 'text-red-500 font-bold' : 'text-green-500'}>
  {stock > 0 ? 'In Stock' : 'Out of Stock'}
</span>

// Transaction status
<span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
  Completed
</span>

// Admin badge
<span className="px-2 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded">
  ADMIN
</span>
```

---

## 🧪 Testing API Endpoints

### Using cURL
```bash
# Register
curl -X POST http://localhost:8080/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123!",
    "age": 25
  }'

# Login
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123!"
  }'

# List products (requires token)
curl -X GET http://localhost:8080/api/v1/products \
  -H "Authorization: Bearer {access_token}"
```

### Using Postman
1. Create POST request to `http://localhost:8080/api/v1/auth/login`
2. Add JSON body with email/password
3. Copy access_token from response
4. In next requests, add header: `Authorization: Bearer {token}`

### Using Swagger UI
Navigate to: `http://localhost:8080/swagger/index.html`

---

## 🚀 Deployment Checklist

- [ ] Update `NEXT_PUBLIC_API_URL` to production API
- [ ] Set `NODE_ENV=production`
- [ ] Build: `npm run build`
- [ ] Test build: `npm run start`
- [ ] Use HTTPS for API calls
- [ ] Enable secure cookies if using cookies for tokens
- [ ] Set up environment variables in deployment platform
- [ ] Test all authentication flows
- [ ] Test API calls with real data
- [ ] Check for console errors/warnings
- [ ] Verify responsive design
- [ ] Test role-based access on production

---

## 📞 Troubleshooting

### API Connection Error
```
Check:
1. Is the Go server running? (http://localhost:8080/health)
2. Is NEXT_PUBLIC_API_URL correct?
3. Is CORS enabled on backend?
4. Check network tab in DevTools
```

### 401 Unauthorized
```
Likely causes:
1. Token expired → Implement refresh logic
2. Token not sent → Check Authorization header
3. Invalid token → Log out and re-login
```

### CORS Error
```
Backend needs:
1. CORS middleware enabled
2. Correct origins configured
3. Credentials handling
```

### Build Errors
```
1. npm install (missing dependencies)
2. npx shadcn-ui@latest add {component} (missing UI components)
3. Check TypeScript errors: npx tsc --noEmit
```

---

## 🎓 Resources

- **Next.js Docs:** https://nextjs.org/docs
- **ShadcnUI:** https://ui.shadcn.com
- **TanStack Table:** https://tanstack.com/table
- **React Hook Form:** https://react-hook-form.com
- **Zod Validation:** https://zod.dev
- **Tailwind CSS:** https://tailwindcss.com

---

**Happy coding! 🎉**
