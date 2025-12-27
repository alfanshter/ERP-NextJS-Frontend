'use client'

import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import CompanyForm from '@/components/view/CompanyForm'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { CompanyFormSchema } from '@/components/view/CompanyForm'
import type { CompanyDetail } from '../../../types'
import { updateCompany, deleteCompany } from '@/services/CompanyService'

type CompanyEditProps = {
    data: CompanyDetail
}

const CompanyEdit = ({ data }: CompanyEditProps) => {
    const router = useRouter()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CompanyFormSchema) => {
        // Extract logo file from img array
        const logoFile = values.img && values.img.length > 0 && values.img[0] instanceof File
            ? values.img[0]
            : undefined

        // Format data untuk API (partial update - hanya kirim yang berubah)
        const companyData: {
            name?: string
            email?: string
            phone?: string
            regionId?: string
            address?: string
            postalCode?: string
            latitude?: number
            longitude?: number
            website?: string
            status?: 'TRIAL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
            logo?: File
        } = {}

        // Only include changed fields
        if (values.name !== data.name) companyData.name = values.name
        if (values.email !== data.email) companyData.email = values.email
        if (values.phone !== (data.phone || '')) companyData.phone = values.phone
        if (values.regionId !== (data.regionId || '')) companyData.regionId = values.regionId
        if (values.address !== (data.address || '')) companyData.address = values.address
        if (values.postalCode !== (data.postalCode || '')) companyData.postalCode = values.postalCode
        if (values.latitude && values.latitude !== String(data.latitude || '')) {
            companyData.latitude = parseFloat(values.latitude)
        }
        if (values.longitude && values.longitude !== String(data.longitude || '')) {
            companyData.longitude = parseFloat(values.longitude)
        }
        if (values.website !== (data.website || '')) companyData.website = values.website || undefined
        if (values.status !== data.status) {
            companyData.status = values.status as 'TRIAL' | 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
        }
        
        // Add logo if new file is selected
        if (logoFile) {
            companyData.logo = logoFile
        }

        console.log('Company data to be updated:', {
            ...companyData,
            logo: logoFile ? `File: ${logoFile.name} (${logoFile.size} bytes)` : 'No change',
        })

        setIsSubmiting(true)

        try {
            const response = await updateCompany(data.id, companyData)

            if (response.success && response.data) {
                toast.push(
                    <Notification type="success">Changes saved successfully!</Notification>,
                    { placement: 'top-center' },
                )
                router.push('/company')
            } else {
                throw new Error(response.message || 'Failed to update company')
            }
        } catch (err) {
            console.error('Error updating company:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to update company'
            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const getDefaultValues = (): CompanyFormSchema => {
        // Build region object from data if available
        const region = data.region ? {
            id: data.region.id,
            fullName: [
                data.region.name,
                data.region.parent?.name,
                data.region.parent?.parent?.name,
                data.region.parent?.parent?.parent?.name,
            ].filter(Boolean).join(', '),
            postalCode: data.postalCode,
            latitude: data.latitude,
            longitude: data.longitude,
            village: data.region.name,
            district: data.region.parent?.name || '',
            city: data.region.parent?.parent?.name || '',
            province: data.region.parent?.parent?.parent?.name || '',
        } : null

        return {
            name: data.name,
            email: data.email,
            phone: data.phone || '',
            regionId: data.regionId || '',
            region: region,
            address: data.address || '',
            postalCode: data.postalCode || '',
            latitude: data.latitude ? String(data.latitude) : '',
            longitude: data.longitude ? String(data.longitude) : '',
            website: data.website || '',
            status: data.status,
            img: data.logo ? [data.logo] : [],
        }
    }

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false)

        try {
            const response = await deleteCompany(data.id)

            if (response.success) {
                toast.push(
                    <Notification type="success">Company deleted successfully!</Notification>,
                    { placement: 'top-center' },
                )
                router.push('/company')
            } else {
                throw new Error(response.message || 'Failed to delete company')
            }
        } catch (err) {
            console.error('Error deleting company:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete company'
            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' },
            )
            setDeleteConfirmationOpen(false)
        }
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        router.back()
    }

    return (
        <>
            <CompanyForm
                defaultValues={getDefaultValues()}
                newCompany={false}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <Button
                            className="ltr:mr-3 rtl:ml-3"
                            type="button"
                            variant="plain"
                            icon={<TbArrowNarrowLeft />}
                            onClick={handleBack}
                        >
                            Back
                        </Button>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDelete}
                            >
                                Delete
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </Container>
            </CompanyForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Delete company"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to delete <b>{data.name}</b>? All data
                    associated with this company will be permanently removed. This
                    action cannot be undone.
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CompanyEdit
