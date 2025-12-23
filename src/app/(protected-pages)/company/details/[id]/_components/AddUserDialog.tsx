'use client'

import { useState } from 'react'
import Dialog from '@/components/ui/Dialog'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { FormItem, Form } from '@/components/ui/Form'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createUser } from '@/services/UserService'
import type { CreateUserData } from '@/services/UserService'

type AddUserDialogProps = {
    isOpen: boolean
    onClose: () => void
    companyId: string
    companyName: string
    onSuccess?: () => void
}

const validationSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    password: z
        .string()
        .min(6, { message: 'Password must be at least 6 characters' }),
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
})

type FormSchema = z.infer<typeof validationSchema>

const AddUserDialog = ({
    isOpen,
    onClose,
    companyId,
    companyName,
    onSuccess,
}: AddUserDialogProps) => {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        handleSubmit,
        formState: { errors },
        control,
        reset,
    } = useForm<FormSchema>({
        defaultValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
        },
        resolver: zodResolver(validationSchema),
    })

    const handleClose = () => {
        reset()
        onClose()
    }

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)

        const userData: CreateUserData = {
            ...values,
            companyId,
        }

        console.log('Creating user:', userData)

        try {
            const response = await createUser(userData)

            if (response.success && response.data) {
                toast.push(
                    <Notification type="success">
                        User created successfully!
                    </Notification>,
                    { placement: 'top-center' },
                )
                reset()
                onClose()
                onSuccess?.()
            } else {
                throw new Error(response.message || 'Failed to create user')
            }
        } catch (err) {
            console.error('Error creating user:', err)
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to create user'
            toast.push(
                <Notification type="danger">{errorMessage}</Notification>,
                { placement: 'top-center' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} onRequestClose={handleClose}>
            <h5 className="mb-4">Add New User</h5>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create a new user account for <b>{companyName}</b>
            </p>

            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-5">
                    {/* Email */}
                    <FormItem
                        label="Email"
                        invalid={Boolean(errors.email)}
                        errorMessage={errors.email?.message}
                    >
                        <Controller
                            name="email"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="email"
                                    placeholder="user@company.com"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    {/* Password */}
                    <FormItem
                        label="Password"
                        invalid={Boolean(errors.password)}
                        errorMessage={errors.password?.message}
                    >
                        <Controller
                            name="password"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="password"
                                    placeholder="Min. 6 characters"
                                    autoComplete="new-password"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    {/* First Name */}
                    <FormItem
                        label="First Name"
                        invalid={Boolean(errors.firstName)}
                        errorMessage={errors.firstName?.message}
                    >
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="John"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    {/* Last Name */}
                    <FormItem
                        label="Last Name"
                        invalid={Boolean(errors.lastName)}
                        errorMessage={errors.lastName?.message}
                    >
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    placeholder="Doe"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>

                <div className="flex items-center justify-end gap-2 mt-6">
                    <Button type="button" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Create User
                    </Button>
                </div>
            </Form>
        </Dialog>
    )
}

export default AddUserDialog
