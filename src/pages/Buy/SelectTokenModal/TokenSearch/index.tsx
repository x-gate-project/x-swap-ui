import React, { KeyboardEvent, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { FixedSizeList } from 'react-window'
import { Text } from 'rebass'
import { CloseIcon } from '../../../../theme'
import Column, { AutoColumn } from '../../../../components/Column'
import { RowBetween } from '../../../../components/Row'
import AutoSizer from 'react-virtualized-auto-sizer'

import styled from 'styled-components'
import { Token } from 'utils/alchemyPay'
import { useTranslation } from 'react-i18next'
import TokensList from '../TokensList'

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

interface TokenSearchProps {
  isOpen: boolean
  onDismiss: () => void
  selectedToken: Token | null
  onTokenSelect: (token: Token) => void
  tokens: Token[]
}

const TokenSearch = ({ selectedToken, onTokenSelect, onDismiss, isOpen, tokens }: TokenSearchProps) => {
  const { t } = useTranslation()
  const fixedList = useRef<FixedSizeList>()
  const [searchQuery, setSearchQuery] = useState<string>('')

  const filteredTokens: Token[] = useMemo(() => {
    const query = searchQuery.toLowerCase().trim()
    if (!query) return tokens

    return tokens.filter((token: Token) => token.crypto.toLowerCase().includes(query))
  }, [tokens, searchQuery])

  const handleTokenSelect = useCallback(
    (token: Token) => {
      onTokenSelect(token)
      onDismiss()
    },
    [onDismiss, onTokenSelect]
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
        if (filteredTokens.length > 0) {
          handleTokenSelect(filteredTokens[0])
        }
      }
    },
    [filteredTokens, handleTokenSelect]
  )

  return (
    <Column style={{ width: '100%', flex: '1 1' }}>
      <PaddedColumn gap="14px">
        <RowBetween>
          <Text fontWeight={500} fontSize={16}>
            {t('selectToken')}
          </Text>
          <CloseIcon onClick={onDismiss} />
        </RowBetween>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={t('searchTokens')}
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
            <TokensList
              height={height}
              tokens={filteredTokens}
              onTokenSelect={handleTokenSelect}
              selectedToken={selectedToken}
              fixedListRef={fixedList}
            />
          )}
        </AutoSizer>
      </div>
    </Column>
  )
}

export default TokenSearch
