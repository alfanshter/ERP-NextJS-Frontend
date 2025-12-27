type Role = {
    id: string
    name: string
    description: string
}

type Region = {
    id: string
    name: string
    level: string
    parentId: string | null
    postalCode: string | null
    latitude: string | null
    longitude: string | null
    parent?: Region
}

type Company = {
    id: string
    name: string
}

export type Employee = {
    id: string
    employeeCode: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    avatar: string | null
    photo: string | null
    position: string
    department: string
    joinDate: string
    salary: number
    status: string
    regionId: string
    address: string
    postalCode: string
    companyId: string
    roleId: string
    userId: string | null
    createdAt: string
    updatedAt: string
    role: Role
    region: Region
    company: Company
}

export type GetEmployeeListResponse = {
    data: Employee[]
    meta: {
        total: number
        page: number
        limit: number
        totalPages: number
    }
}

export type EmployeeFilter = {
    role: string
    status: string
}
