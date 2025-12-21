'use client'

import Card from '@/components/ui/Card'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import type { FormSectionBaseProps } from './types'

type StatusSectionProps = FormSectionBaseProps

const statusOptions = [
    { value: 'TRIAL', label: 'Trial' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'SUSPENDED', label: 'Suspended' },
]

const StatusSection = ({ control, errors }: StatusSectionProps) => {
    return (
        <Card>
            <h4 className="mb-6">Status</h4>
            <FormItem
                label="Company Status"
                invalid={Boolean(errors.status)}
                errorMessage={errors.status?.message}
            >
                <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                        <Select
                            options={statusOptions}
                            placeholder="Select status"
                            {...field}
                            value={statusOptions.find(
                                (option) => option.value === field.value,
                            )}
                            onChange={(option) =>
                                field.onChange(option?.value)
                            }
                        />
                    )}
                />
            </FormItem>
        </Card>
    )
}

export default StatusSection
