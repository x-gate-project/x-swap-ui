import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { CloseIcon } from '../../../../theme'
import Column, { AutoColumn } from '../../../../components/Column'
import { RowBetween } from '../../../../components/Row'
import AutoSizer from 'react-virtualized-auto-sizer'

import styled from 'styled-components'
import CountriesList from '../CountriesList'
import { Country } from 'utils/alchemyPay'
import { useTranslation } from 'react-i18next'

export const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

export const SearchInput = styled.input`
  position: relative;
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  border-radius: 20px;
  color: ${({ theme }) => theme.text1};
  border-style: solid;
  border: 1px solid ${({ theme }) => theme.bg3};
  -webkit-appearance: none;

  font-size: 18px;

  ::placeholder {
    color: ${({ theme }) => theme.text3};
  }
  transition: border 100ms;
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }
`

export const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`

interface CountriesSearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedCountry: Country | null
  onCountrySelect: (country: Country) => void
  countries: Country[]
}

const CountriesSearch = ({ selectedCountry, onCountrySelect, onDismiss, isOpen, countries }: CountriesSearchProps) => {
  const { t } = useTranslation()
  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredCountries: Country[] = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return countries

    return countries.filter(country => country.countryName.toLowerCase().includes(query))
  }, [countries, searchQuery])

  const handleCountrySelect = useCallback(
    (country: Country) => {
      onCountrySelect(country)
      onDismiss()
    },
    [onDismiss, onCountrySelect]
  )

  useEffect(() => {
    if (isOpen) setSearchQuery('')
  }, [isOpen])

  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback(event => {
    const input = event.target.value
    setSearchQuery(input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (filteredCountries.length > 0) {
          handleCountrySelect(filteredCountries[0])
        }
      }
    },
    [filteredCountries, handleCountrySelect]
  )

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            {t('selectCountry')}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="country-search-input"
          placeholder={t('searchCountries')}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
      </PaddedColumn>

      <Separator />

      <div style={{ flex: '1' }}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <CountriesList
              height={height}
              countries={filteredCountries}
              onCountrySelect={handleCountrySelect}
              selectedCountry={selectedCountry}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>
    </Column>
  )
}

export default CountriesSearch
