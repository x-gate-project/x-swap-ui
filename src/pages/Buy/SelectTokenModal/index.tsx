import React from 'react'
import Modal from '../../../components/Modal'
import TokenSearch from './TokenSearch'
import { Token } from 'utils/alchemyPay'

interface SelectTokenModalProps {
  isOpen: boolean
  onDismiss: () => void
  selectedToken: Token | null
  onTokenSelect: (token: Token) => void
  tokens: Token[]
}

const SelectTokenModal = ({ isOpen, onDismiss, selectedToken, onTokenSelect, tokens }: SelectTokenModalProps) => {
  const handleTokenSelect = (token: Token) => {
    onTokenSelect(token)
    onDismiss()
  }

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={80} minHeight={80}>
      <TokenSearch
        isOpen={isOpen}
        onDismiss={onDismiss}
        selectedToken={selectedToken}
        onTokenSelect={handleTokenSelect}
        tokens={tokens}
      />
    </Modal>
  )
}

export default SelectTokenModal
