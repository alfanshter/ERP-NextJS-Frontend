# Company Module - API Integration Guide

## Overview
Module Company sudah terintegrasi langsung dengan backend API untuk mengelola data perusahaan.

## API Configuration

### Base URL
API base URL dikonfigurasi melalui environment variable di `.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Endpoint
**Base Path:** `/superadmin/companies`

## API Endpoints

### 1. Get Companies List
```
GET /superadmin/companies?page=1&limit=10
```

**Query Parameters:**
- `page` (number): Halaman yang ingin ditampilkan (default: 1)
- `limit` (number): Jumlah data per halaman (default: 10)
- `search` (string, optional): Search keyword
- `status` (string, optional): Filter by status (TRIAL, ACTIVE, INACTIVE, SUSPENDED)
- `sortBy` (string, optional): Field untuk sorting
- `order` (string, optional): Order direction (asc, desc)

**Response:**
```json
{
  "data": [
    {
      "id": "e4ff2ec6-a38f-4919-b10c-1165e606ead3",
      "name": "PT Putra Wisanggeni Satu",
      "email": "admin@ptpws.id",
      "phone": "+6282232469415",
      "address": "Wonosari Pasuruan",
      "logo": null,
      "website": "https://ptpws.id",
      "status": "TRIAL",
      "subscriptionId": null,
      "createdAt": "2025-12-21T11:16:17.808Z",
      "updatedAt": "2025-12-21T11:16:17.808Z",
      "subscription": null,
      "_count": {
        "users": 0,
        "employees": 0,
        "projects": 0
      }
    }
  ],
  "meta": {
    "total": 2,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### 2. Create Company
```
POST /superadmin/companies
```

**Request Body:**
```json
{
  "name": "PT Putra Wisanggeni Satu",
  "email": "admin@ptpws.id",
  "phone": "+6282232469415",
  "address": "Wonosari Pasuruan",
  "website": "https://ptpws.id",
  "status": "TRIAL",
  "logo": null
}
```

**Response:**
```json
{
  "data": {
    "id": "e4ff2ec6-a38f-4919-b10c-1165e606ead3",
    "name": "PT Putra Wisanggeni Satu",
    "email": "admin@ptpws.id",
    ...
  }
}
```

### 3. Get Company by ID
```
GET /superadmin/companies/:id
```

### 4. Update Company
```
PUT /superadmin/companies/:id
```

### 5. Delete Company
```
DELETE /superadmin/companies/:id
```

## Data Structure

### Company Object
| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Unique identifier |
| name | string | Company name |
| email | string | Company email |
| phone | string | Phone number |
| address | string | Full address |
| logo | string \| null | Logo URL or base64 |
| website | string \| null | Website URL |
| status | string | TRIAL \| ACTIVE \| INACTIVE \| SUSPENDED |
| subscriptionId | string \| null | Linked subscription ID |
| createdAt | string (ISO) | Creation timestamp |
| updatedAt | string (ISO) | Last update timestamp |
| subscription | object \| null | Subscription details |
| _count | object | Counts (users, employees, projects) |

### Status Values
- **TRIAL** - Company in trial period
- **ACTIVE** - Active company
- **INACTIVE** - Inactive company
- **SUSPENDED** - Suspended company

## Implementation

### Server Action
File: `src/server/actions/getCompanies.ts`

Fungsi ini dipanggil di server-side untuk fetch data dari API:

```typescript
import getCompanies from '@/server/actions/getCompanies'

// In your page component
const response = await getCompanies(searchParams)
// response.data: Company[]
// response.meta: { total, page, limit, totalPages }
```

### Client Service
File: `src/services/CompanyService.ts`

Untuk client-side API calls:

```typescript
import { 
  getCompanies, 
  createCompany, 
  updateCompany,
  deleteCompany,
  getCompanyById 
} from '@/services/CompanyService'

// Get list
const list = await getCompanies({ page: 1, limit: 10 })

// Create
const newCompany = await createCompany({
  name: "PT Example",
  email: "info@example.com",
  phone: "+62123456789",
  address: "Jakarta",
  website: "https://example.com",
  status: "TRIAL",
  logo: null
})

// Update
await updateCompany({
  id: "company-id",
  name: "Updated Name"
})

// Delete
await deleteCompany("company-id")

// Get by ID
const company = await getCompanyById("company-id")
```

## Usage in Components

### List Page (`/company`)
```typescript
// Automatically fetches from API with pagination
// Supports search, filter, and sorting
```

### Create Page (`/company/create`)
```typescript
// Form submit akan mengirim data ke API
// Uncomment line di CompanyCreate.tsx untuk enable API call
```

## Environment Variables

Pastikan `.env` file sudah dikonfigurasi:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Or for production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Error Handling

API calls sudah include error handling:
- Network errors akan di-catch
- Return empty data jika error
- Display toast notification untuk feedback ke user

## Testing

1. Pastikan backend API sudah running
2. Update `NEXT_PUBLIC_API_URL` di `.env`
3. Restart development server
4. Test di browser: `http://localhost:8080/company`

## Notes

- Semua API calls menggunakan axios dengan interceptors
- Authentication headers otomatis ditambahkan (jika ada)
- Credentials included untuk CORS
- Timeout: 60 seconds
