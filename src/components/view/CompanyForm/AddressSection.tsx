'use client'

import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'

type AddressSectionProps = FormSectionBaseProps

const AddressSection = ({ control, errors }: AddressSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Address</h4>
            <FormItem
                label="Address"
                invalid={Boolean(errors.address)}
                errorMessage={errors.address?.message}
            >
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            autoComplete="off"
                            placeholder="Address"
                            {...field}
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default AddressSection
