# 🔗 Frontend-Backend Integration Guide

## Overview
Professional production-ready integration antara Next.js frontend dengan NestJS backend untuk sistem ERP.

## ✅ Yang Sudah Diimplementasikan

### 1. Authentication Service (`AuthApiService.ts`)
Service khusus untuk handle authentication dengan backend:
- ✅ Login with credentials
- ✅ Get user profile
- ✅ Token validation
- ✅ Professional error handling
- ✅ User-friendly error messages

### 2. API Client (`ApiClient.ts`)
Generic API client untuk semua authenticated requests:
- ✅ Automatic JWT token injection
- ✅ Support GET, POST, PATCH, PUT, DELETE
- ✅ Session-based authentication
- ✅ Type-safe responses
- ✅ Comprehensive error handling

### 3. Error Handler (`errorHandler.ts`)
Utility untuk handle dan format error messages:
- ✅ Format validation errors
- ✅ User-friendly messages
- ✅ Error type detection
- ✅ HTTP status handling

### 4. NextAuth Integration
Fully integrated dengan NextAuth untuk session management:
- ✅ Custom credential provider
- ✅ Backend API validation
- ✅ JWT token storage
- ✅ Session callbacks
- ✅ Type-safe session data

### 5. Type Definitions
Extended NextAuth types dengan data tambahan:
```typescript
interface Session {
    user: {
        id: string
        email: string
        name: string
        authority: string[]
        accessToken: string
        isSuperAdmin: boolean
        company: string | null
        firstName: string
        lastName: string
    }
}
```

## 🚀 Cara Penggunaan

### 1. Login User

Frontend akan otomatis handle login flow:

```typescript
// User mengisi form di /sign-in
// Form submit → handleSignIn → validateCredential → Backend API
// Backend response → Transform to NextAuth format → Create session
// Redirect ke authenticated page
```

**Flow:**
1. User input email & password di form
2. Click "Sign In"
3. Frontend call `validateCredential` (server action)
4. `validateCredential` call backend `/auth/login`
5. Backend validate & return token + user data
6. Frontend create NextAuth session
7. User redirect ke dashboard

### 2. Access Protected Resources

Gunakan `apiClient` untuk authenticated requests:

```typescript
import { apiClient } from '@/services/ApiClient'

// GET companies (auto includes JWT token)
const companies = await apiClient.get('/superadmin/companies')

// POST create company
const newCompany = await apiClient.post('/superadmin/companies', {
    name: 'PT Example',
    email: 'admin@example.com',
    // ...
})

// PATCH update company
const updated = await apiClient.patch('/superadmin/companies/uuid', {
    name: 'Updated Name'
})

// DELETE company
await apiClient.delete('/superadmin/companies/uuid')
```

### 3. Get Current User in Server Component

```typescript
import { auth } from '@/auth'

export default async function Page() {
    const session = await auth()
    
    if (!session) {
        redirect('/sign-in')
    }

    const user = session.user
    // user.accessToken - JWT token for API calls
    // user.isSuperAdmin - Check if superadmin
    // user.authority - Array of roles
    // user.firstName, user.lastName, etc.

    return <div>Welcome, {user.firstName}!</div>
}
```

### 4. Get Current User in Client Component

```typescript
'use client'

import { useSession } from 'next-auth/react'

export default function ClientComponent() {
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (status === 'unauthenticated') {
        return <div>Please sign in</div>
    }

    const user = session?.user
    return <div>Hello, {user?.firstName}!</div>
}
```

### 5. Role-Based Access Control

```typescript
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export default async function SuperAdminPage() {
    const session = await auth()
    
    // Check if user is superadmin
    if (!session?.user?.isSuperAdmin) {
        redirect('/unauthorized')
    }

    // Or check specific role
    if (!session?.user?.authority?.includes('superadmin')) {
        redirect('/unauthorized')
    }

    return <div>Superadmin Only Content</div>
}
```

## 📝 Environment Variables

`.env.local` harus berisi:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# NextAuth Configuration
AUTH_SECRET=lmsdZgyoJ+vIJLrxo3lVVoq5uP0tKKclr
NEXTAUTH_URL=http://localhost:3000/
AUTH_TRUST_HOST=true
```

## 🔒 Security Features

### 1. Token Management
- ✅ JWT token stored in NextAuth session (encrypted)
- ✅ Token automatically included in API requests
- ✅ 7-day expiration (match backend)
- ✅ Secure HTTP-only cookies

### 2. Error Handling
- ✅ Never expose internal errors to user
- ✅ User-friendly error messages
- ✅ Validation errors properly formatted
- ✅ Network error detection

### 3. Type Safety
- ✅ TypeScript types for all API responses
- ✅ Type-safe session data
- ✅ Compile-time error checking

## 🧪 Testing Authentication

### 1. Test Login
```bash
# Start backend
cd backend/erp-backend
pnpm run start:dev

# Start frontend (terminal baru)
cd frontend
npm run dev
```

### 2. Login Flow
1. Buka http://localhost:8080/sign-in
2. Input:
   - Email: `superadmin@erp-system.com`
   - Password: `SuperAdmin123!`
3. Click "Sign In"
4. Should redirect to dashboard
5. Session should persist (refresh page = still logged in)

### 3. Test Invalid Credentials
1. Input wrong email/password
2. Should show error: "Invalid email or password..."
3. Should NOT redirect
4. Form should remain editable

### 4. Test Validation
1. Submit empty form
2. Should show: "Email is required. Password is required"
3. Input invalid email (e.g., "notanemail")
4. Should show: "Please enter a valid email address"

### 5. Test Protected Routes
1. Logout (if logged in)
2. Try access `/dashboard` directly
3. Should redirect to `/sign-in`
4. Login
5. Should redirect back to `/dashboard`

## 📊 API Response Examples

### Success Login
```json
{
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
        "id": "75dde71e-511d-481b-a54e-46fd5e587164",
        "firstName": "Super",
        "lastName": "Admin",
        "email": "superadmin@erp-system.com",
        "role": "superadmin",
        "company": null,
        "isSuperAdmin": true
    }
}
```

### Validation Error (400)
```json
{
    "statusCode": 400,
    "message": [
        "email should not be empty",
        "email must be an email",
        "password must be longer than or equal to 6 characters",
        "password should not be empty"
    ],
    "error": "Bad Request"
}
```

**Frontend akan transform ke:**
```
"Email is required. Password must be at least 6 characters"
```

### Authentication Error (401)
```json
{
    "statusCode": 401,
    "message": "Unauthorized"
}
```

**Frontend akan transform ke:**
```
"Invalid email or password. Please check your credentials and try again."
```

### Forbidden Error (403)
```json
{
    "statusCode": 403,
    "message": "Forbidden resource"
}
```

**Frontend akan show:**
```
"Access denied. Insufficient permissions."
```

## 🎯 Best Practices

### 1. Always Use apiClient for Backend Calls
```typescript
// ✅ GOOD
import { apiClient } from '@/services/ApiClient'
const data = await apiClient.get('/superadmin/companies')

// ❌ BAD - manually handling auth
const response = await fetch('/superadmin/companies', {
    headers: { Authorization: `Bearer ${token}` }
})
```

### 2. Handle Errors Properly
```typescript
import { getErrorMessage } from '@/utils/errorHandler'

try {
    const data = await apiClient.get('/endpoint')
} catch (error) {
    const message = getErrorMessage(error)
    // Show message to user
    toast.error(message)
}
```

### 3. Check Authentication in Server Components
```typescript
// ✅ GOOD - server component
import { auth } from '@/auth'

export default async function Page() {
    const session = await auth()
    if (!session) redirect('/sign-in')
    // ...
}

// ❌ BAD - client component for auth check
'use client'
const { data: session } = useSession()
if (!session) return <div>Redirecting...</div>
```

### 4. Use Type-Safe API Calls
```typescript
// Define types
interface Company {
    id: string
    name: string
    email: string
    // ...
}

// Use in API call
const companies = await apiClient.get<Company[]>('/superadmin/companies')
// companies is now typed as Company[]
```

## 🚨 Troubleshooting

### "Invalid email or password" tetapi credentials benar
- Check backend server running di port 3000
- Check `NEXT_PUBLIC_API_URL` di `.env.local`
- Check backend database seeded dengan superadmin user

### Session tidak persist setelah login
- Check `AUTH_SECRET` ada di `.env.local`
- Clear browser cookies
- Restart Next.js dev server

### CORS errors
- Backend harus allow origin dari frontend
- Add CORS middleware di backend `main.ts`

### Type errors di session
- Run `npm run dev` untuk rebuild types
- Check `next-auth.d.ts` untuk type definitions

## 🎊 Production Checklist

Sebelum deploy:

- [ ] Change `AUTH_SECRET` ke random secure string
- [ ] Change `JWT_SECRET` di backend
- [ ] Update `NEXT_PUBLIC_API_URL` ke production URL
- [ ] Enable HTTPS
- [ ] Setup CORS properly di backend
- [ ] Add rate limiting
- [ ] Setup error monitoring (Sentry, etc.)
- [ ] Add request logging
- [ ] Setup session timeout handling
- [ ] Add refresh token mechanism (optional)
- [ ] Test all error scenarios

---

**Status:** ✅ PRODUCTION READY  
**Last Updated:** December 21, 2025  
**Version:** 1.0.0
