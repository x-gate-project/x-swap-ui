type QuoteBody = {
  side: 'BUY' | 'SELL'
  fiat: string
  crypto: string
  network?: string
  amount?: string
  country?: string
  paymentMethod?: string
}

export type QuoteResponse = {
  success: boolean
  returnCode: string
  returnMsg: string
  extend: string
  data?: {
    cryptoPrice: string
    rampFee: string
    cryptoNetworkFee: string
    cryptoQuantity: string
    networkFee: string
    rebateFiatAmount: string
    fiat: string
    rawRampFee: string
    rebateUsdAmount: string
    crypto: string
    payWayCode: string
    rampFeeInUSD: string
  }
  traceId: string
}

type FiatResponse = {
  success: boolean
  returnCode: string
  returnMsg: string
  extend: string
  data: {
    currency: string
    country: string
    payWayCode: string
    payWayName: string
    fixedFee: number
    feeRate: number
    payMin: number
    payMax: number
    countryName: string
  }[]
  traceId: string
}

type CryptoResponse = {
  success: boolean
  returnCode: string
  returnMsg: string
  extend: string
  data: Token[]
}

export type Country = {
  country: string
  currency: string
  countryName: string
  logo: string
  fixedFee: number
  feeRate: number
  payMin: number
  payMax: number
  payWays: {
    payWayCode: string
    payWayName: string
  }[]
}

export type Token = {
  crypto: string
  network: string
  buyEnable: number
  sellEnable: number
  minPurchaseAmount: number
  maxPurchaseAmount: number
  address: string | null
  icon: string
  minSellAmount: number | null
  maxSellAmount: number | null
}

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080'

export async function getOnRampUrl(params: {
  address: string
  crypto: string
  fiat: string
  fiatAmount: string
  merchantOrderNo: string
  network: string
  redirectUrl: string
}): Promise<string> {
  const queryParams = new URLSearchParams({
    address: params.address,
    crypto: params.crypto,
    fiat: params.fiat,
    fiatAmount: params.fiatAmount,
    merchantOrderNo: params.merchantOrderNo,
    network: params.network,
    redirectUrl: params.redirectUrl
  }).toString()

  const res = await fetch(`${BASE_URL}/api/onramp/url?${queryParams}`)
  const data = await res.json()
  return data.url
}

export async function getQuote(payload: QuoteBody): Promise<QuoteResponse | null> {
  const res = await fetch(`${BASE_URL}/api/quotes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  })
  return res.json()
}

export async function getFiatList(): Promise<FiatResponse | null> {
  const res = await fetch(`${BASE_URL}/api/fiat/list`)
  return res.json()
}

function getCountryLogo(country: string): string {
  return `https://static.alchemypay.org/alchemypay/flag/${country}.png`
}

export const groupFiatDataByCountry = (response: FiatResponse): Country[] => {
  if (!response.success) {
    return []
  }

  const countryMap = new Map<string, Country>()

  response.data.forEach(item => {
    const countryKey = item.country

    if (!countryMap.has(countryKey)) {
      countryMap.set(countryKey, {
        country: item.country,
        currency: item.currency,
        countryName: item.countryName,
        logo: getCountryLogo(item.country),
        fixedFee: item.fixedFee,
        feeRate: item.feeRate,
        payMin: item.payMin,
        payMax: item.payMax,
        payWays: []
      })
    }

    const country = countryMap.get(countryKey)
    if (country) {
      country.payWays.push({
        payWayCode: item.payWayCode,
        payWayName: item.payWayName
      })

      country.payMin = Math.min(country.payMin, item.payMin)
      country.payMax = Math.max(country.payMax, item.payMax)
    }
  })

  return Array.from(countryMap.values())
}

export async function getCryptoList(): Promise<CryptoResponse | null> {
  const res = await fetch(`${BASE_URL}/api/crypto/list`)
  return res.json()
}
