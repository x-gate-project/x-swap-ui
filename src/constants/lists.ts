// the Uniswap Default token list lives here
export const DEFAULT_TOKEN_LIST_URL =
  process.env.REACT_APP_DEFAULT_TOKEN_LIST_URL ||
  'https://raw.githubusercontent.com/x-gate-project/x-swap-token-list/main/tokenlist.json'

export const DEFAULT_LIST_OF_LISTS: string[] = [
  DEFAULT_TOKEN_LIST_URL,
  'tokens.uniswap.eth',
  't2crtokens.eth', // kleros
  'tokens.1inch.eth', // 1inch
  'synths.snx.eth',
  'tokenlist.dharma.eth',
  'defi.cmc.eth',
  'erc20.cmc.eth',
  'stablecoin.cmc.eth',
  'tokenlist.zerion.eth',
  'tokenlist.aave.eth',
  // 'https://tokens.coingecko.com/uniswap/all.json',
  'https://app.tryroll.com/tokens.json',
  'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json',
  'https://defiprime.com/defiprime.tokenlist.json',
  'https://umaproject.org/uma.tokenlist.json'
]
