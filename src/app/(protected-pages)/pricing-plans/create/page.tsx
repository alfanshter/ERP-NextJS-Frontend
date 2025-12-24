'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Checkbox from '@/components/ui/Checkbox'
import { Form, FormItem } from '@/components/ui/Form'
import toast from '@/components/ui/toast'
import Notification from '@/components/ui/Notification'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { apiCreatePricingPlan } from '@/services/PricingPlansService'
import { TbArrowLeft, TbDeviceFloppy } from 'react-icons/tb'

const discountTypeOptions = [
    { label: 'Persentase (%)', value: 'PERCENTAGE' },
    { label: 'Nominal (Rp)', value: 'FIXED' },
]

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Plan name is required' }),
    description: z.string().optional(),
    monthlyPrice: z.number().min(0, { message: 'Monthly price must be positive' }),
    yearlyPrice: z.number().min(0, { message: 'Yearly price must be positive' }),
    monthlyDiscount: z.number().min(0, { message: 'Discount must be positive' }),
    yearlyDiscount: z.number().min(0, { message: 'Discount must be positive' }),
    discountType: z.enum(['PERCENTAGE', 'FIXED']),
    features: z.string().min(1, { message: 'At least one feature is required' }),
    maxUsers: z.number().nullable(),
    maxProjects: z.number().nullable(),
    maxStorage: z.number().nullable(),
    isActive: z.boolean(),
})

type PricingPlanFormSchema = z.infer<typeof validationSchema>

const CreatePricingPlan = () => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<PricingPlanFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: '',
            description: '',
            monthlyPrice: 0,
            yearlyPrice: 0,
            monthlyDiscount: 0,
            yearlyDiscount: 0,
            discountType: 'PERCENTAGE',
            features: '',
            maxUsers: null,
            maxProjects: null,
            maxStorage: null,
            isActive: true,
        },
    })

    const onSubmit = async (values: PricingPlanFormSchema) => {
        try {
            setIsSubmitting(true)

            // Convert features string to array
            const featuresArray = values.features
                .split('\n')
                .map(f => f.trim())
                .filter(f => f.length > 0)

            const payload = {
                name: values.name,
                description: values.description || null,
                monthlyPrice: values.monthlyPrice,
                yearlyPrice: values.yearlyPrice,
                monthlyDiscount: values.monthlyDiscount,
                yearlyDiscount: values.yearlyDiscount,
                discountType: values.discountType,
                features: featuresArray,
                maxUsers: values.maxUsers,
                maxProjects: values.maxProjects,
                maxStorage: values.maxStorage,
                isActive: values.isActive,
            }

            await apiCreatePricingPlan(payload)

            toast.push(
                <Notification type="success" title="Success">
                    Pricing plan created successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            router.push('/pricing-plans')
        } catch (error) {
            console.error('Error creating pricing plan:', error)
            setIsSubmitting(false)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to create pricing plan. Please try again.
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    return (
        <Container>
            <AdaptiveCard>
                <div className="flex items-center justify-between mb-6">
                    <h3>Create Pricing Plan</h3>
                    <Button
                        size="sm"
                        variant="plain"
                        icon={<TbArrowLeft />}
                        onClick={() => router.push('/pricing-plans')}
                    >
                        Back
                    </Button>
                </div>

                <Form onSubmit={handleSubmit(onSubmit)}>
                    <FormItem
                        label="Plan Name"
                        invalid={Boolean(errors.name)}
                        errorMessage={errors.name?.message}
                    >
                        <Controller
                            name="name"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    placeholder="e.g., Premium"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem
                        label="Description"
                        invalid={Boolean(errors.description)}
                        errorMessage={errors.description?.message}
                        className="mt-4"
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    placeholder="Describe this plan..."
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <h5 className="mt-6 mb-4">Pricing</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormItem
                            label="Harga Bulanan (Rp)"
                            invalid={Boolean(errors.monthlyPrice)}
                            errorMessage={errors.monthlyPrice?.message}
                        >
                            <Controller
                                name="monthlyPrice"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        step="1"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Harga Tahunan (Rp)"
                            invalid={Boolean(errors.yearlyPrice)}
                            errorMessage={errors.yearlyPrice?.message}
                        >
                            <Controller
                                name="yearlyPrice"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        step="1"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <h5 className="mt-6 mb-4">Diskon</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormItem
                            label="Tipe Diskon"
                            invalid={Boolean(errors.discountType)}
                            errorMessage={errors.discountType?.message}
                        >
                            <Controller
                                name="discountType"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        options={discountTypeOptions}
                                        value={discountTypeOptions.find(o => o.value === field.value)}
                                        onChange={(option) => field.onChange(option?.value)}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Diskon Bulanan"
                            invalid={Boolean(errors.monthlyDiscount)}
                            errorMessage={errors.monthlyDiscount?.message}
                        >
                            <Controller
                                name="monthlyDiscount"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        step="1"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Diskon Tahunan"
                            invalid={Boolean(errors.yearlyDiscount)}
                            errorMessage={errors.yearlyDiscount?.message}
                        >
                            <Controller
                                name="yearlyDiscount"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        step="1"
                                        placeholder="0"
                                        {...field}
                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <h5 className="mt-6 mb-4">Limits</h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormItem
                            label="Max Users"
                            invalid={Boolean(errors.maxUsers)}
                            errorMessage={errors.maxUsers?.message}
                        >
                            <Controller
                                name="maxUsers"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        placeholder="Leave empty for unlimited"
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Max Projects"
                            invalid={Boolean(errors.maxProjects)}
                            errorMessage={errors.maxProjects?.message}
                        >
                            <Controller
                                name="maxProjects"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        placeholder="Leave empty for unlimited"
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                    />
                                )}
                            />
                        </FormItem>

                        <FormItem
                            label="Max Storage (GB)"
                            invalid={Boolean(errors.maxStorage)}
                            errorMessage={errors.maxStorage?.message}
                        >
                            <Controller
                                name="maxStorage"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        type="number"
                                        placeholder="Leave empty for unlimited"
                                        {...field}
                                        value={field.value ?? ''}
                                        onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                    />
                                )}
                            />
                        </FormItem>
                    </div>

                    <FormItem
                        label="Features (one per line)"
                        invalid={Boolean(errors.features)}
                        errorMessage={errors.features?.message}
                        className="mt-4"
                    >
                        <Controller
                            name="features"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    textArea
                                    rows={6}
                                    placeholder="Unlimited users&#10;Unlimited projects&#10;1TB storage&#10;24/7 Priority support&#10;Custom integrations"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>

                    <FormItem className="mt-4">
                        <Controller
                            name="isActive"
                            control={control}
                            render={({ field }) => (
                                <Checkbox
                                    checked={field.value}
                                    onChange={field.onChange}
                                >
                                    Active (plan is available for subscription)
                                </Checkbox>
                            )}
                        />
                    </FormItem>

                    <div className="flex justify-end gap-2 mt-6">
                        <Button
                            type="button"
                            onClick={() => router.push('/pricing-plans')}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="solid"
                            loading={isSubmitting}
                            icon={<TbDeviceFloppy />}
                        >
                            Save Plan
                        </Button>
                    </div>
                </Form>
            </AdaptiveCard>
        </Container>
    )
}

export default CreatePricingPlan
