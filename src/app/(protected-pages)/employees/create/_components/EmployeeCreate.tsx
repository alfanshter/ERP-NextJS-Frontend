'use client'
import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '@/components/view/CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiCreateEmployee } from '@/services/EmployeeService'
import { TbTrash } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { CustomerFormSchema } from '@/components/view/CustomerForm'

const EmployeeCreate = () => {
    const router = useRouter()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        
        try {
            // Buat FormData untuk upload photo
            const formData = new FormData()
            
            // Required fields
            formData.append('employeeCode', 'EMP' + Date.now()) // Auto generate employee code
            formData.append('firstName', values.firstName)
            formData.append('lastName', values.lastName)
            formData.append('email', values.email)
            
            // Optional fields
            if (values.dialCode && values.phoneNumber) {
                formData.append('phone', `${values.dialCode}${values.phoneNumber}`)
            }
            formData.append('position', 'Staff') // Default position
            formData.append('department', 'General') // Default department
            formData.append('salary', '0') // Default salary
            formData.append('joinDate', new Date().toISOString()) // Default today
            formData.append('status', 'ACTIVE')
            
            // Region ID from country field (regionId)
            if (values.country) {
                formData.append('regionId', values.country)
            }
            
            if (values.address) {
                formData.append('address', values.address)
            }
            
            if (values.postcode) {
                formData.append('postalCode', values.postcode)
            }
            
            // Jika ada photo/img, convert dari URL ke File
            if (values.img && values.img.startsWith('blob:')) {
                const response = await fetch(values.img)
                const blob = await response.blob()
                const file = new File([blob], 'employee-photo.jpg', { type: 'image/jpeg' })
                formData.append('photo', file)
            }

            await apiCreateEmployee(formData)
            
            setIsSubmiting(false)
            toast.push(
                <Notification type="success" title="Success">
                    Employee created successfully!
                </Notification>,
                { placement: 'top-end' },
            )
            router.push('/employees')
        } catch (error: unknown) {
            console.error('Error creating employee:', error)
            setIsSubmiting(false)
            
            // Check if error is 409 (email already registered)
            const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string }
            const errorMessage = err?.response?.data?.message || err?.message
            const statusCode = err?.response?.status
            
            if (statusCode === 409 || errorMessage?.includes('Email already registered')) {
                toast.push(
                    <Notification type="warning" title="Email Already Registered">
                        This email is already registered. Please use a different email address.
                    </Notification>,
                    { placement: 'top-end' },
                )
            } else {
                toast.push(
                    <Notification type="danger" title="Error">
                        Failed to create employee. Please try again.
                    </Notification>,
                    { placement: 'top-end' },
                )
            }
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Employee discarded!</Notification>,
            { placement: 'top-end' },
        )
        router.push('/employees')
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <CustomerForm
                newCustomer
                defaultValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    img: '',
                    phoneNumber: '',
                    dialCode: '',
                    country: '',
                    address: '',
                    city: '',
                    postcode: '',
                    tags: [],
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
            </CustomerForm>
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

export default EmployeeCreate
