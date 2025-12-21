'use client'
import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CompanyForm from '@/components/view/CompanyForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { TbTrash } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { CompanyFormSchema } from '@/components/view/CompanyForm'
import { createCompany } from '@/services/CompanyService'

const CompanyCreate = () => {
    const router = useRouter()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CompanyFormSchema) => {
        // Extract logo file from img array
        const logoFile = values.img && values.img.length > 0 && values.img[0] instanceof File
            ? values.img[0]
            : null

        // Format data sesuai dengan struktur API
        const companyData = {
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            website: values.website || undefined,
            status: values.status as 'ACTIVE' | 'INACTIVE' | 'TRIAL',
            logo: logoFile,
        }
        
        console.log('Company data to be sent:', {
            ...companyData,
            logo: logoFile ? `File: ${logoFile.name} (${logoFile.size} bytes)` : null,
        })
        
        setIsSubmiting(true)
        
        try {
            const response = await createCompany(companyData)
            
            if (response.success && response.data) {
                toast.push(
                    <Notification type="success">Company created successfully!</Notification>,
                    { placement: 'top-center' },
                )
                router.push('/company')
            } else {
                throw new Error(response.message || 'Failed to create company')
            }
        } catch (err) {
            console.error('Error creating company:', err)
            const errorMessage = err instanceof Error ? err.message : 'Failed to create company'
            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmiting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Company discarded!</Notification>,
            { placement: 'top-center' },
        )
        router.push('/company')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <CompanyForm
                newCompany
                defaultValues={{
                    name: '',
                    email: '',
                    phone: '',
                    address: '',
                    website: '',
                    status: 'TRIAL',
                    img: [],
                }}
                onFormSubmit={handleFormSubmit}
            >
                <Container>
                    <div className="flex items-center justify-between px-8">
                        <span></span>
                        <div className="flex items-center">
                            <Button
                                className="ltr:mr-3 rtl:ml-3"
                                type="button"
                                customColorClass={() =>
                                    'border-error ring-1 ring-error text-error hover:border-error hover:ring-error hover:text-error bg-transparent'
                                }
                                icon={<TbTrash />}
                                onClick={handleDiscard}
                            >
                                Discard
                            </Button>
                            <Button
                                variant="solid"
                                type="submit"
                                loading={isSubmiting}
                            >
                                Create
                            </Button>
                        </div>
                    </div>
                </Container>
            </CompanyForm>
            <ConfirmDialog
                isOpen={discardConfirmationOpen}
                type="danger"
                title="Discard changes"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDiscard}
            >
                <p>
                    Are you sure you want discard this? This action can&apos;t
                    be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default CompanyCreate
