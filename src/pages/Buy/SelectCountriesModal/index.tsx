import React from 'react'
import Modal from '../../../components/Modal'
import CountriesSearch from './CountriesSearch'
import { Country } from 'utils/alchemyPay'

interface SelectCountriesModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCountry: Country | null
  onCountrySelect: (country: Country) => void
  countries: Country[]
}

const SelectCountriesModal = ({
  isOpen,
  onDismiss,
  selectedCountry,
  onCountrySelect,
  countries
}: SelectCountriesModalProps) => {
  const handleCountrySelect = (country: Country) => {
    onCountrySelect(country)
    onDismiss()
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <CountriesSearch
        isOpen={isOpen}
        onDismiss={onDismiss}
        selectedCountry={selectedCountry}
        onCountrySelect={handleCountrySelect}
        countries={countries}
      />
    </Modal>
  )
}

export default SelectCountriesModal
