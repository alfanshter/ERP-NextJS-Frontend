import type { Control, FieldErrors } from 'react-hook-form'

export type OverviewFields = {
    name: string
    email: string
    phone: string
    website?: string
}

export type RegionOption = {
    id: string
    fullName: string
    postalCode: string | null
    latitude: number | null
    longitude: number | null
    village: string
    district: string
    city: string
    province: string
}

export type AddressFields = {
    regionId?: string
    region?: RegionOption | null
    address: string
    postalCode?: string
    latitude?: string
    longitude?: string
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
