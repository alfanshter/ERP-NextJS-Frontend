import type { Control, FieldErrors } from 'react-hook-form'

export type EmployeeFormSchema = {
    employeeCode: string
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    avatar: string
    position: string
    department: string
    joinDate: string
    salary: string
    status: string
    regionId: string
    address: string
    postalCode: string
}

export type FormSectionBaseProps = {
    control: Control<EmployeeFormSchema>
    errors: FieldErrors<EmployeeFormSchema>
}
