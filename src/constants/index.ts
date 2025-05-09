import { ChainId, JSBI, Percent, Token, WETH } from '../libs/x-swap-sdk'
import { AbstractConnector } from '@web3-react/abstract-connector'

import { fortmatic, injected, portis, walletconnect, walletlink } from '../connectors'
import { WrappedTokenInfo } from '../state/lists/hooks'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[]
}

export const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18, 'DAI', 'Dai Stablecoin')
export const USDC = new Token(ChainId.MAINNET, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 6, 'USDC', 'USD//C')
export const USDT = new Token(ChainId.MAINNET, '0xdAC17F958D2ee523a2206206994597C13D831ec7', 6, 'USDT', 'Tether USD')
export const COMP = new Token(ChainId.MAINNET, '0xc00e94Cb662C3520282E6f5717214004A7f26888', 18, 'COMP', 'Compound')
export const MKR = new Token(ChainId.MAINNET, '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', 18, 'MKR', 'Maker')
export const AMPL = new Token(ChainId.MAINNET, '0xD46bA6D942050d489DBd938a2C909A5d5039A161', 9, 'AMPL', 'Ampleforth')
export const WBTC = new Token(ChainId.MAINNET, '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', 18, 'WBTC', 'Wrapped BTC')
export const USDTX_JOC = new WrappedTokenInfo(
  {
    chainId: ChainId.JAPAN_OPEN_CHAIN,
    address: '0xe18e898E5843E8a8EA7A1C4AF08730DcA6689aA9',
    decimals: 6,
    name: 'USDTX',
    symbol: 'USDTX',
    logoURI: 'https://raw.githubusercontent.com/x-gate-project/x-gate-token-list/main/assets/81_usdtx.svg'
  },
  []
)
export const USDCX_JOC = new WrappedTokenInfo(
  {
    chainId: ChainId.JAPAN_OPEN_CHAIN,
    address: '0x538F7567f16cbE40d051e9f2928d215343D9A13A',
    decimals: 6,
    name: 'USDCX',
    symbol: 'USDCX',
    logoURI: 'https://raw.githubusercontent.com/x-gate-project/x-gate-token-list/main/assets/81_usdcx.svg'
  },
  []
)
export const USDTX_JOCT = new WrappedTokenInfo(
  {
    chainId: ChainId.JAPAN_OPEN_CHAIN_TESTNET,
    address: '0x382eb09D8cE59968683001947EF04cB34f7A180E',
    decimals: 6,
    name: 'USDTX',
    symbol: 'USDTX',
    logoURI: 'https://raw.githubusercontent.com/x-gate-project/x-gate-token-list/main/assets/10081_usdtx.svg'
  },
  []
)
export const USDCX_JOCT = new WrappedTokenInfo(
  {
    chainId: ChainId.JAPAN_OPEN_CHAIN_TESTNET,
    address: '0x367f476c9B5fA1e64F3d7EE19c3E4E2f76D42200',
    decimals: 6,
    name: 'USDCX',
    symbol: 'USDCX',
    logoURI: 'https://raw.githubusercontent.com/x-gate-project/x-gate-token-list/main/assets/10081_usdcx.svg'
  },
  []
)

// Block time here is slightly higher (~1s) than average in order to avoid ongoing proposals past the displayed time
export const AVERAGE_BLOCK_TIME_IN_SECS = 14
export const PROPOSAL_LENGTH_IN_BLOCKS = 40_320
export const PROPOSAL_LENGTH_IN_SECS = AVERAGE_BLOCK_TIME_IN_SECS * PROPOSAL_LENGTH_IN_BLOCKS

export const TIMELOCK_ADDRESS = '0x1a9C8182C09F50C8318d769245beA52c32BE35BC'

const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
export const UNI: { [chainId in ChainId]?: Token } = {
  [ChainId.MAINNET]: new Token(ChainId.MAINNET, UNI_ADDRESS, 18, 'UNI', 'Uniswap')
}

export const COMMON_CONTRACT_NAMES: { [address: string]: string } = {
  [UNI_ADDRESS]: 'UNI',
  [TIMELOCK_ADDRESS]: 'Timelock'
}

// TODO: specify merkle distributor for mainnet
export const MERKLE_DISTRIBUTOR_ADDRESS: { [chainId in ChainId]?: string } = {
  [ChainId.MAINNET]: '0x090D4613473dEE047c3f2706764f49E0821D256e'
}

const WETH_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET]],
  [ChainId.JAPAN_OPEN_CHAIN]: [WETH[ChainId.JAPAN_OPEN_CHAIN]],
  [ChainId.BASE]: [WETH[ChainId.BASE]],
  [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE]],
  [ChainId.ARBITRUM_ONE]: [WETH[ChainId.ARBITRUM_ONE]],

  [ChainId.SEPOLIA]: [WETH[ChainId.SEPOLIA]],
  [ChainId.JAPAN_OPEN_CHAIN_TESTNET]: [WETH[ChainId.JAPAN_OPEN_CHAIN_TESTNET]]
}

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT, COMP, MKR],
  [ChainId.JAPAN_OPEN_CHAIN]: [...WETH_ONLY[ChainId.JAPAN_OPEN_CHAIN], USDTX_JOC, USDCX_JOC],
  [ChainId.JAPAN_OPEN_CHAIN_TESTNET]: [...WETH_ONLY[ChainId.JAPAN_OPEN_CHAIN_TESTNET], USDTX_JOCT, USDCX_JOCT]
}

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.MAINNET]: {
    [AMPL.address]: [DAI, WETH[ChainId.MAINNET]]
  }
}

// used for display in the default list when adding liquidity
export const SUGGESTED_BASES: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT],
  [ChainId.JAPAN_OPEN_CHAIN]: [...WETH_ONLY[ChainId.JAPAN_OPEN_CHAIN], USDTX_JOC, USDCX_JOC],
  [ChainId.JAPAN_OPEN_CHAIN_TESTNET]: [...WETH_ONLY[ChainId.JAPAN_OPEN_CHAIN_TESTNET], USDTX_JOCT, USDCX_JOCT]
}

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_ONLY,
  [ChainId.MAINNET]: [...WETH_ONLY[ChainId.MAINNET], DAI, USDC, USDT],
  [ChainId.JAPAN_OPEN_CHAIN]: [...WETH_ONLY[ChainId.JAPAN_OPEN_CHAIN], USDTX_JOC, USDCX_JOC],
  [ChainId.JAPAN_OPEN_CHAIN_TESTNET]: [...WETH_ONLY[ChainId.JAPAN_OPEN_CHAIN_TESTNET], USDTX_JOCT, USDCX_JOCT]
}

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.MAINNET]: [
    [
      new Token(ChainId.MAINNET, '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', 8, 'cDAI', 'Compound Dai'),
      new Token(ChainId.MAINNET, '0x39AA39c021dfbaE8faC545936693aC917d5E7563', 8, 'cUSDC', 'Compound USD Coin')
    ],
    [USDC, USDT],
    [DAI, USDT]
  ],
  [ChainId.JAPAN_OPEN_CHAIN]: [[USDTX_JOC, USDCX_JOC]],
  [ChainId.JAPAN_OPEN_CHAIN_TESTNET]: [[USDTX_JOCT, USDCX_JOCT]]
}

export interface WalletInfo {
  connector?: AbstractConnector
  name: string
  iconName: string
  description: string
  href: string | null
  color: string
  primary?: true
  mobile?: true
  mobileOnly?: true
}

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: 'arrow-right.svg',
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: 'metamask.png',
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D'
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'WalletConnect',
    iconName: 'walletConnectIcon.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    href: null,
    color: '#4196FC',
    mobile: true
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5'
  },
  COINBASE_LINK: {
    name: 'Open in Coinbase Wallet',
    iconName: 'coinbaseWalletIcon.svg',
    description: 'Open in Coinbase Wallet app.',
    href: 'https://go.cb-w.com/mtUDhEZPy1',
    color: '#315CF5',
    mobile: true,
    mobileOnly: true
  },
  FORTMATIC: {
    connector: fortmatic,
    name: 'Fortmatic',
    iconName: 'fortmaticIcon.png',
    description: 'Login using Fortmatic hosted wallet',
    href: null,
    color: '#6748FF',
    mobile: true
  },
  Portis: {
    connector: portis,
    name: 'Portis',
    iconName: 'portisIcon.png',
    description: 'Login using Portis hosted wallet',
    href: null,
    color: '#4A6C9B',
    mobile: true
  }
}

export const NetworkContextName = 'NETWORK'

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50
// 20 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = 60 * 20

export const BIG_INT_ZERO = JSBI.BigInt(0)

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000))
export const BIPS_BASE = JSBI.BigInt(10000)
// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE) // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE) // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE) // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE) // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE) // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)) // .01 ETH
export const BETTER_TRADE_LINK_THRESHOLD = new Percent(JSBI.BigInt(75), JSBI.BigInt(10000))
