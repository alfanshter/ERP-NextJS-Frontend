import Container from '@/components/shared/Container'
import AdaptiveCard from '@/components/shared/AdaptiveCard'
import Tag from '@/components/ui/Tag'
import PricingPlanDetailHeader from './_components/PricingPlanDetailHeader'
import { apiGetPricingPlanById } from '@/services/PricingPlansService'
import { notFound } from 'next/navigation'
import type { PricingPlan } from '../../types'

const statusColor: Record<string, string> = {
    true: 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900',
    false: 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900',
}

const billingPeriodColor: Record<string, string> = {
    MONTHLY: 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900',
    YEARLY: 'bg-purple-200 dark:bg-purple-200 text-gray-900 dark:text-gray-900',
    LIFETIME: 'bg-amber-200 dark:bg-amber-200 text-gray-900 dark:text-gray-900',
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    let plan: PricingPlan

    try {
        plan = await apiGetPricingPlanById<PricingPlan>(id)
    } catch (error) {
        console.error('Error fetching pricing plan:', error)
        notFound()
    }

    return (
        <Container>
            <AdaptiveCard>
                <PricingPlanDetailHeader planId={plan.id} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm text-gray-500">Plan Name</label>
                            <p className="text-lg font-semibold mt-1">{plan.name}</p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Description</label>
                            <p className="mt-1">{plan.description || '-'}</p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Price</label>
                            <p className="text-2xl font-bold mt-1">
                                Rp {plan.price.toLocaleString('id-ID')}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Billing Period</label>
                            <div className="mt-1">
                                <Tag className={billingPeriodColor[plan.billingPeriod]}>
                                    <span className="capitalize">
                                        {plan.billingPeriod.toLowerCase()}
                                    </span>
                                </Tag>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Status</label>
                            <div className="mt-1">
                                <Tag className={statusColor[String(plan.isActive)]}>
                                    <span className="capitalize">
                                        {plan.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </Tag>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Active Subscriptions</label>
                            <p className="text-lg font-semibold mt-1">
                                {plan._count?.subscriptions || 0} {plan._count?.subscriptions === 1 ? 'subscription' : 'subscriptions'}
                            </p>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm text-gray-500 mb-2 block">Plan Limits</label>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Max Users:</span>
                                    <span className="font-semibold">
                                        {plan.maxUsers || 'Unlimited'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Max Projects:</span>
                                    <span className="font-semibold">
                                        {plan.maxProjects || 'Unlimited'}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Max Storage:</span>
                                    <span className="font-semibold">
                                        {plan.maxStorage ? `${plan.maxStorage}GB` : 'Unlimited'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500 mb-2 block">Features</label>
                            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                <ul className="space-y-2">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="flex items-start">
                                            <span className="text-emerald-600 mr-2">✓</span>
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Created At</label>
                            <p className="mt-1">
                                {new Date(plan.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm text-gray-500">Last Updated</label>
                            <p className="mt-1">
                                {new Date(plan.updatedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </AdaptiveCard>
        </Container>
    )
}
