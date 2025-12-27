type Region = {
    id: string
    name: string
    level: string
}

export type Employee = {
    id: string
    employeeCode: string
    firstName: string
    lastName: string
    email: string
    phone: string
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
    region: Region
}
