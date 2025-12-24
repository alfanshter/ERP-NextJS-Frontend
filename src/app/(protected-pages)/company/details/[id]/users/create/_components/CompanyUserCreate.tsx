'use client'

import { useState, useMemo } from 'react'
import Container from '@/components/shared/Container'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import Switcher from '@/components/ui/Switcher'
import { FormItem, Form } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import ConfirmDialog from '@/components/shared/ConfirmDialog'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import { countryList } from '@/constants/countries.constant'
import { createCompanyUser } from '@/services/CompanyService'
import { TbTrash } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'

type CompanyUserCreateProps = {
    companyId: string
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const roleOptions = [
    { value: 'admin', label: 'Admin' },
    { value: 'manager', label: 'Manager' },
    { value: 'staff', label: 'Staff' },
]

const { Control } = components

const CustomSelectOption = (props: OptionProps<CountryOption>) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    <span>{data.dialCode}</span>
                </span>
            )}
        />
    )
}

const CustomControl = ({ children, ...props }: ControlProps<CountryOption>) => {
    const selected = props.getValue()[0]
    return (
        <Control {...props}>
            {selected && (
                <Avatar
                    className="ltr:ml-4 rtl:mr-4"
                    shape="circle"
                    size={20}
                    src={`/img/countries/${selected.value}.png`}
                />
            )}
            {children}
        </Control>
    )
}

const validationSchema = z.object({
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    dialCode: z.string().min(1, { message: 'Please select country code' }),
    phoneNumber: z.string().min(1, { message: 'Phone number required' }),
    country: z.string().min(1, { message: 'Country required' }),
    address: z.string().min(1, { message: 'Address required' }),
    city: z.string().min(1, { message: 'City required' }),
    postalCode: z.string().min(1, { message: 'Postal code required' }),
    roleName: z.enum(['admin', 'manager', 'staff'], { message: 'Role is required' }),
    isActive: z.boolean(),
})

type FormSchema = z.infer<typeof validationSchema>

const CompanyUserCreate = ({ companyId }: CompanyUserCreateProps) => {
    const router = useRouter()

    const [discardConfirmationOpen, setDiscardConfirmationOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )
        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormSchema>({
        defaultValues: {
            email: '',
            firstName: '',
            lastName: '',
            dialCode: '',
            phoneNumber: '',
            country: '',
            address: '',
            city: '',
            postalCode: '',
            roleName: 'staff',
            isActive: true,
        },
        resolver: zodResolver(validationSchema),
    })

    const onSubmit = async (values: FormSchema) => {
        setIsSubmitting(true)

        console.log('Creating company user:', values)

        try {
            const response = await createCompanyUser(companyId, {
                email: values.email,
                firstName: values.firstName,
                lastName: values.lastName,
                phone: `${values.dialCode}${values.phoneNumber}`,
                country: values.country,
                address: values.address,
                city: values.city,
                postalCode: values.postalCode,
                roleName: values.roleName,
                isActive: values.isActive,
            })

            if (response.success && response.data) {
                toast.push(
                    <Notification type="success" title="Success">
                        User created successfully! Default password: <strong>admin123</strong>
                    </Notification>,
                    { placement: 'top-end' },
                )
                router.push(`/company/details/${companyId}`)
            } else {
                // Handle duplicate email (409)
                if (response.status === 409) {
                    toast.push(
                        <Notification type="warning" title="Email Already Registered">
                            This email is already registered. Please use a different email.
                        </Notification>,
                        { placement: 'top-end' },
                    )
                } else {
                    throw new Error(response.message || 'Failed to create user')
                }
            }
        } catch (err) {
            console.error('Error creating user:', err)
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to create user'
            toast.push(
                <Notification type="danger" title="Error">
                    {errorMessage}
                </Notification>,
                { placement: 'top-end' },
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleConfirmDiscard = () => {
        setDiscardConfirmationOpen(false)
        toast.push(
            <Notification type="success">Discarded!</Notification>,
            { placement: 'top-end' },
        )
        router.push(`/company/details/${companyId}`)
    }

    const handleDiscard = () => {
        setDiscardConfirmationOpen(true)
    }

    const handleCancel = () => {
        setDiscardConfirmationOpen(false)
    }

    return (
        <>
            <Form
                className="flex w-full h-full"
                containerClassName="flex flex-col w-full justify-between"
                onSubmit={handleSubmit(onSubmit)}
            >
                <Container>
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Left Column - Main Form */}
                        <div className="gap-4 flex flex-col flex-auto">
                            {/* Overview Section */}
                            <Card>
                                <h4 className="mb-6">Overview</h4>
                                <div className="grid md:grid-cols-2 gap-4">
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
                                                    autoComplete="off"
                                                    placeholder="First Name"
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </FormItem>
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
                                                    autoComplete="off"
                                                    placeholder="Last Name"
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>
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
                                                autoComplete="off"
                                                placeholder="Email"
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormItem
                                        label="Phone"
                                        invalid={
                                            Boolean(errors.dialCode) ||
                                            Boolean(errors.phoneNumber)
                                        }
                                        errorMessage={errors.phoneNumber?.message}
                                    >
                                        <Controller
                                            name="phoneNumber"
                                            control={control}
                                            render={({ field }) => (
                                                <NumericInput
                                                    autoComplete="off"
                                                    placeholder="Phone Number"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Country Code"
                                        invalid={Boolean(errors.dialCode)}
                                        errorMessage={errors.dialCode?.message}
                                    >
                                        <Controller
                                            name="dialCode"
                                            control={control}
                                            render={({ field }) => (
                                                <Select<CountryOption>
                                                    options={dialCodeList}
                                                    value={dialCodeList.find(
                                                        (c) => c.dialCode === field.value,
                                                    )}
                                                    placeholder="Code"
                                                    components={{
                                                        Option: CustomSelectOption,
                                                        Control: CustomControl,
                                                    }}
                                                    onChange={(option) =>
                                                        field.onChange(option?.dialCode)
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>
                            </Card>

                            {/* Address Section */}
                            <Card>
                                <h4 className="mb-6">Address</h4>
                                <FormItem
                                    label="Country"
                                    invalid={Boolean(errors.country)}
                                    errorMessage={errors.country?.message}
                                >
                                    <Controller
                                        name="country"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                options={countryList}
                                                value={countryList.find(
                                                    (c) => c.value === field.value,
                                                )}
                                                placeholder="Country"
                                                onChange={(option) =>
                                                    field.onChange(option?.value)
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem
                                    label="Address"
                                    invalid={Boolean(errors.address)}
                                    errorMessage={errors.address?.message}
                                >
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                type="text"
                                                autoComplete="off"
                                                placeholder="Address"
                                                {...field}
                                            />
                                        )}
                                    />
                                </FormItem>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <FormItem
                                        label="City"
                                        invalid={Boolean(errors.city)}
                                        errorMessage={errors.city?.message}
                                    >
                                        <Controller
                                            name="city"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder="City"
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </FormItem>
                                    <FormItem
                                        label="Postal Code"
                                        invalid={Boolean(errors.postalCode)}
                                        errorMessage={errors.postalCode?.message}
                                    >
                                        <Controller
                                            name="postalCode"
                                            control={control}
                                            render={({ field }) => (
                                                <Input
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder="Postal Code"
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column - Role & Status */}
                        <div className="md:w-[370px] gap-4 flex flex-col">
                            <Card>
                                <h4 className="mb-6">Role & Status</h4>
                                <FormItem
                                    label="Role"
                                    invalid={Boolean(errors.roleName)}
                                    errorMessage={errors.roleName?.message}
                                >
                                    <Controller
                                        name="roleName"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                placeholder="Select role"
                                                options={roleOptions}
                                                value={roleOptions.find(
                                                    (opt) => opt.value === field.value,
                                                )}
                                                onChange={(option) =>
                                                    field.onChange(option?.value)
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                                <FormItem label="Active Status" className="mt-4">
                                    <Controller
                                        name="isActive"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="flex items-center gap-2">
                                                <Switcher
                                                    checked={field.value}
                                                    onChange={field.onChange}
                                                />
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {field.value ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        )}
                                    />
                                </FormItem>
                            </Card>
                        </div>
                    </div>
                </Container>
                <BottomStickyBar>
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
                                    loading={isSubmitting}
                                >
                                    Create
                                </Button>
                            </div>
                        </div>
                    </Container>
                </BottomStickyBar>
            </Form>
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

export default CompanyUserCreate
