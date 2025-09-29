import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { ChainId } from '../../libs/x-swap-sdk'
import { useActiveWeb3React } from '../../hooks'
import { ChevronDown, Loader } from 'react-feather'

const NetworkSwitcherContainer = styled.div`
  position: relative;
`

const NetworkButton = styled.button<{ isOpen: boolean; isDisabled?: boolean }>`
  background-color: rgba(243, 132, 30, 0.05);
  border: none;
  border-radius: 12px;
  padding: 8px 12px;
  color: ${({ theme }) => theme.yellow2};
  font-weight: 500;
  font-size: 14px;
  cursor: ${({ isDisabled }) => (isDisabled ? 'not-allowed' : 'pointer')};
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.6 : 1)};

  &:hover {
    background-color: ${({ isDisabled }) => !isDisabled && 'rgba(243, 132, 30, 0.1)'};
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin: 0;
    margin-right: 0.5rem;
    width: initial;
    overflow: hidden;
    text-overflow: ellipsis;
    flex-shrink: 1;
  `};
`

const DropdownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${({ theme }) => theme.bg1};
  border: 1px solid rgba(243, 132, 30, 0.2);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 200px;
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
`

const NetworkOption = styled.button<{ isActive: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: none;
  background: ${({ isActive }) => (isActive ? 'rgba(243, 132, 30, 0.1)' : 'transparent')};
  color: ${({ isActive, theme }) => (isActive ? theme.yellow2 : theme.text1)};
  text-align: left;
  cursor: pointer;
  font-size: 14px;
  font-weight: ${({ isActive }) => (isActive ? '600' : '400')};
  transition: background 0.2s ease;

  &:hover {
    background: rgba(243, 132, 30, 0.05);
    color: ${({ theme }) => theme.yellow2};
  }

  &:first-child {
    border-radius: 12px 12px 0 0;
  }

  &:last-child {
    border-radius: 0 0 12px 12px;
  }

  &:only-child {
    border-radius: 12px;
  }
`

const ChevronIcon = styled(ChevronDown)<{ isOpen: boolean }>`
  width: 16px;
  height: 16px;
  transition: transform 0.2s ease;
  transform: ${({ isOpen }) => (isOpen ? 'rotate(180deg)' : 'rotate(0deg)')};
`

const LoadingSpinner = styled(Loader)`
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

const NETWORK_INFO: { [chainId in ChainId]?: { name: string; color?: string } } = {
  [ChainId.MAINNET]: { name: 'Ethereum Mainnet', color: '#627EEA' },
  [ChainId.JAPAN_OPEN_CHAIN]: { name: 'Japan Open Chain', color: '#F7931A' },
  [ChainId.BASE]: { name: 'Base', color: '#0052FF' },
  [ChainId.AVALANCHE]: { name: 'Avalanche', color: '#E84142' },
  [ChainId.ARBITRUM_ONE]: { name: 'Arbitrum One', color: '#28A0F0' }
}

// Supported networks for switching
const SUPPORTED_NETWORKS = [
  ChainId.MAINNET,
  ChainId.JAPAN_OPEN_CHAIN,
  ChainId.BASE,
  ChainId.AVALANCHE,
  ChainId.ARBITRUM_ONE
]

export default function NetworkSwitcher() {
  const { chainId, library, activate, deactivate } = useActiveWeb3React()
  const [isOpen, setIsOpen] = useState(false)
  const [detectedChainId, setDetectedChainId] = useState<ChainId | undefined>(chainId)
  const [isSwitching, setIsSwitching] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Listen for network changes
  useEffect(() => {
    if (!window.ethereum) return

    const handleChainChanged = (newChainId: string) => {
      const chainIdNumber = parseInt(newChainId, 16) as ChainId
      setDetectedChainId(chainIdNumber)
      setIsOpen(false) // Close dropdown when network changes

      // Force Web3React to refresh its state
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }

    const handleAccountsChanged = () => {
      // Refresh when accounts change
      window.location.reload()
    }

    ;(window.ethereum as any).on('chainChanged', handleChainChanged)
    ;(window.ethereum as any).on('accountsChanged', handleAccountsChanged)

    return () => {
      if (window.ethereum) {
        ;(window.ethereum as any).removeListener('chainChanged', handleChainChanged)
        ;(window.ethereum as any).removeListener('accountsChanged', handleAccountsChanged)
      }
    }
  }, [])

  // Update detected chain ID when chainId prop changes
  useEffect(() => {
    if (chainId) {
      setDetectedChainId(chainId)
      setIsInitialized(true)
      return
    }

    // Set initialized after a brief delay to avoid showing "Select Network" immediately
    const timer = setTimeout(() => setIsInitialized(true), 100)
    return () => clearTimeout(timer)
  }, [chainId])

  const switchNetwork = async (targetChainId: ChainId) => {
    if (!window.ethereum || !(window.ethereum as any).request) {
      console.error('No ethereum provider found')
      return
    }

    setIsSwitching(true)
    setIsOpen(false)

    try {
      // Try to switch to the target network
      await (window.ethereum as any).request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }]
      })

      // Force refresh to update Web3React state
      setTimeout(() => {
        window.location.reload()
      }, 100)
    } catch (error) {
      // If the network hasn't been added to MetaMask, add it
      if ((error as any).code === 4902) {
        try {
          await addNetwork(targetChainId)

          // Force refresh after adding network
          setTimeout(() => {
            window.location.reload()
          }, 100)
        } catch (addError) {
          console.error('Failed to add network:', addError)
          setIsSwitching(false)
        }
      } else {
        console.error('Failed to switch network:', error)
        setIsSwitching(false)
      }
    }
  }

  const addNetwork = async (targetChainId: ChainId) => {
    if (!window.ethereum) return

    const networkParams = getNetworkParams(targetChainId)
    if (!networkParams) return

    try {
      await (window.ethereum as any).request({
        method: 'wallet_addEthereumChain',
        params: [networkParams]
      })
    } catch (error) {
      console.error('Failed to add network:', error)
    }
  }

  const getNetworkParams = (targetChainId: ChainId) => {
    switch (targetChainId) {
      case ChainId.JAPAN_OPEN_CHAIN:
        return {
          chainId: `0x${targetChainId.toString(16)}`,
          chainName: 'Japan Open Chain',
          nativeCurrency: {
            name: 'Japan Open Chain Token',
            symbol: 'JOC',
            decimals: 18
          },
          rpcUrls: ['https://rpc-1.japanopenchain.org:8545'],
          blockExplorerUrls: ['https://explorer.japanopenchain.org']
        }
      case ChainId.JAPAN_OPEN_CHAIN_TESTNET:
        return {
          chainId: `0x${targetChainId.toString(16)}`,
          chainName: 'Japan Open Chain Testnet',
          nativeCurrency: {
            name: 'Japan Open Chain Testnet Token',
            symbol: 'JOCT',
            decimals: 18
          },
          rpcUrls: ['https://rpc-1.testnet.japanopenchain.org:8545'],
          blockExplorerUrls: ['https://explorer.testnet.japanopenchain.org']
        }
      case ChainId.BASE:
        return {
          chainId: `0x${targetChainId.toString(16)}`,
          chainName: 'Base',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://mainnet.base.org'],
          blockExplorerUrls: ['https://basescan.org']
        }
      case ChainId.AVALANCHE:
        return {
          chainId: `0x${targetChainId.toString(16)}`,
          chainName: 'Avalanche C-Chain',
          nativeCurrency: {
            name: 'Avalanche',
            symbol: 'AVAX',
            decimals: 18
          },
          rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
          blockExplorerUrls: ['https://snowtrace.io']
        }
      case ChainId.ARBITRUM_ONE:
        return {
          chainId: `0x${targetChainId.toString(16)}`,
          chainName: 'Arbitrum One',
          nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://arb1.arbitrum.io/rpc'],
          blockExplorerUrls: ['https://arbiscan.io']
        }
      default:
        return null
    }
  }

  const getCurrentNetworkName = () => {
    if (isSwitching) return 'Switching...'
    if (!isInitialized) return 'Loading...'
    if (!detectedChainId) return 'Select Network'

    const networkInfo = NETWORK_INFO[detectedChainId]
    if (networkInfo) return networkInfo.name

    // For unsupported networks, show a cleaner message
    switch (detectedChainId) {
      case 56: return 'BNB Smart Chain'
      case 137: return 'Polygon'
      case 43113: return 'Avalanche Testnet'
      case 97: return 'BNB Testnet'
      case 5: return 'Goerli Testnet'
      case 3: return 'Ropsten'
      case 4: return 'Rinkeby'
      case 42: return 'Kovan'
      default: return `Chain ${detectedChainId}`
    }
  }

  const currentNetworkName = getCurrentNetworkName()

  return (
    <NetworkSwitcherContainer ref={containerRef}>
      <NetworkButton
        isOpen={isOpen}
        isDisabled={isSwitching}
        onClick={() => !isSwitching && setIsOpen(!isOpen)}
        title={currentNetworkName}
      >
        {currentNetworkName}
        {isSwitching && isInitialized ? <LoadingSpinner /> : <ChevronIcon isOpen={isOpen} />}
      </NetworkButton>

      <DropdownMenu isOpen={isOpen}>
        {SUPPORTED_NETWORKS.map((supportedChainId) => (
          <NetworkOption
            key={supportedChainId}
            isActive={detectedChainId === supportedChainId}
            onClick={() => switchNetwork(supportedChainId)}
          >
            {NETWORK_INFO[supportedChainId]?.name || `Chain ${supportedChainId}`}
          </NetworkOption>
        ))}
      </DropdownMenu>
    </NetworkSwitcherContainer>
  )
}