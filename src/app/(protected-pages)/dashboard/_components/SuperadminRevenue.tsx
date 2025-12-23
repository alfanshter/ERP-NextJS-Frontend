'use client'

import Card from '@/components/ui/Card'
import { TbCurrencyDollar, TbTrendingUp, TbCalendar } from 'react-icons/tb'
import { NumericFormat } from 'react-number-format'
import type { DashboardRevenue } from '../types'

type SuperadminRevenueProps = {
    revenue: DashboardRevenue
}

export default function SuperadminRevenue({ revenue }: SuperadminRevenueProps) {
    return (
        <Card>
            <div className="flex items-center gap-2 mb-4">
                <TbCurrencyDollar className="text-2xl text-emerald-600" />
                <h4>Revenue Overview</h4>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <TbCalendar className="text-lg" />
                        <span className="text-sm">Monthly Revenue</span>
                    </div>
                    <NumericFormat
                        displayType="text"
                        value={revenue.monthlyRevenue}
                        prefix="Rp "
                        thousandSeparator="."
                        decimalSeparator=","
                        className="text-3xl font-bold text-emerald-600"
                    />
                </div>
                
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <TbTrendingUp className="text-lg" />
                        <span className="text-sm">Yearly Revenue</span>
                    </div>
                    <NumericFormat
                        displayType="text"
                        value={revenue.yearlyRevenue}
                        prefix="Rp "
                        thousandSeparator="."
                        decimalSeparator=","
                        className="text-3xl font-bold text-blue-600"
                    />
                </div>
            </div>
            
            <div className="flex items-center gap-2 pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-semibold text-emerald-600 text-lg">
                        {revenue.activeSubscriptions}
                    </span>
                    <span>active subscriptions generating revenue</span>
                </div>
            </div>
        </Card>
    )
}
