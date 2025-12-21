'use client'

import { useEffect } from 'react'
import { Form } from '@/components/ui/Form'
import Container from '@/components/shared/Container'
import BottomStickyBar from '@/components/template/BottomStickyBar'
import OverviewSection from './OverviewSection'
import AddressSection from './AddressSection'
import StatusSection from './StatusSection'
import ProfileImageSection from './ProfileImageSection'
import isEmpty from 'lodash/isEmpty'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { CommonProps } from '@/@types/common'
import type { CompanyFormSchema } from './types'

type CompanyFormProps = {
    onFormSubmit: (values: CompanyFormSchema) => void
    defaultValues?: CompanyFormSchema
    newCompany?: boolean
} & CommonProps

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Company name required' }),
    email: z
        .string()
        .min(1, { message: 'Email required' })
        .email({ message: 'Invalid email' }),
    phone: z.string().min(1, { message: 'Phone number required' }),
    website: z.string().url({ message: 'Invalid URL format' }).optional().or(z.literal('')),
    address: z.string().min(1, { message: 'Address required' }),
    img: z
        .array(
            z.union([
                z.instanceof(File).refine(
                    (file) => file.size <= 1024 * 1024, // 1MB
                    { message: 'Logo file must be less than 1MB' }
                ).refine(
                    (file) => ['image/jpeg', 'image/png'].includes(file.type),
                    { message: 'Only JPEG and PNG formats are allowed' }
                ),
                z.string().url({ message: 'Invalid image URL' }),
            ])
        )
        .max(1, { message: 'Only one logo image is allowed' })
        .optional()
        .default([]),
    status: z.string().min(1, { message: 'Status required' }),
})

const CompanyForm = (props: CompanyFormProps) => {
    const {
        onFormSubmit,
        defaultValues = {},
        children,
    } = props

    const {
        handleSubmit,
        reset,
        formState: { errors },
        control,
    } = useForm<CompanyFormSchema>({
        defaultValues: {
            ...defaultValues,
        },
        resolver: zodResolver(validationSchema),
    })

    useEffect(() => {
        if (!isEmpty(defaultValues)) {
            reset(defaultValues)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(defaultValues)])

    const onSubmit = (values: CompanyFormSchema) => {
        onFormSubmit?.(values)
    }

    return (
        <Form
            className="flex w-full h-full"
            containerClassName="flex flex-col w-full justify-between"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Container>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="gap-4 flex flex-col flex-auto">
                        <OverviewSection control={control} errors={errors} />
                        <AddressSection control={control} errors={errors} />
                    </div>
                    <div className="md:w-[370px] gap-4 flex flex-col">
                        <ProfileImageSection
                            control={control}
                            errors={errors}
                        />
                        <StatusSection control={control} errors={errors} />
                    </div>
                </div>
            </Container>
            <BottomStickyBar>{children}</BottomStickyBar>
        </Form>
    )
}

export default CompanyForm
