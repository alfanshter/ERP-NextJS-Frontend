'use client'

import { forwardRef } from 'react'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import Upload from '@/components/ui/Upload'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Avatar from '@/components/ui/Avatar'
import DatePicker from '@/components/ui/DatePicker'
import { Form, FormItem } from '@/components/ui/Form'
import NumericInput from '@/components/shared/NumericInput'
import { countryList } from '@/constants/countries.constant'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { HiOutlineUser } from 'react-icons/hi'
import { TbPlus } from 'react-icons/tb'
import type { EmployeeFormSchema } from './types'
import type { CommonProps } from '@/@types/common'

type EmployeeFormProps = {
    newEmployee?: boolean
    defaultValues: Partial<EmployeeFormSchema>
    onFormSubmit: (values: EmployeeFormSchema) => void
} & CommonProps

const statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'SUSPENDED', label: 'Suspended' },
]

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
    joinDate: z.string().min(1, { message: 'Join date required' }),
    salary: z.string().min(1, { message: 'Salary required' }),
    status: z.string().min(1, { message: 'Status required' }),
    regionId: z.string().min(1, { message: 'Region required' }),
    address: z.string().min(1, { message: 'Address required' }),
    postalCode: z.string().min(1, { message: 'Postal code required' }),
})

const EmployeeForm = forwardRef<HTMLFormElement, EmployeeFormProps>(
    (props, ref) => {
        const { newEmployee = false, defaultValues, onFormSubmit, children } = props

        const dialCodeList = countryList.map((country) => ({
            ...country,
            label: country.dialCode,
        }))

        const beforeUpload = (files: FileList | null) => {
            let valid: string | boolean = true
            const allowedFileType = ['image/jpeg', 'image/png']
            if (files) {
                for (const file of Array.from(files)) {
                    if (!allowedFileType.includes(file.type)) {
                        valid = 'Please upload a .jpeg or .png file!'
                    }
                }
            }
            return valid
        }

        const {
            handleSubmit,
            formState: { errors },
            control,
        } = useForm<EmployeeFormSchema>({
            defaultValues,
            resolver: zodResolver(validationSchema),
        })

        const onSubmit = (values: EmployeeFormSchema) => {
            onFormSubmit(values)
        }

        return (
            <Form ref={ref} onSubmit={handleSubmit(onSubmit)}>
                <Container>
                    <AdaptiveCard>
                        <h4 className="mb-6">Employee Information</h4>
                        
                        {/* Avatar Upload */}
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
                                                            URL.createObjectURL(files[0]),
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
                                                onClick={() => field.onChange('')}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        {/* Basic Info */}
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
                                            placeholder="e.g. EMP001"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                            
                            <FormItem
                                label="Status"
                                invalid={Boolean(errors.status)}
                                errorMessage={errors.status?.message}
                            >
                                <Controller
                                    name="status"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            options={statusOptions}
                                            {...field}
                                            value={statusOptions.find(
                                                (option) => option.value === field.value,
                                            )}
                                            onChange={(option) =>
                                                field.onChange(option?.value || '')
                                            }
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

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
                                        <Select
                                            options={dialCodeList}
                                            {...field}
                                            className="w-[150px]"
                                            placeholder=""
                                            value={dialCodeList.find(
                                                (option) => option.dialCode === field.value,
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

                        <h4 className="mb-6 mt-8">Job Information</h4>

                        <div className="grid md:grid-cols-2 gap-4">
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
                                            placeholder="e.g. Software Engineer"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>

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
                                            placeholder="e.g. IT"
                                            {...field}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <FormItem
                                label="Join Date"
                                invalid={Boolean(errors.joinDate)}
                                errorMessage={errors.joinDate?.message}
                            >
                                <Controller
                                    name="joinDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            placeholder="Select join date"
                                            value={field.value ? new Date(field.value) : null}
                                            onChange={(date) =>
                                                field.onChange(
                                                    date ? date.toISOString() : '',
                                                )
                                            }
                                        />
                                    )}
                                />
                            </FormItem>

                            <FormItem
                                label="Salary"
                                invalid={Boolean(errors.salary)}
                                errorMessage={errors.salary?.message}
                            >
                                <Controller
                                    name="salary"
                                    control={control}
                                    render={({ field }) => (
                                        <NumericInput
                                            autoComplete="off"
                                            placeholder="Salary"
                                            value={field.value}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                        />
                                    )}
                                />
                            </FormItem>
                        </div>

                        <h4 className="mb-6 mt-8">Address Information</h4>

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
                                        placeholder="e.g. 32.73"
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
                    </AdaptiveCard>
                </Container>
                {children}
            </Form>
        )
    },
)

EmployeeForm.displayName = 'EmployeeForm'

export default EmployeeForm
