'use client'

import { useState, useCallback, useRef } from 'react'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { FormItem } from '@/components/ui/Form'
import { Controller } from 'react-hook-form'
import { apiSearchRegions, type RegionSearchResult } from '@/services/CommonService'
import debounce from 'lodash/debounce'
import type { FormSectionBaseProps } from './types'

type AddressSectionProps = FormSectionBaseProps

type RegionOptionType = {
    value: string
    label: string
    data: RegionSearchResult
}

const AddressSection = ({ control, errors }: AddressSectionProps) => {
    const [regionOptions, setRegionOptions] = useState<RegionOptionType[]>([])
    const [isLoadingRegions, setIsLoadingRegions] = useState(false)
    const [selectedRegionData, setSelectedRegionData] = useState<RegionSearchResult | null>(null)
    
    // Store refs to field setters
    const countrySetterRef = useRef<((value: string) => void) | null>(null)
    const citySetterRef = useRef<((value: string) => void) | null>(null)
    const postcodeSetterRef = useRef<((value: string) => void) | null>(null)

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
            setSelectedRegionData(option.data)
            // Use refs to update field values
            if (countrySetterRef.current) {
                countrySetterRef.current(option.value)
            }
            if (citySetterRef.current) {
                citySetterRef.current(option.data.city)
            }
            // Auto-fill postal code if available
            if (option.data.postalCode && postcodeSetterRef.current) {
                postcodeSetterRef.current(option.data.postalCode)
            }
        } else {
            setSelectedRegionData(null)
            if (countrySetterRef.current) {
                countrySetterRef.current('')
            }
            if (citySetterRef.current) {
                citySetterRef.current('')
            }
        }
    }
    
    return (
        <Card>
            <h4 className="mb-6">Address Information</h4>
            {/* Hidden controllers to get field setters */}
            <div style={{ display: 'none' }}>
                <Controller
                    name="country"
                    control={control}
                    render={({ field }) => {
                        countrySetterRef.current = field.onChange
                        return <input {...field} />
                    }}
                />
                <Controller
                    name="city"
                    control={control}
                    render={({ field }) => {
                        citySetterRef.current = field.onChange
                        return <input {...field} />
                    }}
                />
                <Controller
                    name="postcode"
                    control={control}
                    render={({ field }) => {
                        postcodeSetterRef.current = field.onChange
                        return <input {...field} />
                    }}
                />
            </div>
            <FormItem
                label="Region (Wilayah)"
                invalid={Boolean(errors.country)}
                errorMessage={errors.country?.message}
            >
                <Select
                    isClearable
                    placeholder="Cari kelurahan, kecamatan, atau kota..."
                    isLoading={isLoadingRegions}
                    options={regionOptions}
                    onInputChange={handleInputChange}
                    onChange={(option) => handleRegionChange(option as RegionOptionType | null)}
                    noOptionsMessage={({ inputValue }) => 
                        inputValue.length < 2 
                            ? 'Ketik minimal 2 karakter untuk mencari' 
                            : 'Tidak ada hasil'
                    }
                    filterOption={() => true} // Disable client-side filtering
                />
                {selectedRegionData && (
                    <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">Terpilih:</span> {selectedRegionData.village}, {selectedRegionData.district}, {selectedRegionData.city}, {selectedRegionData.province}
                    </div>
                )}
            </FormItem>
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
                            type="text"
                            autoComplete="off"
                            placeholder="Address"
                            {...field}
                        />
                    )}
                />
            </FormItem>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem
                    label="City"
                    invalid={Boolean(errors.city)}
                    errorMessage={errors.city?.message}
                >
                    <Controller
                        name="city"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="City"
                                {...field}
                                disabled
                            />
                        )}
                    />
                </FormItem>
                <FormItem
                    label="Postal Code"
                    invalid={Boolean(errors.postcode)}
                    errorMessage={errors.postcode?.message}
                >
                    <Controller
                        name="postcode"
                        control={control}
                        render={({ field }) => (
                            <Input
                                type="text"
                                autoComplete="off"
                                placeholder="Postal Code"
                                {...field}
                            />
                        )}
                    />
                </FormItem>
            </div>
        </Card>
    )
}

export default AddressSection
