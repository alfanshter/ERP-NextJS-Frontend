'use client'

import { useState } from 'react'
import Container from '@/components/shared/Container'
import Button from '@/components/ui/Button'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import CustomerForm from '@/components/view/CustomerForm'
import { apiUpdateEmployee, apiDeleteEmployee } from '@/services/EmployeeService'
import { TbTrash, TbArrowNarrowLeft } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import type { CustomerFormSchema } from '@/components/view/CustomerForm'
import type { Employee } from '../../../types'

type EmployeeEditProps = {
    data: Employee
}

const EmployeeEdit = ({ data }: EmployeeEditProps) => {
    const router = useRouter()

    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false)
    const [isSubmiting, setIsSubmiting] = useState(false)

    const handleFormSubmit = async (values: CustomerFormSchema) => {
        console.log('Submitted values', values)
        setIsSubmiting(true)
        
        try {
            // Buat FormData untuk upload photo
            const formData = new FormData()
            
            formData.append('employeeCode', data.employeeCode || 'EMP' + Date.now())
            formData.append('firstName', values.firstName)
            formData.append('lastName', values.lastName)
            formData.append('email', values.email)
            
            if (values.dialCode && values.phoneNumber) {
                formData.append('phone', `${values.dialCode}${values.phoneNumber}`)
            }
            
            formData.append('position', data.position || 'Staff')
            formData.append('department', data.department || 'General')
            formData.append('salary', data.salary?.toString() || '0')
            formData.append('joinDate', data.joinDate || new Date().toISOString())
            formData.append('status', data.status || 'ACTIVE')
            
            // Region ID - use from form or keep existing
            if (values.country) {
                formData.append('regionId', values.country)
            } else if (data.regionId) {
                formData.append('regionId', data.regionId.toString())
            }
            
            if (values.address) {
                formData.append('address', values.address)
            }
            
            if (values.postcode) {
                formData.append('postalCode', values.postcode)
            }
            
            // Jika ada photo baru, convert dari URL ke File
            if (values.img && values.img.startsWith('blob:')) {
                const response = await fetch(values.img)
                const blob = await response.blob()
                const file = new File([blob], 'employee-photo.jpg', { type: 'image/jpeg' })
                formData.append('photo', file)
            }

            await apiUpdateEmployee(data.id, formData)
            
            setIsSubmiting(false)
            toast.push(
                <Notification type="success" title="Success">
                    Employee updated successfully!
                </Notification>,
                { placement: 'top-end' },
            )
            router.push('/employees')
        } catch (error: unknown) {
            console.error('Error updating employee:', error)
            setIsSubmiting(false)
            
            const err = error as { response?: { data?: { message?: string } }; message?: string }
            const errorMessage = err?.response?.data?.message || err?.message
            
            toast.push(
                <Notification type="danger" title="Error">
                    {errorMessage || 'Failed to update employee. Please try again.'}
                </Notification>,
                { placement: 'top-end' },
            )
        }
    }

    const getDefaultValues = () => {
        if (data) {
            const { firstName, lastName, email, phone, avatar } = data

            // Parse phone number
            let dialCode = '+62'
            let phoneNumber = phone
            
            if (phone) {
                if (phone.startsWith('+')) {
                    const match = phone.match(/^(\+\d{1,4})(.*)/)
                    if (match) {
                        dialCode = match[1]
                        phoneNumber = match[2]
                    }
                }
            }

            return {
                firstName,
                lastName,
                email,
                img: avatar || '',
                phoneNumber,
                dialCode,
                country: data.regionId?.toString() || '',
                address: data.address || '',
                city: data.region?.name || '',
                postcode: data.postalCode || '',
                tags: [],
            }
        }

        return {}
    }

    const handleConfirmDelete = async () => {
        setDeleteConfirmationOpen(false)
        
        try {
            await apiDeleteEmployee(data.id)
            
            toast.push(
                <Notification type="success" title="Success">
                    Employee deleted successfully!
                </Notification>,
                { placement: 'top-end' },
            )
            router.push('/employees')
        } catch (error: unknown) {
            console.error('Error deleting employee:', error)
            
            const err = error as { response?: { data?: { message?: string } }; message?: string }
            const errorMessage = err?.response?.data?.message || err?.message
            
            toast.push(
                <Notification type="danger" title="Error">
                    {errorMessage || 'Failed to delete employee. Please try again.'}
                </Notification>,
                { placement: 'top-end' },
            )
        }
    }

    const handleDelete = () => {
        setDeleteConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDeleteConfirmationOpen(false)
    }

    const handleBack = () => {
        history.back()
    }

    return (
        <>
            <CustomerForm
                defaultValues={getDefaultValues() as CustomerFormSchema}
                newCustomer={false}
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
                                Save
                            </Button>
                        </div>
                    </div>
                </Container>
            </CustomerForm>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove employee"
                onClose={handleCancel}
                onRequestClose={handleCancel}
                onCancel={handleCancel}
                onConfirm={handleConfirmDelete}
            >
                <p>
                    Are you sure you want to remove this employee? This action
                    can&apos;t be undo.{' '}
                </p>
            </ConfirmDialog>
        </>
    )
}

export default EmployeeEdit
