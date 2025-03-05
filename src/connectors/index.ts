import { Web3Provider } from '@ethersproject/providers'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { PortisConnector } from '@web3-react/portis-connector'

import { FortmaticConnector } from './Fortmatic'
import { NetworkConnector } from './NetworkConnector'
import { InjectedConnector } from '../libs/injected-connector'

export const NETWORK_URL = process.env.REACT_APP_MAINNET_URL || ''
const FORMATIC_KEY = process.env.REACT_APP_FORTMATIC_KEY
const PORTIS_ID = process.env.REACT_APP_PORTIS_ID

const isSupportedJOC = Boolean(process.env.REACT_APP_JOC_FACTORY_ADDRESS && process.env.REACT_APP_JOC_V2_ROUTER_ADDRESS)
const isSupportedJOCT = Boolean(
  process.env.REACT_APP_JOCT_FACTORY_ADDRESS && process.env.REACT_APP_JOCT_V2_ROUTER_ADDRESS
)
let defaultChainId = 1
if (isSupportedJOCT) defaultChainId = 10081
if (isSupportedJOC) defaultChainId = 81
export const network = new NetworkConnector({
  urls: {
    [1]: process.env.REACT_APP_MAINNET_NETWORK_URL || '',
    [81]: process.env.REACT_APP_JOC_NETWORK_URL || '',
    [8453]: process.env.REACT_APP_BASE_NETWORK_URL || '',
    [43114]: process.env.REACT_APP_AVALANCHE_NETWORK_URL || '',
    [42161]: process.env.REACT_APP_ARBITRUM_ONE_NETWORK_URL || '',

    [11155111]: process.env.REACT_APP_SEPOLIA_NETWORK_URL || '',
    [10081]: process.env.REACT_APP_JOCT_NETWORK_URL || ''
  },
  defaultChainId
})

let networkLibrary: Web3Provider | undefined
export function getNetworkLibrary(): Web3Provider {
  return (networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any))
}

export const supportedChainIds = [1, 8453, 43114, 42161, 11155111]
if (isSupportedJOC) supportedChainIds.push(81)
if (isSupportedJOCT) supportedChainIds.push(10081)
export const injected = new InjectedConnector({ supportedChainIds })

// mainnet only
export const walletconnect = new WalletConnectConnector({
  rpc: { 1: NETWORK_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: 15000
})

// mainnet only
export const fortmatic = new FortmaticConnector({
  apiKey: FORMATIC_KEY ?? '',
  chainId: 1
})

// mainnet only
export const portis = new PortisConnector({
  dAppId: PORTIS_ID ?? '',
  networks: [1]
})

// mainnet only
export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  appName: 'Uniswap',
  appLogoUrl:
    'https://mpng.pngfly.com/20181202/bex/kisspng-emoji-domain-unicorn-pin-badges-sticker-unicorn-tumblr-emoji-unicorn-iphoneemoji-5c046729264a77.5671679315437924251569.jpg'
})
