import JSBI from 'jsbi'

// exports for external consumption
export type BigintIsh = JSBI | bigint | string

export enum ChainId {
  MAINNET = 1,
  JAPAN_OPEN_CHAIN = 81,
  BASE = 8453,
  AVALANCHE = 43114,
  ARBITRUM_ONE = 42161,

  SEPOLIA = 11155111,
  JAPAN_OPEN_CHAIN_TESTNET = 10081
}

export enum TradeType {
  EXACT_INPUT,
  EXACT_OUTPUT
}

export enum Rounding {
  ROUND_DOWN,
  ROUND_HALF_UP,
  ROUND_UP
}

export const INIT_CODE_HASH = '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'

export const MINIMUM_LIQUIDITY = JSBI.BigInt(1000)

// exports for internal consumption
export const ZERO = JSBI.BigInt(0)
export const ONE = JSBI.BigInt(1)
export const TWO = JSBI.BigInt(2)
export const THREE = JSBI.BigInt(3)
export const FIVE = JSBI.BigInt(5)
export const TEN = JSBI.BigInt(10)
export const _100 = JSBI.BigInt(100)
export const _997 = JSBI.BigInt(997)
export const _1000 = JSBI.BigInt(1000)

export enum SolidityType {
  uint8 = 'uint8',
  uint256 = 'uint256'
}

export const SOLIDITY_TYPE_MAXIMA = {
  [SolidityType.uint8]: JSBI.BigInt('0xff'),
  [SolidityType.uint256]: JSBI.BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff')
}

type AddressMap = { [chainId: number]: string }

export const V2_FACTORY_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]: '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f',
  [ChainId.JAPAN_OPEN_CHAIN]: process.env.REACT_APP_JOC_FACTORY_ADDRESS || '',
  [ChainId.ARBITRUM_ONE]: '0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9',
  [ChainId.AVALANCHE]: '0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C',
  [ChainId.BASE]: '0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6',

  [ChainId.SEPOLIA]: '0xF62c03E08ada871A0bEb309762E260a7a6a880E6',
  [ChainId.JAPAN_OPEN_CHAIN_TESTNET]: process.env.REACT_APP_JOCT_FACTORY_ADDRESS || ''
}

export const V2_ROUTER_ADDRESSES: AddressMap = {
  [ChainId.MAINNET]: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
  [ChainId.JAPAN_OPEN_CHAIN]: process.env.REACT_APP_JOC_FACTORY_ADDRESS || '',
  [ChainId.ARBITRUM_ONE]: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
  [ChainId.AVALANCHE]: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',
  [ChainId.BASE]: '0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24',

  [ChainId.SEPOLIA]: '0xeE567Fe1712Faf6149d80dA1E6934E354124CfE3',
  [ChainId.JAPAN_OPEN_CHAIN_TESTNET]: process.env.REACT_APP_JOCT_V2_ROUTER_ADDRESS || ''
}
