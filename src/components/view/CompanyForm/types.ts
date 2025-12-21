import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    name: string
    email: string
    phone: string
    website?: string
}

export type AddressFields = {
    address: string
}

export type ProfileImageFields = {
    img?: (File | string)[]
}

export type StatusField = {
    status: string
}

export type CompanyFormSchema = OverviewFields &
    AddressFields &
    ProfileImageFields &
    StatusField

export type FormSectionBaseProps = {
    control: Control<CompanyFormSchema>
    errors: FieldErrors<CompanyFormSchema>
}
