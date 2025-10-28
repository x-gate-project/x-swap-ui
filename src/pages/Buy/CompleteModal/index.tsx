import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import Modal from '../../../components/Modal'
import { CloseIcon } from '../../../theme'
import Column, { AutoColumn } from '../../../components/Column'
import { RowBetween } from '../../../components/Row'
import { useTranslation } from 'react-i18next'

const PaddedColumn = styled(AutoColumn)`
  padding-top: 20px;
  padding-bottom: 12px;
`

const ProviderIconLarge = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.bg3};
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
`

const Small = styled.div`
  color: ${({ theme }) => theme.text3};
  font-size: 12px;
  text-align: center;
  margin-top: 10px;
`

const Title = styled.h2`
  font-weight: 700;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.text2};
  font-size: 20px;
  text-align: center;
`

const Description = styled.p`
  color: ${({ theme }) => theme.text3};
  margin-bottom: 24px;
  line-height: 1.6;
  text-align: center;
  font-size: 16px;
`

interface Provider {
  id: string
  title: string
  methods: string[]
  icon: string
}

interface CompleteModalProps {
  isOpen: boolean
  onClose: () => void
  selectedProvider: Provider
}

export default function CompleteModal({ isOpen, onClose, selectedProvider }: CompleteModalProps) {
  const { t } = useTranslation()
  return (
    <Modal isOpen={isOpen} onDismiss={onClose} maxHeight={80} minHeight={20}>
      <Column style={{ width: '100%', flex: '1 1', paddingBottom: '20px', paddingLeft: '24px', paddingRight: '24px' }}>
        <PaddedColumn gap="14px">
          <RowBetween>
            <CloseIcon onClick={onClose} />
          </RowBetween>
        </PaddedColumn>

        <ProviderIconLarge>
          <img width={48} height={48} src={selectedProvider.icon} alt={selectedProvider.title} />
        </ProviderIconLarge>

        <Title>{t('completeTitle', { provider: selectedProvider.title })}</Title>

        <Description>{t('completeDescription', { provider: selectedProvider.title })}</Description>

        <Small>{t('completeTerms', { provider: selectedProvider.title })}</Small>
      </Column>
    </Modal>
  )
}
