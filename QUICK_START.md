# 🚀 Quick Start - Frontend Authentication

## Login ke Sistem

### Default Credentials
```
Email: superadmin@erp-system.com
Password: SuperAdmin123!
```

## Start Development

```bash
# Terminal 1 - Backend
cd backend/erp-backend
pnpm run start:dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

Frontend: http://localhost:8080  
Backend: http://localhost:3000

## Code Examples

### 1. Make Authenticated API Call (Server Action)

```typescript
'use server'

import { apiClient } from '@/services/ApiClient'

export async function getCompanies() {
    try {
        const companies = await apiClient.get('/superadmin/companies')
        return { success: true, data: companies }
    } catch (error) {
        return { success: false, error: 'Failed to fetch companies' }
    }
}
```

### 2. Use in Server Component

```typescript
import { auth } from '@/auth'
import { getCompanies } from '@/server/actions/companies'

export default async function CompaniesPage() {
    const session = await auth()
    
    if (!session) {
        redirect('/sign-in')
    }

    const result = await getCompanies()
    
    return (
        <div>
            <h1>Companies</h1>
            {result.success && (
                <ul>
                    {result.data.map(company => (
                        <li key={company.id}>{company.name}</li>
                    ))}
                </ul>
            )}
        </div>
    )
}
```

### 3. Use in Client Component

```typescript
'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

export default function DashboardClient() {
    const { data: session } = useSession()
    const [data, setData] = useState(null)

    useEffect(() => {
        if (session?.user?.accessToken) {
            fetch('http://localhost:3000/superadmin/dashboard/overview', {
                headers: {
                    'Authorization': `Bearer ${session.user.accessToken}`
                }
            })
            .then(res => res.json())
            .then(setData)
        }
    }, [session])

    return <div>{/* render data */}</div>
}
```

### 4. Check User Role

```typescript
import { auth } from '@/auth'

export default async function AdminPage() {
    const session = await auth()
    
    // Check superadmin
    if (!session?.user?.isSuperAdmin) {
        return <div>Access Denied</div>
    }
    
    // Check specific role
    if (!session?.user?.authority?.includes('superadmin')) {
        return <div>Access Denied</div>
    }
    
    return <div>Admin Content</div>
}
```

## Session Data Available

```typescript
session.user = {
    id: string              // User UUID
    email: string           // Email address
    name: string            // Full name
    firstName: string       // First name
    lastName: string        // Last name
    authority: string[]     // Roles: ['superadmin']
    accessToken: string     // JWT token for API calls
    isSuperAdmin: boolean   // Quick superadmin check
    company: string | null  // Company ID if applicable
}
```

## Common API Endpoints

```typescript
// Companies
GET    /superadmin/companies
POST   /superadmin/companies
GET    /superadmin/companies/:id
PATCH  /superadmin/companies/:id
DELETE /superadmin/companies/:id
GET    /superadmin/companies/stats

// Pricing Plans
GET    /superadmin/pricing-plans
POST   /superadmin/pricing-plans
GET    /superadmin/pricing-plans/:id
PATCH  /superadmin/pricing-plans/:id
DELETE /superadmin/pricing-plans/:id

// Dashboard
GET    /superadmin/dashboard/overview
GET    /superadmin/dashboard/company-growth
GET    /superadmin/dashboard/subscription-breakdown
GET    /superadmin/dashboard/company-status

// Auth
POST   /auth/login
POST   /auth/register
GET    /auth/me
GET    /auth/profile
```

## Error Handling

```typescript
import { getErrorMessage } from '@/utils/errorHandler'

try {
    const result = await apiClient.get('/endpoint')
} catch (error) {
    const message = getErrorMessage(error)
    // message will be user-friendly like:
    // "Email is required. Password must be at least 6 characters"
    console.error(message)
}
```

## Debug Tips

### Check if logged in (Browser Console)
```javascript
// Check session
const session = await fetch('/api/auth/session').then(r => r.json())
console.log(session)

// Check token
console.log(session.user?.accessToken)
```

### Test API endpoint (Browser Console)
```javascript
const session = await fetch('/api/auth/session').then(r => r.json())
const token = session.user?.accessToken

const companies = await fetch('http://localhost:3000/superadmin/companies', {
    headers: { 'Authorization': `Bearer ${token}` }
}).then(r => r.json())

console.log(companies)
```

---

**Full Documentation:** See `INTEGRATION_GUIDE.md`
