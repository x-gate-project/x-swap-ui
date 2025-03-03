import { ChainId } from '../../libs/x-swap-sdk'

import MULTICALL_ABI from './abi.json'
const MULTICALL_NETWORKS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: '0x1F98415757620B543A52E61c46B32eB19261F984',
  [ChainId.JAPAN_OPEN_CHAIN]: process.env.REACT_APP_JOC_MULTICALL_ADDRESS || '',
  [ChainId.BASE]: '0x091e99cb1C49331a94dD62755D168E941AbD0693',
  [ChainId.AVALANCHE]: '0x0139141Cd4Ee88dF3Cdb65881D411bAE271Ef0C2',
  [ChainId.ARBITRUM_ONE]: '0xadF885960B47eA2CD9B55E6DAc6B42b7Cb2806dB',

  [ChainId.SEPOLIA]: '0xD7F33bCdb21b359c8ee6F0251d30E94832baAd07',
  [ChainId.JAPAN_OPEN_CHAIN_TESTNET]: process.env.REACT_APP_JOC_MULTICALL_ADDRESS || ''
}

export { MULTICALL_ABI, MULTICALL_NETWORKS }
