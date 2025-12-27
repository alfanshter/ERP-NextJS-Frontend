'use client'

import { useState, useCallback, useRef } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { apiSearchRegions, type RegionSearchResult } from '@/services/CommonService'
import debounce from 'lodash/debounce'
import type { FormSectionBaseProps, CompanyFormSchema } from './types'

type AddressSectionProps = FormSectionBaseProps

type RegionOptionType = {
    value: string
    label: string
    data: RegionSearchResult
}

const AddressSection = ({ control, errors }: AddressSectionProps) => {
    const [regionOptions, setRegionOptions] = useState<RegionOptionType[]>([])
    const [isLoadingRegions, setIsLoadingRegions] = useState(false)
    const { setValue, watch } = useFormContext<CompanyFormSchema>()

    const selectedRegion = watch('region')

    // Ref to store the debounced function
    const debouncedSearchRef = useRef(
        debounce(async (inputValue: string) => {
            if (inputValue.length < 2) {
                setRegionOptions([])
                setIsLoadingRegions(false)
                return
            }

            try {
                const results = await apiSearchRegions(inputValue, 10)
                if (Array.isArray(results)) {
                    const options = results.map((region) => ({
                        value: region.id,
                        label: region.fullName,
                        data: region,
                    }))
                    setRegionOptions(options)
                } else {
                    console.error('Unexpected response format:', results)
                    setRegionOptions([])
                }
            } catch (error) {
                console.error('Error searching regions:', error)
                setRegionOptions([])
            } finally {
                setIsLoadingRegions(false)
            }
        }, 300)
    )

    const handleInputChange = useCallback((inputValue: string) => {
        if (inputValue.length >= 2) {
            setIsLoadingRegions(true)
        }
        debouncedSearchRef.current(inputValue)
    }, [])

    const handleRegionChange = (option: RegionOptionType | null) => {
        if (option) {
            setValue('regionId', option.value)
            setValue('region', option.data)
            // Auto-fill postal code if available
            if (option.data.postalCode) {
                setValue('postalCode', option.data.postalCode)
            }
            // Auto-fill coordinates if available
            if (option.data.latitude) {
                setValue('latitude', String(option.data.latitude))
            }
            if (option.data.longitude) {
                setValue('longitude', String(option.data.longitude))
            }
        } else {
            setValue('regionId', undefined)
            setValue('region', null)
        }
    }

    return (
        <Card>
            <h4 className="mb-6">Address</h4>
            
            {/* Region Search */}
            <FormItem
                label="Region"
                className="mb-4"
            >
                <Select
                    isClearable
                    placeholder="Cari kelurahan, kecamatan, atau kota..."
                    isLoading={isLoadingRegions}
                    options={regionOptions}
                    value={selectedRegion ? {
                        value: selectedRegion.id,
                        label: selectedRegion.fullName,
                        data: selectedRegion
                    } : null}
                    onInputChange={handleInputChange}
                    onChange={(option) => handleRegionChange(option as RegionOptionType | null)}
                    noOptionsMessage={({ inputValue }) => 
                        inputValue.length < 2 
                            ? 'Ketik minimal 2 karakter untuk mencari' 
                            : 'Tidak ada hasil'
                    }
                    filterOption={() => true} // Disable client-side filtering
                />
                {selectedRegion && (
                    <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Terpilih:</span> {selectedRegion.village}, {selectedRegion.district}, {selectedRegion.city}, {selectedRegion.province}
                    </div>
                )}
            </FormItem>

            {/* Detail Address */}
            <FormItem
                label="Detail Alamat"
                invalid={Boolean(errors.address)}
                errorMessage={errors.address?.message}
                className="mb-4"
            >
                <Controller
                    name="address"
                    control={control}
                    render={({ field }) => (
                        <Input
                            textArea
                            autoComplete="off"
                            placeholder="Jl. Sudirman No. 123, RT 01/RW 02"
                            {...field}
                        />
                    )}
                />
            </FormItem>

            {/* Postal Code, Latitude, Longitude */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormItem
                    label="Kode Pos"
                    invalid={Boolean(errors.postalCode)}
                    errorMessage={errors.postalCode?.message}
                >
                    <Controller
                        name="postalCode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="12345"
                                {...field}
                                value={field.value || ''}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Latitude"
                    invalid={Boolean(errors.latitude)}
                    errorMessage={errors.latitude?.message}
                >
                    <Controller
                        name="latitude"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="-6.175392"
                                {...field}
                                value={field.value || ''}
                            />
                        )}
                    />
                </FormItem>

                <FormItem
                    label="Longitude"
                    invalid={Boolean(errors.longitude)}
                    errorMessage={errors.longitude?.message}
                >
                    <Controller
                        name="longitude"
                        control={control}
                        render={({ field }) => (
                            <Input
                                autoComplete="off"
                                placeholder="106.827153"
                                {...field}
                                value={field.value || ''}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default AddressSection
