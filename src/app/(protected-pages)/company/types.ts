export type SubscriptionPlan = {
    id: string
    name: string
    description: string
    monthlyPrice: number
    yearlyPrice: number
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

export type Subscription = {
    id: string
    planId: string
    billingPeriod: 'MONTHLY' | 'YEARLY'
    price: number
    status: string
    startDate: string
    endDate: string | null
    trialEndDate: string | null
    autoRenew: boolean
    lastPaymentAt: string | null
    nextBillingAt: string | null
    createdAt: string
    updatedAt: string
    plan: SubscriptionPlan
}

export type CompanySubscriptionResponse = {
    company: {
        id: string
        name: string
        email: string
        phone: string
        status: string
        subscriptionId: string | null
    }
    subscription: Subscription | null
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

export type Region = {
    id: string
    name: string
    level: 'PROVINCE' | 'CITY' | 'DISTRICT' | 'VILLAGE'
    parentId: string | null
    postalCode: string | null
    latitude: number | null
    longitude: number | null
    parent?: Region | null
}

export type CompanyCount = {
    users: number
    employees: number
    projects: number
    procurements: number
    invoices: number
    expenses: number
}

export type Company = {
    id: string
    name: string
    email: string
    phone: string | null
    regionId: string | null
    address: string | null
    postalCode: string | null
    latitude: number | null
    longitude: number | null
    logo: string | null
    website: string | null
    status: string
    subscriptionId: string | null
    createdAt: string
    updatedAt: string
    region: Region | null
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
    regionId?: string
    address?: string
    postalCode?: string
    latitude?: number
    longitude?: number
    website?: string
    status: CompanyStatus
    logo?: File | null
}

export type UpdateCompanyData = Partial<CreateCompanyData>
