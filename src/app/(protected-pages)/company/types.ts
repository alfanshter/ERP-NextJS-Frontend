type Subscription = {
    id: string
    planId: string
    status: string
    startDate: string
    endDate: string
    trialEndDate: string | null
    autoRenew: boolean
    billingCycle: 'MONTHLY' | 'YEARLY'
    createdAt: string
    updatedAt: string
    plan: {
        id: string
        name: string
        description: string
        monthlyPrice: number
        yearlyPrice: number
        finalMonthlyPrice: number
        finalYearlyPrice: number
        monthlyDiscount: number
        yearlyDiscount: number
        discountType: 'PERCENTAGE' | 'FIXED'
        features: string[]
        maxUsers: number | null
        maxProjects: number | null
        maxStorage: number | null
        isActive: boolean
        createdAt: string
        updatedAt: string
    }
}

type CompanyCount = {
    users: number
    employees: number
    projects: number
    procurements: number
    invoices: number
    expenses: number
}

export type CompanyUser = {
    id: string
    email: string
    firstName: string
    lastName: string
    phone: string | null
    avatar: string | null
    country: string | null
    address: string | null
    city: string | null
    postalCode: string | null
    companyId: string
    role: {
        id: string
        name: string
        description: string
    }
    lastLoginAt: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
}

export type CreateCompanyUserData = {
    email: string
    firstName: string
    lastName: string
    phone?: string
    country?: string
    address?: string
    city?: string
    postalCode?: string
    roleName: 'admin' | 'manager' | 'staff'
    isActive?: boolean
}

export type Company = {
    id: string
    name: string
    email: string
    phone: string
    address: string
    logo: string | null
    website: string | null
    status: string
    subscriptionId: string | null
    createdAt: string
    updatedAt: string
    subscription: Subscription | null
    _count: CompanyCount
}

export type CompanyDetail = Company & {
    users: CompanyUser[]
}

export type CompanyUsersResponse = {
    data: CompanyUser[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export type GetCompaniesListResponse = {
    data: Company[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export type Filter = {
    status: string
    search: string
}

export type CompanyStatus = 'TRIAL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export type CreateCompanyData = {
    name: string
    email?: string
    phone?: string
    address?: string
    website?: string
    status: CompanyStatus
    logo?: File | null
}

export type UpdateCompanyData = Partial<CreateCompanyData>
