import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Modal from '../../../components/Modal'
import { Text } from 'rebass'
import { CloseIcon } from '../../../theme'
import Column, { AutoColumn } from '../../../components/Column'
import { RowBetween } from '../../../components/Row'
import { MenuItem } from '../../../components/SearchModal/styleds'
import { ChevronRight } from 'react-feather'
import { Token } from 'utils/alchemyPay'
import { useTranslation } from 'react-i18next'

const PaddedColumn = styled(AutoColumn)`
  padding: 20px;
  padding-bottom: 12px;
`

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.bg2};
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`

const List = styled.div`
  padding: 0 0px 0px;
  max-height: 60vh;
  overflow: auto;
`

const ProviderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.bg3};
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`

const Small = styled.div`
  color: ${({ theme }) => theme.text3};
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
`

interface Provider {
  id: string
  title: string
  methods: string[]
  icon: string
}

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  providers: Provider[]
  onProviderSelect: (providerId: string) => void
  selectedToken: Token | null
}

export default function CheckoutModal({
  isOpen,
  onClose,
  amount,
  providers,
  onProviderSelect,
  selectedToken
}: CheckoutModalProps) {
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onDismiss={onClose} maxHeight={80} minHeight={20}>
      <Column style={{ width: '100%', flex: '1 1', paddingBottom: '20px' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <CloseIcon onClick={onClose} />
          </RowBetween>
        </PaddedColumn>

        <Separator />

        <div style={{ padding: '20px 20px' }}>
          <Row>
            <Text fontWeight={800} fontSize={18}>
              {t('checkout')}
            </Text>
            <Row>
              <Text color="#a7a7ad" fontWeight={700}>
                ${amount?.toFixed(2) || '--'}
              </Text>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <img width={24} height={24} src={selectedToken?.icon || ''} alt={selectedToken?.crypto || ''} />
              </div>
            </Row>
          </Row>
        </div>

        <List>
          {providers.map(p => (
            <MenuItem key={p.id} onClick={() => onProviderSelect(p.id)} style={{ width: '100%', display: 'flex' }}>
              <ProviderIcon>
                <img width={20} height={20} src={p.icon} alt={p.title} />
              </ProviderIcon>
              <Column>
                <Text fontWeight={500}>{p.title}</Text>
                <Text fontSize={12} color="text3">
                  {p.methods.join(', ')}
                </Text>
              </Column>
              <ChevronRight style={{ marginLeft: 'auto' }} size={16} color={theme.text1} />
            </MenuItem>
          ))}
        </List>

        <Small>{t('checkoutTerms')}</Small>
      </Column>
    </Modal>
  )
}
