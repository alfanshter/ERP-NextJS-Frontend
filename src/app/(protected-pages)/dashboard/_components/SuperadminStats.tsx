'use client'

import Card from '@/components/ui/Card'
import { TbBuilding, TbBuildingCommunity, TbUsers, TbFileInvoice, TbShoppingCart } from 'react-icons/tb'
import classNames from '@/utils/classNames'
import type { DashboardStats } from '../types'

type SuperadminStatsProps = {
    stats: DashboardStats
}

type StatCardProps = {
    title: string
    value: number
    icon: React.ReactNode
    iconClass: string
}

const StatCard = ({ title, value, icon, iconClass }: StatCardProps) => {
    return (
        <div className="p-4 rounded-2xl bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex justify-between items-center">
                <div>
                    <div className="mb-1 text-sm text-gray-600 dark:text-gray-400">{title}</div>
                    <h3 className="font-bold">{value}</h3>
                </div>
                <div
                    className={classNames(
                        'flex items-center justify-center min-h-12 min-w-12 max-h-12 max-w-12 text-gray-900 rounded-full text-2xl',
                        iconClass,
                    )}
                >
                    {icon}
                </div>
            </div>
        </div>
    )
}

export default function SuperadminStats({ stats }: SuperadminStatsProps) {
    return (
        <Card>
            <h4 className="mb-4">Overview</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <StatCard
                    title="Total Companies"
                    value={stats.totalCompanies}
                    icon={<TbBuilding />}
                    iconClass="bg-blue-200"
                />
                <StatCard
                    title="Active Companies"
                    value={stats.activeCompanies}
                    icon={<TbBuildingCommunity />}
                    iconClass="bg-emerald-200"
                />
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<TbUsers />}
                    iconClass="bg-purple-200"
                />
                <StatCard
                    title="Pricing Plans"
                    value={stats.totalPlans}
                    icon={<TbFileInvoice />}
                    iconClass="bg-amber-200"
                />
                <StatCard
                    title="Active Subscriptions"
                    value={stats.activeSubscriptions}
                    icon={<TbShoppingCart />}
                    iconClass="bg-red-200"
                />
            </div>
        </Card>
    )
}
