'use client'

import { useEffect, useState } from 'react'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import Spinner from '@/components/ui/Spinner'
import { TbCheck, TbCrown, TbCalendar, TbRefresh, TbCreditCard } from 'react-icons/tb'
import dayjs from 'dayjs'
import Link from 'next/link'
import { getCompanySubscription } from '@/services/CompanyService'
import type { Subscription } from '../../../types'

type SubscriptionSectionProps = {
    companyId: string
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'bg-emerald-200 dark:bg-emerald-200 text-gray-900 dark:text-gray-900'
        case 'TRIAL':
            return 'bg-blue-200 dark:bg-blue-200 text-gray-900 dark:text-gray-900'
        case 'EXPIRED':
            return 'bg-red-200 dark:bg-red-200 text-gray-900 dark:text-gray-900'
        case 'CANCELLED':
            return 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900'
        default:
            return 'bg-gray-200 dark:bg-gray-200 text-gray-900 dark:text-gray-900'
    }
}

const SubscriptionSection = ({ companyId }: SubscriptionSectionProps) => {
    const [subscription, setSubscription] = useState<Subscription | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                setLoading(true)
                const response = await getCompanySubscription(companyId)
                setSubscription(response.subscription)
            } catch (error) {
                console.error('Error fetching subscription:', error)
                setSubscription(null)
            } finally {
                setLoading(false)
            }
        }

        fetchSubscription()
    }, [companyId])

    if (loading) {
        return (
            <Card>
                <div className="flex items-center justify-center py-12">
                    <Spinner size={40} />
                </div>
            </Card>
        )
    }

    if (!subscription) {
        return (
            <Card>
                <div className="text-center py-8">
                    <TbCrown className="text-6xl mx-auto mb-4 text-gray-400" />
                    <h5 className="mb-2">No Active Subscription</h5>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        This company doesn&apos;t have an active subscription plan yet.
                    </p>
                    <Link href={`/company/pricing?companyId=${companyId}`}>
                        <Button variant="solid">
                            Assign Subscription Plan
                        </Button>
                    </Link>
                </div>
            </Card>
        )
    }

    const { plan } = subscription
    const isMonthly = subscription.billingPeriod === 'MONTHLY'

    return (
        <div className="space-y-6">
            {/* Current Plan Card */}
            <Card>
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <TbCrown className="text-3xl text-amber-500" />
                            <h5>{plan.name}</h5>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            {plan.description}
                        </p>
                    </div>
                    <Badge className={getStatusColor(subscription.status)}>
                        {subscription.status}
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TbCreditCard className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Harga Saat Ini
                            </span>
                        </div>
                        <p className="text-xl font-bold text-primary">
                            Rp {subscription.price?.toLocaleString('id-ID') || '0'}
                            <span className="text-sm text-gray-500 font-normal">
                                /{isMonthly ? 'bulan' : 'tahun'}
                            </span>
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TbCalendar className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Periode Billing
                            </span>
                        </div>
                        <p className="text-lg font-bold">
                            {isMonthly ? 'Bulanan' : 'Tahunan'}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TbRefresh className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Auto Renew
                            </span>
                        </div>
                        <p className="text-lg font-bold">
                            {subscription.autoRenew ? 'Aktif' : 'Tidak Aktif'}
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <TbCalendar className="text-gray-500" />
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Billing Selanjutnya
                            </span>
                        </div>
                        <p className="text-lg font-bold">
                            {subscription.nextBillingAt 
                                ? dayjs(subscription.nextBillingAt).format('DD MMM YYYY')
                                : '-'}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Tanggal Mulai
                        </span>
                        <p className="font-bold mt-1">
                            {dayjs(subscription.startDate).format('DD MMM YYYY')}
                        </p>
                    </div>
                    <div>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Tanggal Berakhir
                        </span>
                        <p className="font-bold mt-1">
                            {subscription.endDate 
                                ? dayjs(subscription.endDate).format('DD MMM YYYY')
                                : 'Tidak ada batas'}
                        </p>
                    </div>
                    {subscription.trialEndDate && (
                        <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Trial Berakhir
                            </span>
                            <p className="font-bold mt-1">
                                {dayjs(subscription.trialEndDate).format('DD MMM YYYY')}
                            </p>
                        </div>
                    )}
                    {subscription.lastPaymentAt && (
                        <div>
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Pembayaran Terakhir
                            </span>
                            <p className="font-bold mt-1">
                                {dayjs(subscription.lastPaymentAt).format('DD MMM YYYY')}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex gap-2">
                    <Link href={`/company/pricing?companyId=${companyId}`} className="flex-1">
                        <Button variant="solid" className="w-full">
                            Ubah Paket
                        </Button>
                    </Link>
                    <Button variant="default" className="flex-1">
                        Batalkan Langganan
                    </Button>
                </div>
            </Card>

            {/* Plan Features Card */}
            <Card>
                <h6 className="mb-4">Fitur Paket</h6>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Limits */}
                    <div>
                        <h6 className="text-sm text-gray-500 mb-3">Batasan</h6>
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <TbCheck className="text-emerald-500 text-xl" />
                                <span>
                                    <span className="font-bold">{plan.maxUsers || 'Unlimited'}</span> users
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TbCheck className="text-emerald-500 text-xl" />
                                <span>
                                    <span className="font-bold">{plan.maxProjects || 'Unlimited'}</span> projects
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TbCheck className="text-emerald-500 text-xl" />
                                <span>
                                    <span className="font-bold">{plan.maxStorage ? `${plan.maxStorage}GB` : 'Unlimited'}</span> storage
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div>
                        <h6 className="text-sm text-gray-500 mb-3">Fitur</h6>
                        <div className="space-y-3">
                            {plan.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <TbCheck className="text-emerald-500 text-xl" />
                                    <span>{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pricing Info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <h6 className="text-sm text-gray-500 mb-3">Harga Paket</h6>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-sm text-gray-500">Bulanan</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-xl font-bold">
                                    Rp {plan.monthlyPrice?.toLocaleString('id-ID') || '0'}
                                </span>
                                {plan.monthlyDiscount > 0 && (
                                    <Badge className="bg-red-200 text-red-700">
                                        {plan.discountType === 'PERCENTAGE' 
                                            ? `-${plan.monthlyDiscount}%` 
                                            : `Hemat Rp ${plan.monthlyDiscount.toLocaleString('id-ID')}`}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <span className="text-sm text-gray-500">Tahunan</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-xl font-bold">
                                    Rp {plan.yearlyPrice?.toLocaleString('id-ID') || '0'}
                                </span>
                                {plan.yearlyDiscount > 0 && (
                                    <Badge className="bg-red-200 text-red-700">
                                        {plan.discountType === 'PERCENTAGE' 
                                            ? `-${plan.yearlyDiscount}%` 
                                            : `Hemat Rp ${plan.yearlyDiscount.toLocaleString('id-ID')}`}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    )
}

export default SubscriptionSection
