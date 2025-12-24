'use client'

import Button from '@/components/ui/Button'
import Tag from '@/components/ui/Tag'
import { usePricingStore } from '../_store/pricingStore'
import classNames from '@/utils/classNames'
import isLastChild from '@/utils/isLastChild'
import { NumericFormat } from 'react-number-format'
import { TbCheck } from 'react-icons/tb'
import type { GetPricingPanResponse } from '../types'

type PlansProps = {
    data: GetPricingPanResponse
    subcription?: string
    cycle?: string
}

const Plans = ({ data, subcription, cycle }: PlansProps) => {
    const { paymentCycle, setPaymentDialog, setSelectedPlan } =
        usePricingStore()

    return (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 xl:gap-4">
            {data?.plans.map((plan, index) => {
                const currentDiscount = plan.discount[paymentCycle]
                const hasDiscount = currentDiscount > 0
                const originalPrice = plan.originalPrice[paymentCycle]
                const finalPrice = plan.price[paymentCycle]

                return (
                    <div
                        key={plan.id}
                        className={classNames(
                            'px-6 pt-2 flex flex-col justify-between',
                            !isLastChild(data.plans, index) &&
                                'border-r-0 xl:border-r border-gray-200 dark:border-gray-700',
                        )}
                    >
                        <div>
                            <h5 className="mb-6 flex items-center gap-2">
                                <span>{plan.name}</span>
                                {plan.recommended && (
                                    <Tag className="rounded-full bg-green-200 font-bold">
                                        Recommended
                                    </Tag>
                                )}
                                {hasDiscount && (
                                    <Tag className="rounded-full bg-red-200 font-bold text-red-700">
                                        {plan.discountType === 'PERCENTAGE'
                                            ? `-${currentDiscount}%`
                                            : `Save Rp ${currentDiscount.toLocaleString('id-ID')}`}
                                    </Tag>
                                )}
                            </h5>
                            <div className="">{plan.description}</div>
                            <div className="mt-6">
                                {hasDiscount && (
                                    <div className="text-gray-400 line-through text-sm mb-1">
                                        <NumericFormat
                                            displayType="text"
                                            value={originalPrice}
                                            prefix={'Rp '}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                        />
                                    </div>
                                )}
                                <NumericFormat
                                    className="h1"
                                    displayType="text"
                                    value={finalPrice}
                                    prefix={'Rp '}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                />
                                <span className="text-lg font-bold">
                                    {' '}
                                    /{' '}
                                    {paymentCycle === 'monthly' ? 'bulan' : 'tahun'}
                                </span>
                            </div>
                            <div className="flex flex-col gap-4 border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                                {plan.features.map((feature, featureIndex) => (
                                    <div
                                        key={featureIndex}
                                        className="flex items-center gap-4 font-semibold heading-text"
                                    >
                                        <TbCheck className="text-2xl text-primary" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-10">
                            <Button
                                block
                                disabled={
                                    subcription === plan.id &&
                                    cycle === paymentCycle
                                }
                                onClick={() => {
                                    setSelectedPlan({
                                        paymentCycle,
                                        planId: plan.id,
                                        planName: plan.name,
                                        price: plan.originalPrice,
                                        finalPrice: plan.price,
                                        discount: plan.discount,
                                        discountType: plan.discountType,
                                    })
                                    setPaymentDialog(true)
                                }}
                            >
                                {subcription === plan.id && cycle === paymentCycle
                                    ? 'Current plan'
                                    : 'Select plan'}
                            </Button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Plans
