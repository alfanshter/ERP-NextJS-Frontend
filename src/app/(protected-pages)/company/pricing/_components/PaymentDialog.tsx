'use client'

import { useState } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Segment from '@/components/ui/Segment'
import Switcher from '@/components/ui/Switcher'
import Notification from '@/components/ui/Notification'
import toast from '@/components/ui/toast'
import classNames from '@/utils/classNames'
import { usePricingStore } from '../_store/pricingStore'
import { createSubscription } from '@/services/CompanyService'
import { TbCheck } from 'react-icons/tb'
import { useRouter } from 'next/navigation'
import { NumericFormat } from 'react-number-format'
import { PaymentCycle } from '../types'

type PaymentDialogProps = {
    companyId?: string
}

const PaymentDialog = ({ companyId }: PaymentDialogProps) => {
    const [loading, setLoading] = useState(false)
    const [paymentSuccessful, setPaymentSuccessful] = useState(false)
    const [autoRenew, setAutoRenew] = useState(true)

    const router = useRouter()

    const { paymentDialog, setPaymentDialog, selectedPlan, setSelectedPlan, companyId: storeCompanyId } =
        usePricingStore()
    
    const activeCompanyId = companyId || storeCompanyId

    const handleDialogClose = async () => {
        setPaymentDialog(false)
        setSelectedPlan({})
        setPaymentSuccessful(false)
        setAutoRenew(true)
    }

    const handlePaymentChange = (paymentCycle: PaymentCycle) => {
        setSelectedPlan({
            ...selectedPlan,
            paymentCycle,
        })
    }

    const handlePay = async () => {
        if (!activeCompanyId || !selectedPlan.planId) {
            toast.push(
                <Notification type="danger" title="Error">
                    Data tidak lengkap. Silakan pilih plan terlebih dahulu.
                </Notification>,
                { placement: 'top-center' }
            )
            return
        }

        setLoading(true)

        const billingPeriod = selectedPlan.paymentCycle === 'monthly' ? 'MONTHLY' : 'YEARLY'
        
        const result = await createSubscription({
            planId: selectedPlan.planId,
            companyId: activeCompanyId,
            billingPeriod,
            autoRenew,
            startDate: new Date().toISOString(),
        })

        setLoading(false)

        if (result.success) {
            setPaymentSuccessful(true)
            toast.push(
                <Notification type="success" title="Berhasil">
                    Subscription berhasil dibuat!
                </Notification>,
                { placement: 'top-center' }
            )
        } else {
            toast.push(
                <Notification type="danger" title="Gagal">
                    {result.message || 'Gagal membuat subscription'}
                </Notification>,
                { placement: 'top-center' }
            )
        }
    }

    const handleBackToCompany = async () => {
        if (activeCompanyId) {
            router.push(`/company/details/${activeCompanyId}`)
        } else {
            router.push('/company')
        }
        await handleDialogClose()
    }

    return (
        <Dialog
            isOpen={paymentDialog}
            closable={!paymentSuccessful}
            onClose={handleDialogClose}
            onRequestClose={handleDialogClose}
        >
            {paymentSuccessful ? (
                <>
                    <div className="text-center mt-6 mb-2">
                        <div className="inline-flex rounded-full p-5 bg-success">
                            <TbCheck className="text-5xl text-white" />
                        </div>
                        <div className="mt-6">
                            <h4>Subscription Berhasil!</h4>
                            <p className="text-base max-w-[400px] mx-auto mt-4 leading-relaxed">
                                Subscription telah berhasil dibuat. Company sekarang sudah memiliki akses ke paket yang dipilih.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-8">
                            <Button block onClick={handleBackToCompany}>
                                Kembali ke Company
                            </Button>
                            <Button
                                block
                                variant="solid"
                                onClick={handleDialogClose}
                            >
                                Tutup
                            </Button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <h4>{selectedPlan.planName}</h4>
                    <div className="mt-6">
                        <Segment
                            defaultValue={selectedPlan.paymentCycle}
                            className="gap-4 flex bg-transparent dark:bg-transparent"
                            onChange={(value) =>
                                handlePaymentChange(value as PaymentCycle)
                            }
                        >
                            {Object.entries(selectedPlan.finalPrice || {}).map(
                                ([key, value]) => (
                                    <Segment.Item key={key} value={key}>
                                        {({ active, onSegmentItemClick }) => {
                                            return (
                                                <div
                                                    className={classNames(
                                                        'flex justify-between border rounded-xl border-gray-300 dark:border-gray-600 py-5 px-4 select-none ring-1 w-1/2',
                                                        active
                                                            ? 'ring-primary border-primary'
                                                            : 'ring-transparent bg-gray-100 dark:bg-gray-600',
                                                    )}
                                                    role="button"
                                                    onClick={onSegmentItemClick}
                                                >
                                                    <div>
                                                        <div className="heading-text mb-0.5">
                                                            Bayar{' '}
                                                            {key === 'monthly'
                                                                ? 'Bulanan'
                                                                : 'Tahunan'}
                                                        </div>
                                                        <span className="text-lg font-bold heading-text flex gap-0.5">
                                                            <NumericFormat
                                                                displayType="text"
                                                                value={value}
                                                                prefix={'Rp '}
                                                                thousandSeparator="."
                                                                decimalSeparator=","
                                                            />
                                                            <span>{'/'}</span>
                                                            <span>
                                                                {key ===
                                                                'monthly'
                                                                    ? 'bulan'
                                                                    : 'tahun'}
                                                            </span>
                                                        </span>
                                                    </div>
                                                    {active && (
                                                        <TbCheck className="text-primary text-xl" />
                                                    )}
                                                </div>
                                            )
                                        }}
                                    </Segment.Item>
                                ),
                            )}
                        </Segment>
                    </div>
                    <div className="mt-6 border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="font-semibold">Auto Renew</span>
                                <p className="text-sm text-gray-500">
                                    Perpanjang subscription otomatis saat masa berlaku habis
                                </p>
                            </div>
                            <Switcher
                                checked={autoRenew}
                                onChange={(checked) => setAutoRenew(checked)}
                            />
                        </div>
                    </div>
                    <div className="mt-6 flex flex-col items-end">
                        <h4>
                            <span>Tagihan: </span>
                            <span>
                                <NumericFormat
                                    displayType="text"
                                    value={
                                        selectedPlan.finalPrice?.[
                                            selectedPlan.paymentCycle as PaymentCycle
                                        ]
                                    }
                                    prefix={'Rp '}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                />
                            </span>
                        </h4>
                        <div className="max-w-[350px] ltr:text-right rtl:text-left leading-none mt-2 opacity-80">
                            <small>
                                Dengan menekan &quot;Konfirmasi&quot;, subscription akan langsung aktif untuk company ini.
                            </small>
                        </div>
                    </div>
                    <div className="mt-6">
                        <Button
                            block
                            variant="solid"
                            loading={loading}
                            onClick={handlePay}
                            disabled={!activeCompanyId}
                        >
                            {activeCompanyId ? 'Konfirmasi Subscription' : 'Company ID tidak ditemukan'}
                        </Button>
                    </div>
                </>
            )}
        </Dialog>
    )
}

export default PaymentDialog
