type Subscription = {
    id: string
    planId: string
    status: string
    startDate: string
    endDate: string
    trialEndDate: string | null
    autoRenew: boolean
    createdAt: string
    updatedAt: string
    plan: {
        id: string
        name: string
        description: string
        price: number
        billingPeriod: string
        features: string[]
        maxUsers: number
        maxProjects: number
        maxStorage: number
        isActive: boolean
        createdAt: string
        updatedAt: string
    }
}

type CompanyCount = {
    users: number
    employees: number
    projects: number
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
