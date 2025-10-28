import Column from 'components/Column'
import React, { CSSProperties, MutableRefObject, useCallback, useContext } from 'react'
import { FixedSizeList } from 'react-window'
import styled, { ThemeContext } from 'styled-components'
import { Token } from 'utils/alchemyPay'
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

const TokenIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

interface TokensListProps {
  height: number
  tokens: Token[]
  selectedToken: Token | null
  onTokenSelect: (token: Token) => void
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>
}

const TokensList = ({ height, tokens, selectedToken, onTokenSelect, fixedListRef }: TokensListProps) => {
  const theme = useContext(ThemeContext)

  const Row = useCallback(
    ({ index, style }: { index: number; style: CSSProperties }) => {
      const token = tokens[index]
      const isSelected = selectedToken?.crypto === token.crypto && selectedToken?.network === token.network

      return (
        <StyledListItem style={style} isSelected={isSelected} onClick={() => onTokenSelect(token)}>
          <TokenIcon>
            {token.icon && <img width={24} height={24} src={token.icon} alt={token.crypto} />}
            {!token.icon && (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  background: 'gray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}
              >
                {token.crypto.charAt(0).toUpperCase()}
              </div>
            )}
          </TokenIcon>
          <Column>
            <Text title={token.crypto} fontWeight={500} color={theme.text1}>
              {token.crypto}
            </Text>
            <Text fontSize={12} color={theme.text1}>
              {token.network}
            </Text>
          </Column>
        </StyledListItem>
      )
    },
    [tokens, selectedToken, onTokenSelect, theme]
  )

  return (
    <FixedSizeList
      height={height}
      ref={fixedListRef as any}
      width="100%"
      itemData={tokens}
      itemCount={tokens.length}
      itemSize={56}
    >
      {Row}
    </FixedSizeList>
  )
}
export default TokensList
