import React, { CSSProperties, MutableRefObject, useCallback, useContext } from 'react'
import { FixedSizeList } from 'react-window'
import styled, { ThemeContext } from 'styled-components'
import { Country } from 'utils/alchemyPay'
import { Text } from 'rebass'

const StyledListItem = styled.button<{ isSelected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: ${({ theme }) => theme.bg1};
  border: none;
  cursor: ${({ isSelected }) => (isSelected ? 'default' : 'pointer')};
  text-align: left;
  opacity: ${({ isSelected }) => (isSelected ? 0.5 : 1)};
  &:hover {
    background: ${({ isSelected, theme }) => (isSelected ? theme.bg1 : theme.bg2)};
  }
`

const CountryInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`

const ItemTitle = styled.div`
  font-weight: 700;
  color: ${({ theme }) => theme.text1};
`

interface CountriesListProps {
  height: number
  countries: Country[]
  selectedCountry: Country | null
  onCountrySelect: (country: Country) => void
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}

const CountriesList = ({ height, countries, selectedCountry, onCountrySelect, fixedListRef }: CountriesListProps) => {
  const theme = useContext(ThemeContext)

  const Row = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const country = countries[index]
      const isSelected = selectedCountry?.country === country.country

      return (
        <StyledListItem style={style} isSelected={isSelected} onClick={() => onCountrySelect(country)}>
          <img width={20} height={20} style={{ borderRadius: '9999px' }} src={country.logo} alt={country.countryName} />
          <CountryInfo>
            <ItemTitle>{country.countryName}</ItemTitle>
            <Text
              fontSize={12}
              color={theme.text3}
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: '100%'
              }}
            >
              {country.currency}
            </Text>
          </CountryInfo>
        </StyledListItem>
      )
    },
    [countries, selectedCountry, onCountrySelect, theme]
  )

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={countries}
      itemCount={countries.length}
      itemSize={56}
    >
      {Row}
    </FixedSizeList>
  )
}
export default CountriesList
