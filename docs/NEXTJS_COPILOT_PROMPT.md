# 🚀 GitHub Copilot Prompt - Next.js POS01 Admin Dashboard UI

**Project:** POS01 Admin Dashboard (Next.js + TypeScript)  
**API:** Go REST API with 50+ endpoints  
**Database:** SQLite/PostgreSQL  
**Status:** Ready for frontend development

---

## 📋 Project Overview

Build a production-ready admin dashboard for POS01 (Point of Sale System) using **Next.js 14+** with **TypeScript**, **Tailwind CSS**, and **ShadcnUI**. The dashboard should handle:

1. **Authentication** - Register, login, token refresh, JWT handling
2. **User Management** - Create, read, update, delete users with RBAC
3. **Product Management** - CRUD operations, barcode scanning, low stock alerts
4. **Category Management** - Organize products by categories
5. **Store Management** - Multi-store support
6. **Transaction History** - View all transactions, receipts, payment methods
7. **Stock Management** - Stock in/out, adjustments, movement history
8. **Analytics** - Daily/range reports, revenue, profit, top products
9. **Audit Logs** - User activity tracking

---

## 🏗️ Project Architecture

### Tech Stack
```
Framework:      Next.js 14+ with App Router
Language:       TypeScript
UI Library:     ShadcnUI (based on Radix UI)
Styling:        Tailwind CSS
State Management: Zustand or TanStack Query
HTTP Client:    Axios or fetch
Auth:           NextAuth.js v5 or custom JWT
Form Handling:  React Hook Form + Zod validation
Tables:         TanStack Table (React Table)
Charts:         Recharts or Chart.js
Icons:          Lucide React or Heroicons
```

### Folder Structure
```
src/
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home/dashboard
│   ├── auth/
│   │   ├── login/page.tsx       # Login page
│   │   ├── register/page.tsx    # Register page
│   │   └── layout.tsx           # Auth layout
│   ├── dashboard/
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── page.tsx             # Dashboard overview
│   │   ├── products/
│   │   │   ├── page.tsx         # Products list
│   │   │   ├── [id]/page.tsx    # Product detail
│   │   │   ├── new/page.tsx     # Create product
│   │   │   └── [id]/edit/page.tsx # Edit product
│   │   ├── categories/page.tsx
│   │   ├── transactions/page.tsx
│   │   ├── users/page.tsx
│   │   ├── stock/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── stores/page.tsx
│   │   └── audit-logs/page.tsx
│   └── api/
│       └── auth/[...nextauth]/route.ts
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   └── LogoutButton.tsx
│   ├── products/
│   │   ├── ProductTable.tsx
│   │   ├── ProductForm.tsx
│   │   ├── ProductCard.tsx
│   │   └── BarcodeScanner.tsx
│   ├── transactions/
│   │   ├── TransactionTable.tsx
│   │   ├── ReceiptView.tsx
│   │   └── CheckoutForm.tsx
│   ├── analytics/
│   │   ├── RevenueChart.tsx
│   │   ├── SalesChart.tsx
│   │   ├── TopProductsTable.tsx
│   │   └── AnalyticsDashboard.tsx
│   ├── common/
│   │   ├── DataTable.tsx
│   │   ├── SearchInput.tsx
│   │   ├── Pagination.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorBoundary.tsx
│   └── ui/  # ShadcnUI components
├── lib/
│   ├── api.ts               # API client setup
│   ├── auth.ts              # Auth utilities
│   ├── api-client.ts        # Axios instance
│   └── utils.ts             # Helper functions
├── hooks/
│   ├── useAuth.ts           # Auth hook
│   ├── useApi.ts            # API call hook
│   ├── useForm.ts           # Form handling hook
│   └── useTable.ts          # Table pagination hook
├── types/
│   ├── api.ts               # API response types
│   ├── auth.ts              # Auth types
│   ├── models.ts            # Data model types
│   └── index.ts             # Type exports
├── store/
│   ├── authStore.ts         # Auth state
│   ├── userStore.ts         # User state
│   └── uiStore.ts           # UI state
├── services/
│   ├── authService.ts       # Auth API calls
│   ├── productService.ts    # Product API calls
│   ├── transactionService.ts
│   ├── analyticsService.ts
│   └── stockService.ts
├── config/
│   └── apiConfig.ts         # API configuration
├── middleware.ts            # Next.js middleware
├── .env.local               # Environment variables
└── next.config.js           # Next.js config
```

---

## 🎯 Implementation Tasks

### Phase 1: Project Setup
**Estimated:** 2-3 hours

- [x] Create Next.js project with TypeScript
- [x] Install dependencies (ShadcnUI, Tailwind, Zustand, etc.)
- [x] Configure environment variables
- [ ] Setup API client with Axios
- [ ] Create type definitions for API models
- [ ] Setup authentication flow (JWT token storage/refresh)
- [ ] Create auth context/hook

### Phase 2: Authentication Pages
**Estimated:** 3-4 hours

- [ ] Create login page with form validation
- [ ] Create register page
- [ ] Implement JWT token storage (localStorage/sessionStorage)
- [ ] Create protected route middleware
- [ ] Add logout functionality
- [ ] Token refresh logic on API calls
- [ ] Error handling for auth failures

### Phase 3: Dashboard Layout
**Estimated:** 2-3 hours

- [ ] Create responsive layout (Navbar + Sidebar)
- [ ] Navigation menu with role-based access
- [ ] User profile dropdown
- [ ] Dark mode support (optional)
- [ ] Mobile responsive design
- [ ] Active route highlighting

### Phase 4: Dashboard Overview
**Estimated:** 2-3 hours

- [ ] Display key metrics (total revenue, transactions, etc.)
- [ ] Recent transactions widget
- [ ] Quick actions (checkout, stock in)
- [ ] Sales trend chart
- [ ] Top products widget

### Phase 5: Product Management
**Estimated:** 4-5 hours

- [ ] Product list page with pagination/search/filter
- [ ] Product create form (with image upload)
- [ ] Product edit page
- [ ] Product detail page
- [ ] Barcode scanner integration
- [ ] Low stock alerts
- [ ] Bulk product import (optional)

### Phase 6: Category Management
**Estimated:** 2-3 hours

- [ ] Category list CRUD
- [ ] Category form
- [ ] Filter products by category

### Phase 7: Store Management
**Estimated:** 2-3 hours

- [ ] Store list/CRUD (Superadmin only)
- [ ] Store selection for multi-store

### Phase 8: Transaction Management
**Estimated:** 4-5 hours

- [ ] Checkout interface (POS-like)
- [ ] Cart management
- [ ] Receipt generation/printing
- [ ] Transaction history list
- [ ] Filter by date/payment method
- [ ] Search by transaction number

### Phase 9: Stock Management
**Estimated:** 3-4 hours

- [ ] Stock in form
- [ ] Stock adjustment form
- [ ] Stock movement history
- [ ] Product stock history detail
- [ ] Low stock warnings

### Phase 10: Analytics & Reports
**Estimated:** 4-5 hours

- [ ] Daily sales report
- [ ] Range summary
- [ ] Payment method breakdown
- [ ] Top products analysis
- [ ] Revenue/profit charts
- [ ] Export to CSV/PDF (optional)

### Phase 11: User Management
**Estimated:** 3-4 hours

- [ ] User list with pagination
- [ ] User create/edit forms
- [ ] Role management
- [ ] Bulk user import
- [ ] User profile management

### Phase 12: Audit Logs
**Estimated:** 2-3 hours

- [ ] Audit log viewer
- [ ] Filter by action/user/resource
- [ ] Export audit logs

### Phase 13: Quality & Testing
**Estimated:** 3-4 hours

- [ ] Form validation
- [ ] API error handling
- [ ] Loading states
- [ ] Empty states
- [ ] Success/error notifications
- [ ] Unit tests for critical components

---

## 📚 API Integration Details

### Base Configuration
```typescript
// lib/api-client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add token to every request
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        return apiClient(error.config);
      }
    }
    return Promise.reject(error);
  }
);
```

### Authentication Service
```typescript
// services/authService.ts
export const authService = {
  register: (data: RegisterData) => post('/auth/register', data),
  login: (email: string, password: string) => post('/auth/login', { email, password }),
  refresh: (refreshToken: string) => post('/auth/refresh', { refresh_token: refreshToken }),
  profile: () => get('/auth/profile'),
  logout: () => {
    // Clear tokens from storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};
```

### Type Definitions
```typescript
// types/models.ts
export interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  role: 'user' | 'admin' | 'superadmin';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  name: string;
  barcode: string;
  base_price: string;
  cost_price: string;
  stock: number;
  category_id: number;
  store_id: number;
  status: 'active' | 'inactive';
  created_at: string;
}

export interface Transaction {
  id: number;
  transaction_number: string;
  transaction_date: string;
  subtotal: string;
  total_amount: string;
  payment_method: string;
  items: TransactionItem[];
  kasir: User;
}

// ... more types
```

---

## 🎨 UI/UX Design Guidelines

### Color Scheme
```
Primary:       #2563eb (blue-600)
Secondary:     #7c3aed (violet-600)
Success:       #16a34a (green-600)
Warning:       #ea580c (orange-600)
Danger:        #dc2626 (red-600)
Background:    #ffffff / #f9fafb
Text:          #1f2937 / #6b7280
Border:        #e5e7eb / #d1d5db
```

### Component Patterns

**Data Table Pattern:**
- Sortable columns
- Multi-select with bulk actions
- Row actions (view, edit, delete)
- Pagination with customizable page size
- Search/filter functionality
- Responsive scroll on mobile

**Form Pattern:**
- Validation on blur + submit
- Clear error messages
- Loading state on submit
- Success feedback
- Required field indicators
- Fieldset grouping for related fields

**Modal Pattern:**
- Close button + ESC key
- Backdrop click to close (confirmable)
- Accessible keyboard navigation
- Proper z-index stacking

---

## 🔄 State Management Strategy

### Authentication State
```typescript
// store/authStore.ts
interface AuthStore {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  setUser: (user: User) => void;
  setTokens: (token: string, refreshToken: string) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}
```

### API Call Management
```typescript
// hooks/useApi.ts
export function useApi<T>(
  request: () => Promise<T>,
  options?: ApiOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const execute = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await request();
      setData(result);
      return result;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return { data, error, isLoading, execute };
}
```

---

## 📋 Features Implementation Guide

### Feature: Product Management

**Create/Edit Product Form:**
- Text fields: name, description, barcode
- Number fields: base_price, cost_price, stock, low_stock_threshold
- Select: category_id, store_id
- Unit selector (pcs, box, etc.)
- Form validation with Zod
- Image upload (if needed)
- Error handling for duplicate barcode

**Product List:**
- Sortable table (name, category, price, stock)
- Search by name/barcode
- Filter by category, store, stock status
- Pagination (20 items per page)
- Row actions: view, edit, delete
- Bulk actions: export, delete
- Color-code low stock items

---

### Feature: Transaction Checkout

**Checkout Form:**
- Product search/barcode input
- Item quantity adjustment
- Item removal
- Real-time calculation (subtotal, discount, tax, total)
- Payment method selector
- Notes field
- Submit validation (items required, stock check)

**Cart/Items List:**
- Product name, price, quantity, subtotal
- Remove button per item
- Quantity modifier (+/- buttons)
- Price snapshot (use current price)

**Receipt Display:**
- 80mm thermal printer format (CSS printable)
- Store name, address, phone
- Transaction number, date, time
- Item list with prices
- Subtotal, discount, tax, total
- Payment method
- Kasir name
- Print button

---

### Feature: Analytics Dashboard

**Daily Report:**
- Date selector
- Key metrics cards: revenue, items sold, transactions, profit
- Revenue breakdown by payment method
- Top 5 products table
- Hourly sales chart (if data available)

**Range Report:**
- Date range picker (from/to)
- Compare with previous period
- Growth percentage indicators
- Charts: daily revenue trend, payment methods, category breakdown
- Export to CSV

**Top Products:**
- Ranking with product name
- Quantity sold, revenue, profit
- Profit margin %
- Category badge
- Sort by: revenue, quantity, profit

---

## ✅ Quality Checklist

- [ ] TypeScript strict mode enabled
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Accessible (WCAG 2.1 AA)
- [ ] Error handling for all API calls
- [ ] Loading states on all async operations
- [ ] Success/error notifications (toast)
- [ ] Input validation (Zod)
- [ ] Token refresh before expiry
- [ ] Logout on 401 errors
- [ ] Empty states for list views
- [ ] No hardcoded API URLs
- [ ] Environment variables configured
- [ ] Production build tested
- [ ] Bundle size optimized
- [ ] Performance optimized (images, code splitting)

---

## 🚀 Getting Started Script

```bash
# Create Next.js project
npx create-next-app@latest pos01-dashboard \
  --typescript \
  --tailwind \
  --app \
  --no-eslint \
  --no-src-dir

cd pos01-dashboard

# Install additional dependencies
npm install axios zustand react-hook-form zod @hookform/resolvers \
  @shadcn/ui @radix-ui/react-slot class-variance-authority clsx \
  tailwind-merge lucide-react date-fns recharts next-auth

# Initialize ShadcnUI
npx shadcn-ui@latest init

# Create initial folder structure
mkdir -p src/{app,components,lib,hooks,types,store,services,config}

# Start development
npm run dev
```

---

## 📖 Implementation Order (Recommended)

1. **Setup & Configuration** (Project structure, API client, types)
2. **Authentication** (Login, register, JWT handling)
3. **Dashboard Layout** (Navigation, sidebar, responsive design)
4. **Dashboard Overview** (Key metrics, charts, widgets)
5. **Product Management** (List, create, edit, delete)
6. **Categories & Stores** (CRUD operations)
7. **Transaction Management** (Checkout, history, receipts)
8. **Stock Management** (Stock in, adjust, history)
9. **Analytics** (Reports, charts, exports)
10. **User Management** (CRUD, roles, batch import)
11. **Audit Logs** (View, filter, export)
12. **Polish & Testing** (Error handling, validation, tests)

---

## 🔐 Security Considerations

- [ ] Use HTTPS in production
- [ ] Store tokens securely (HttpOnly cookies or sessionStorage)
- [ ] Implement CSRF protection if needed
- [ ] Validate input on both client & server
- [ ] Sanitize user-generated content
- [ ] Rate limit API calls
- [ ] Implement proper error messages (don't expose sensitive info)
- [ ] Use Content Security Policy (CSP) headers
- [ ] Implement logout on page reload if needed
- [ ] Handle expired tokens gracefully

---

## 📱 Responsive Breakpoints

```
Mobile:      < 640px   (default)
Tablet:      640px - 1024px
Desktop:     >= 1024px
Large:       >= 1280px
```

---

## 📞 API Integration Checklist

- [ ] All endpoints in API_ENDPOINTS.md integrated
- [ ] Request/response types match API spec
- [ ] Error handling for each endpoint
- [ ] Loading states during API calls
- [ ] Token refresh on 401
- [ ] Proper HTTP method usage (GET, POST, PUT, DELETE)
- [ ] Query parameters for pagination/filtering
- [ ] Request body validation before sending
- [ ] Response validation with Zod

---

## 🎓 Code Examples

### Protected Route Component
```typescript
// components/ProtectedRoute.tsx
import { useAuth } from '@/hooks/useAuth';
import { redirect } from 'next/navigation';

export function ProtectedRoute({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: string[];
}) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) return <LoadingSpinner />;
  if (!user) redirect('/auth/login');
  if (requiredRole && !requiredRole.includes(user.role)) {
    redirect('/dashboard');
  }
  
  return <>{children}</>;
}
```

### API Service Example
```typescript
// services/productService.ts
export const productService = {
  list: (page = 1, limit = 20, search = '', categoryId?: number) =>
    get('/products', { params: { page, limit, search, category_id: categoryId } }),
  
  get: (id: number) => get(`/products/${id}`),
  
  create: (data: CreateProductRequest) => post('/products', data),
  
  update: (id: number, data: UpdateProductRequest) => put(`/products/${id}`, data),
  
  delete: (id: number) => delete(`/products/${id}`),
  
  getByBarcode: (barcode: string) => get(`/products/by-barcode/${barcode}`),
  
  getLowStock: (storeId?: number) =>
    get('/products/low-stock', { params: { store_id: storeId } }),
};
```

### Data Table Component
```typescript
// components/common/DataTable.tsx
interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading: boolean;
  pagination?: PaginationState;
  onPaginationChange: (state: PaginationState) => void;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading,
  pagination,
  onPaginationChange,
}: DataTableProps<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { pagination },
    onPaginationChange,
  });
  
  // Render table with ShadcnUI components
}
```

---

## 🎯 Success Criteria

By the end of implementation, the dashboard should:

✅ **Functionality**
- [ ] All CRUD operations working for all modules
- [ ] Real-time cart calculations accurate
- [ ] Receipt generation correct
- [ ] Token refresh automatic
- [ ] Role-based access enforced

✅ **Performance**
- [ ] Page load < 3 seconds
- [ ] API responses < 1 second (network dependent)
- [ ] No unnecessary re-renders
- [ ] Images optimized

✅ **UX**
- [ ] Intuitive navigation
- [ ] Clear error messages
- [ ] Loading indicators visible
- [ ] Responsive on all devices
- [ ] Keyboard navigation support

✅ **Code Quality**
- [ ] TypeScript strict mode
- [ ] No console errors/warnings
- [ ] Proper error boundaries
- [ ] Consistent code style
- [ ] Well-documented components

---

**Ready to build? Start with Phase 1: Project Setup!** 🚀
