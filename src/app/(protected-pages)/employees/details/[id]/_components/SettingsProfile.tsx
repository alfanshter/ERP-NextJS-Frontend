'use client'

import { useMemo, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Select, { Option as DefaultOption } from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { components } from 'react-select'
import type { ControlProps, OptionProps } from 'react-select'
import { apiGetEmployeeById, apiUpdateEmployee } from '@/services/EmployeeService'
import useSWR from 'swr'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import type { Employee } from '../../../types'

type ProfileSchema = {
    employeeCode: string
    firstName: string
    lastName: string
    email: string
    dialCode: string
    phoneNumber: string
    avatar: string
    position: string
    department: string
    regionId: string
    address: string
    postalCode: string
}

type CountryOption = {
    label: string
    dialCode: string
    value: string
}

const { Control } = components

const validationSchema = z.object({
    employeeCode: z.string().min(1, { message: 'Employee code required' }),
    firstName: z.string().min(1, { message: 'First name required' }),
    lastName: z.string().min(1, { message: 'Last name required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    dialCode: z.string().min(1, { message: 'Please select your country code' }),
    phoneNumber: z
        .string()
        .min(1, { message: 'Please input your mobile number' }),
    avatar: z.string(),
    position: z.string().min(1, { message: 'Position required' }),
    department: z.string().min(1, { message: 'Department required' }),
    regionId: z.string().min(1, { message: 'Region required' }),
    address: z.string().min(1, { message: 'Address required' }),
    postalCode: z.string().min(1, { message: 'Postal code required' }),
})

const CustomSelectOption = (
    props: OptionProps<CountryOption> & { variant: 'country' | 'phone' },
) => {
    return (
        <DefaultOption<CountryOption>
            {...props}
            customLabel={(data, label) => (
                <span className="flex items-center gap-2">
                    <Avatar
                        shape="circle"
                        size={20}
                        src={`/img/countries/${data.value}.png`}
                    />
                    {props.variant === 'country' && <span>{label}</span>}
                    {props.variant === 'phone' && <span>{data.dialCode}</span>}
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

const SettingsProfile = () => {
    const params = useParams()
    const employeeId = params?.id as string

    const { data, mutate } = useSWR(
        employeeId ? `/api/employee/${employeeId}` : null,
        () => apiGetEmployeeById<Employee>(employeeId),
        {
            revalidateOnFocus: false,
            revalidateIfStale: false,
            revalidateOnReconnect: false,
        },
    )

    const dialCodeList = useMemo(() => {
        const newCountryList: Array<CountryOption> = JSON.parse(
            JSON.stringify(countryList),
        )

        return newCountryList.map((country) => {
            country.label = country.dialCode
            return country
        })
    }, [])

    const beforeUpload = (files: FileList | null) => {
        let valid: string | boolean = true

        const allowedFileType = ['image/jpeg', 'image/png']
        if (files) {
            const fileArray = Array.from(files)
            for (const file of fileArray) {
                if (!allowedFileType.includes(file.type)) {
                    valid = 'Please upload a .jpeg or .png file!'
                }
            }
        }

        return valid
    }

    const {
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        control,
    } = useForm<ProfileSchema>({
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (data) {
            // Parse phone number untuk memisahkan dial code dan number
            let dialCode = ''
            let phoneNumber = ''
            
            if (data.phone) {
                // Cari dial code yang match dengan dialCodeList
                const matchedCountry = dialCodeList.find(country => 
                    data.phone?.startsWith(country.dialCode)
                )
                
                if (matchedCountry) {
                    dialCode = matchedCountry.dialCode // +62
                    phoneNumber = data.phone.substring(matchedCountry.dialCode.length) // 82232992839
                } else {
                    // Fallback: ambil semua setelah + sebagai phoneNumber
                    phoneNumber = data.phone
                }
            }

            reset({
                employeeCode: data.employeeCode || '',
                firstName: data.firstName || '',
                lastName: data.lastName || '',
                email: data.email || '',
                dialCode: dialCode,
                phoneNumber: phoneNumber,
                avatar: data.avatar || '',
                position: data.position || '',
                department: data.department || '',
                regionId: data.regionId || '',
                address: data.address || '',
                postalCode: data.postalCode || '',
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data])

    const onSubmit = async (values: ProfileSchema) => {
        try {
            // Convert form values to FormData
            const formData = new FormData()
            
            formData.append('employeeCode', values.employeeCode)
            formData.append('firstName', values.firstName)
            formData.append('lastName', values.lastName)
            formData.append('email', values.email)
            
            // Gabungkan dialCode + phoneNumber menjadi phone
            const fullPhone = values.dialCode + values.phoneNumber
            formData.append('phone', fullPhone)
            
            formData.append('position', values.position)
            formData.append('department', values.department)
            formData.append('regionId', values.regionId)
            formData.append('address', values.address)
            formData.append('postalCode', values.postalCode)
            
            // Handle avatar upload - jika ada foto baru yang diupload
            if (values.avatar && values.avatar.startsWith('blob:')) {
                const response = await fetch(values.avatar)
                const blob = await response.blob()
                const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
                formData.append('avatar', file)
            }
            
            // Call API update
            await apiUpdateEmployee(employeeId, formData)
            
            // Refresh data
            await mutate()
            
            toast.push(
                <Notification title="Success" type="success">
                    Profile updated successfully!
                </Notification>,
                { placement: 'top-end' }
            )
        } catch (error: unknown) {
            console.error('Error updating profile:', error)
            
            // Check if error is 409 (email already registered)
            const err = error as { response?: { data?: { message?: string }; status?: number }; message?: string }
            const errorMessage = err?.response?.data?.message || err?.message
            const statusCode = err?.response?.status
            
            if (statusCode === 409 || errorMessage?.includes('Email already registered')) {
                toast.push(
                    <Notification title="Email Already Registered" type="warning">
                        This email is already registered. Please use a different email address.
                    </Notification>,
                    { placement: 'top-end' }
                )
            } else {
                toast.push(
                    <Notification title="Error" type="danger">
                        Failed to update profile. Please try again.
                    </Notification>,
                    { placement: 'top-end' }
                )
            }
        }
    }

    return (
        <>
            <h4 className="mb-8">Personal information</h4>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-8">
                    <Controller
                        name="avatar"
                        control={control}
                        render={({ field }) => (
                            <div className="flex items-center gap-4">
                                <Avatar
                                    size={90}
                                    className="border-4 border-white bg-gray-100 text-gray-300 shadow-lg"
                                    icon={<HiOutlineUser />}
                                    src={field.value}
                                />
                                <div className="flex items-center gap-2">
                                    <Upload
                                        showList={false}
                                        uploadLimit={1}
                                        beforeUpload={beforeUpload}
                                        onChange={(files) => {
                                            if (files.length > 0) {
                                                field.onChange(
                                                    URL.createObjectURL(
                                                        files[0],
                                                    ),
                                                )
                                            }
                                        }}
                                    >
                                        <Button
                                            variant="solid"
                                            size="sm"
                                            type="button"
                                            icon={<TbPlus />}
                                        >
                                            Upload Image
                                        </Button>
                                    </Upload>
                                    <Button
                                        size="sm"
                                        type="button"
                                        onClick={() => {
                                            field.onChange('')
                                        }}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="First name"
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
                        label="User name"
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
                <div className="flex items-end gap-4 w-full mb-6">
                    <FormItem
                        invalid={
                            Boolean(errors.phoneNumber) ||
                            Boolean(errors.dialCode)
                        }
                    >
                        <label className="form-label mb-2">Phone number</label>
                        <Controller
                            name="dialCode"
                            control={control}
                            render={({ field }) => (
                                <Select<CountryOption>
                                    instanceId="dial-code"
                                    options={dialCodeList}
                                    {...field}
                                    className="w-[150px]"
                                    components={{
                                        Option: (props) => (
                                            <CustomSelectOption
                                                variant="phone"
                                                {...(props as OptionProps<CountryOption>)}
                                            />
                                        ),
                                        Control: CustomControl,
                                    }}
                                    placeholder=""
                                    value={dialCodeList.find(
                                        (option) =>
                                            option.dialCode === field.value,
                                    )}
                                    onChange={(option) =>
                                        field.onChange(option?.dialCode)
                                    }
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        className="w-full"
                        invalid={
                            Boolean(errors.phoneNumber) ||
                            Boolean(errors.dialCode)
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
                                    onBlur={field.onBlur}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <h4 className="mb-6">Job information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                    <FormItem
                        label="Employee Code"
                        invalid={Boolean(errors.employeeCode)}
                        errorMessage={errors.employeeCode?.message}
                    >
                        <Controller
                            name="employeeCode"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Employee Code"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem
                        label="Position"
                        invalid={Boolean(errors.position)}
                        errorMessage={errors.position?.message}
                    >
                        <Controller
                            name="position"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    placeholder="Position"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                </div>
                <FormItem
                    label="Department"
                    invalid={Boolean(errors.department)}
                    errorMessage={errors.department?.message}
                >
                    <Controller
                        name="department"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Department"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
                <h4 className="mb-6">Address information</h4>
                <FormItem
                    label="Region ID"
                    invalid={Boolean(errors.regionId)}
                    errorMessage={errors.regionId?.message}
                >
                    <Controller
                        name="regionId"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Region ID"
                                {...field}
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
                <div className="flex justify-end">
                    <Button
                        variant="solid"
                        type="submit"
                        loading={isSubmitting}
                    >
                        Save
                    </Button>
                </div>
            </Form>
        </>
    )
}

export default SettingsProfile
