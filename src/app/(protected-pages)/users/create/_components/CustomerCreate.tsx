'use client'
import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import CustomerForm from '@/components/view/CustomerForm'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import { apiCreateStaff } from '@/services/CustomersService'
import { TbTrash } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { CustomerFormSchema } from '@/components/view/CustomerForm'

const CustomerEdit = () => {
    const router = useRouter()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] =
        useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        
        try {
            // Buat FormData untuk upload avatar
            const formData = new FormData()
            
            formData.append('email', values.email)
            // Tidak kirim password, biar backend set default "admin123"
            formData.append('firstName', values.firstName)
            formData.append('lastName', values.lastName)
            formData.append('phone', `${values.dialCode}${values.phoneNumber}`)
            formData.append('country', values.country)
            formData.append('address', values.address)
            formData.append('city', values.city)
            formData.append('postalCode', values.postcode)
            
            // Jika ada avatar/img, convert dari URL ke File
            if (values.img && values.img.startsWith('blob:')) {
                const response = await fetch(values.img)
                const blob = await response.blob()
                const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
                formData.append('avatar', file)
            }

            await apiCreateStaff(formData)
            
            setIsSubmiting(false)
            toast.push(
                <Notification type="success" title="Success">
                    Staff created successfully! Default password: <strong>admin123</strong>
                </Notification>,
                { placement: 'top-end' },
            )
            router.push('/users')
        } catch (error: unknown) {
            console.error('Error creating staff:', error)
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
                        Failed to create staff. Please try again.
                    </Notification>,
                    { placement: 'top-end' },
                )
            }
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Staff discarded!</Notification>,
            { placement: 'top-end' },
        )
        router.push('/users')
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

export default CustomerEdit
