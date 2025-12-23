'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { apiUpdatePricingPlan } from '@/services/PricingPlansService'
import { TbDeviceFloppy } from 'react-icons/tb'
import type { PricingPlan } from '../../../types'

const billingPeriodOptions = [
    { label: 'Monthly', value: 'MONTHLY' },
    { label: 'Yearly', value: 'YEARLY' },
    { label: 'Lifetime', value: 'LIFETIME' },
]

const validationSchema = z.object({
    name: z.string().min(1, { message: 'Plan name is required' }),
    description: z.string().optional(),
    price: z.number().min(0, { message: 'Price must be positive' }),
    billingPeriod: z.enum(['MONTHLY', 'YEARLY', 'LIFETIME']),
    features: z.string().min(1, { message: 'At least one feature is required' }),
    maxUsers: z.number().nullable(),
    maxProjects: z.number().nullable(),
    maxStorage: z.number().nullable(),
    isActive: z.boolean(),
})

type PricingPlanFormSchema = z.infer<typeof validationSchema>

type PricingPlanEditFormProps = {
    plan: PricingPlan
}

const PricingPlanEditForm = ({ plan }: PricingPlanEditFormProps) => {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<PricingPlanFormSchema>({
        resolver: zodResolver(validationSchema),
        defaultValues: {
            name: plan.name,
            description: plan.description || '',
            price: plan.price,
            billingPeriod: plan.billingPeriod,
            features: plan.features.join('\n'),
            maxUsers: plan.maxUsers,
            maxProjects: plan.maxProjects,
            maxStorage: plan.maxStorage,
            isActive: plan.isActive,
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
                price: values.price,
                billingPeriod: values.billingPeriod,
                features: featuresArray,
                maxUsers: values.maxUsers,
                maxProjects: values.maxProjects,
                maxStorage: values.maxStorage,
                isActive: values.isActive,
            }

            await apiUpdatePricingPlan(plan.id, payload)

            toast.push(
                <Notification type="success" title="Success">
                    Pricing plan updated successfully!
                </Notification>,
                { placement: 'top-center' }
            )

            router.push('/pricing-plans')
        } catch (error) {
            console.error('Error updating pricing plan:', error)
            setIsSubmitting(false)
            toast.push(
                <Notification type="danger" title="Error">
                    Failed to update pricing plan. Please try again.
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    return (
        <Form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    label="Price"
                    invalid={Boolean(errors.price)}
                    errorMessage={errors.price?.message}
                >
                    <Controller
                        name="price"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Billing Period"
                    invalid={Boolean(errors.billingPeriod)}
                    errorMessage={errors.billingPeriod?.message}
                >
                    <Controller
                        name="billingPeriod"
                        control={control}
                        render={({ field }) => (
                            <Select
                                options={billingPeriodOptions}
                                value={billingPeriodOptions.find(o => o.value === field.value)}
                                onChange={(option) => field.onChange(option?.value)}
                            />
                        )}
                    />
                </FormItem>

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
                    Update Plan
                </Button>
            </div>
        </Form>
    )
}

export default PricingPlanEditForm
