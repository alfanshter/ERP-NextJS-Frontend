'use client'

import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { TbCheck, TbCrown } from 'react-icons/tb'
import dayjs from 'dayjs'
import type { CompanyDetail } from '../../../types'

type SubscriptionSectionProps = {
    data: CompanyDetail
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'bg-emerald-500'
        case 'TRIAL':
            return 'bg-blue-500'
        case 'EXPIRED':
            return 'bg-red-500'
        case 'CANCELLED':
            return 'bg-gray-500'
        default:
            return 'bg-gray-500'
    }
}

const SubscriptionSection = ({ data }: SubscriptionSectionProps) => {
    if (!data.subscription) {
        return (
            <Card>
                <div className="text-center py-8">
                    <TbCrown className="text-6xl mx-auto mb-4 text-gray-400" />
                    <h5 className="mb-2">No Active Subscription</h5>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This company doesn&apos;t have an active subscription plan yet.
                    </p>
                    <Button variant="solid">
                        Assign Subscription Plan
                    </Button>
                </div>
            </Card>
        )
    }

    const { subscription } = data
    const { plan } = subscription

    return (
        <div className="space-y-6">
            {/* Current Plan Card */}
            <Card>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <TbCrown className="text-3xl text-amber-500" />
                            <h5>{plan.name} Plan</h5>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {plan.description}
                        </p>
                    </div>
                    <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Price
                        </span>
                        <p className="text-2xl font-bold text-primary mt-1">
                            ${plan.price}
                            <span className="text-sm text-gray-500">
                                /{plan.billingPeriod.toLowerCase()}
                            </span>
                        </p>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Auto Renew
                        </span>
                        <p className="text-lg font-bold mt-1">
                            {subscription.autoRenew ? 'Enabled' : 'Disabled'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            Start Date
                        </span>
                        <p className="font-bold mt-1">
                            {dayjs(subscription.startDate).format('DD MMM YYYY')}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                            End Date
                        </span>
                        <p className="font-bold mt-1">
                            {dayjs(subscription.endDate).format('DD MMM YYYY')}
                        </p>
                    </div>
                    {subscription.trialEndDate && (
                        <div>
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Trial End Date
                            </span>
                            <p className="font-bold mt-1">
                                {dayjs(subscription.trialEndDate).format('DD MMM YYYY')}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button variant="solid" className="flex-1">
                        Change Plan
                    </Button>
                    <Button variant="default" className="flex-1">
                        Cancel Subscription
                    </Button>
                </div>
            </Card>

            {/* Plan Features Card */}
            <Card>
                <h6 className="mb-4">Plan Features</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Limits */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <TbCheck className="text-emerald-500 text-xl" />
                            <span>
                                <span className="font-bold">{plan.maxUsers}</span> users
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TbCheck className="text-emerald-500 text-xl" />
                            <span>
                                <span className="font-bold">{plan.maxProjects}</span> projects
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TbCheck className="text-emerald-500 text-xl" />
                            <span>
                                <span className="font-bold">{plan.maxStorage}GB</span> storage
                            </span>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                        {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <TbCheck className="text-emerald-500 text-xl" />
                                <span>{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default SubscriptionSection
