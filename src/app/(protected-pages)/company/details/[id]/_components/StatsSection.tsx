'use client'

import Card from '@/components/ui/Card'
import {
    TbUsers,
    TbBriefcase,
    TbFolderOpen,
    TbShoppingCart,
    TbFileInvoice,
    TbCash,
} from 'react-icons/tb'
import type { CompanyDetail } from '../../../types'

type StatsSectionProps = {
    data: CompanyDetail
}

type StatCardProps = {
    icon: React.ReactNode
    title: string
    value: number
    color: string
}

const StatCard = ({ icon, title, value, color }: StatCardProps) => {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
                <div
                    className={`${color} w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl`}
                >
                    {icon}
                </div>
                <div>
                    <div className="text-3xl font-bold">{value}</div>
                    <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {title}
                    </div>
                </div>
            </div>
        </Card>
    )
}

const StatsSection = ({ data }: StatsSectionProps) => {
    const stats = [
        {
            icon: <TbUsers />,
            title: 'Total Users',
            value: data._count.users,
            color: 'bg-blue-500',
        },
        {
            icon: <TbBriefcase />,
            title: 'Employees',
            value: data._count.employees,
            color: 'bg-emerald-500',
        },
        {
            icon: <TbFolderOpen />,
            title: 'Projects',
            value: data._count.projects,
            color: 'bg-purple-500',
        },
        {
            icon: <TbShoppingCart />,
            title: 'Procurements',
            value: data._count.procurements,
            color: 'bg-amber-500',
        },
        {
            icon: <TbFileInvoice />,
            title: 'Invoices',
            value: data._count.invoices,
            color: 'bg-indigo-500',
        },
        {
            icon: <TbCash />,
            title: 'Expenses',
            value: data._count.expenses,
            color: 'bg-pink-500',
        },
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    )
}

export default StatsSection
