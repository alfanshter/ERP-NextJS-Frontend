type Role = {
    id: string
    name: string
    description: string
}

export type Staff = {
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
    isActive: boolean
    role: Role
    lastLoginAt: string | null
    createdAt: string
    updatedAt: string
}

export type GetStaffListResponse = {
    data: Staff[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export type StaffFilter = {
    role: string
    status: string
}

// Legacy types (keep for backward compatibility if needed)
type PersonalInfo = {
    location: string
    title: string
    birthday: string
    phoneNumber: string
    dialCode: string
    address: string
    postcode: string
    city: string
    country: string
    facebook: string
    twitter: string
    pinterest: string
    linkedIn: string
}

type OrderHistory = {
    id: string
    item: string
    status: string
    amount: number
    date: number
}

type PaymentMethod = {
    cardHolderName: string
    cardType: string
    expMonth: string
    expYear: string
    last4Number: string
    primary: boolean
}

type Subscription = {
    plan: string
    status: string
    billing: string
    nextPaymentDate: number
    amount: number
}

export type GetCustomersListResponse = {
    list: Customer[]
    total: number
}

export type CustomerFilter = {
    purchasedProducts: string
    purchaseChannel: Array<string>
}

export type Customer = {
    id: string
    name: string
    firstName: string
    lastName: string
    email: string
    img: string
    role: string
    lastOnline: number
    status: string
    personalInfo: PersonalInfo
    orderHistory: OrderHistory[]
    paymentMethod: PaymentMethod[]
    subscription: Subscription[]
    totalSpending: number
}
