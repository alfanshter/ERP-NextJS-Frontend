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
            price: 0,
            billingPeriod: 'MONTHLY',
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
                price: values.price,
                billingPeriod: values.billingPeriod,
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
                            Save Plan
                        </Button>
                    </div>
                </Form>
            </AdaptiveCard>
        </Container>
    )
}

export default CreatePricingPlan
