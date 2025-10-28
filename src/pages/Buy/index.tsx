import React, { useCallback, useContext, useEffect, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import CheckoutModal from './CheckoutModal'
import CompleteModal from './CompleteModal'
import crypto from 'crypto'
import SelectTokenModal from './SelectTokenModal'
import SelectCountriesModal from './SelectCountriesModal'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'
import { ChevronDown, ChevronRight } from 'react-feather'
import { ButtonLight, ButtonPrimary } from '../../components/Button'
import Loader from '../../components/Loader'
import useDebounce from '../../hooks/useDebounce'
import {
  Country,
  getCryptoList,
  getFiatList,
  getOnRampUrl,
  getQuote,
  groupFiatDataByCountry,
  QuoteResponse,
  Token
} from 'utils/alchemyPay'
import { useTranslation } from 'react-i18next'

const PROVIDERS = [
  {
    id: 'alchemyPay',
    title: 'AlchemyPay',
    methods: ['Visa/Mastercard', 'Apple Pay', 'Google Pay'],
    icon: 'images/alchemypay_icon.png'
  }
]

const parseUrlParams = () => {
  let searchParams = window.location.search
  if (!searchParams && window.location.hash.includes('?')) {
    const hashParts = window.location.hash.split('?')
    if (hashParts.length > 1) {
      searchParams = '?' + hashParts[1]
    }
  }

  const urlParams = new URLSearchParams(searchParams)
  return {
    amount: urlParams.get('amount') || '',
    crypto: urlParams.get('crypto') || '',
    fiat: urlParams.get('fiat') || '',
    network: urlParams.get('network') || ''
  }
}

const getCountryFromLanguage = (language: string): string | null => {
  const languageToCountry: Record<string, string> = {
    'en-US': 'US',
    'en-GB': 'GB',
    en: 'US',
    'zh-CN': 'CN',
    'zh-TW': 'TW',
    zh: 'CN',
    'es-US': 'US',
    'es-AR': 'AR',
    es: 'US',
    'it-IT': 'IT',
    it: 'IT',
    vi: 'VN',
    ru: 'RU',
    ro: 'RO',
    iw: 'IL',
    he: 'IL'
  }

  if (languageToCountry[language]) {
    return languageToCountry[language]
  }

  const baseLanguage = language.split('-')[0]
  if (languageToCountry[baseLanguage]) {
    return languageToCountry[baseLanguage]
  }

  return null
}

const PageContainer = styled.div`
  padding: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.white};
`

const AppShell = styled.div`
  width: 100%;
  max-width: 464px;
  display: grid;
  gap: 16px;
`

const Card = styled.div`
  background: ${({ theme }) => theme.bg1};
  border-radius: 30px;
  padding: 16px;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04),
    0px 24px 32px rgba(0, 0, 0, 0.01);
`

const BuyingHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  margin-bottom: 20px;
`

const RegionBadge = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 4px 6px;
  border-radius: 16px;
  background: ${({ theme }) => theme.bg2};
  border: 1px solid ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text2};
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.bg3};
  }
`

const AmountPanel = styled.div`
  background: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 20px;
  padding: 12px 12px 44px;
  display: grid;
  gap: 6px;
  position: relative;
  text-align: center;
`

const AmountDisplay = styled.input.attrs({ inputMode: 'decimal' })`
  background: transparent;
  border: none;
  outline: none;
  width: 100%;
  font-size: clamp(56px, 9vw, 72px);
  line-height: 1;
  color: ${({ theme }) => theme.text1};
  font-weight: 700;
  letter-spacing: 0.5px;
  text-align: center;

  &::placeholder {
    color: ${({ theme }) => theme.text4};
  }
`

const SubAmount = styled.div`
  color: ${({ theme }) => theme.text3};
  font-size: 14px;
  margin-top: 12px;
`

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.red1};
  font-size: 12px;
  margin-top: 8px;
  text-align: center;
  white-space: pre-line;
`

const AssetSelector = styled.button`
  margin-top: 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.bg1};
  border: 1px solid ${({ theme }) => theme.bg2};
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  width: 100%;
`

const AssetIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
`

const Buy = () => {
  const urlParams = parseUrlParams()

  const isAmountLocked = Boolean(urlParams.amount && urlParams.amount.trim() !== '')
  const isTokenLocked = Boolean(urlParams.crypto && urlParams.crypto.trim() !== '')
  const isCountryLocked = Boolean(urlParams.fiat && urlParams.fiat.trim() !== '')

  const [amount, setAmount] = useState(urlParams.amount)
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const [purchaseQuote, setPurchaseQuote] = useState<QuoteResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [countries, setCountries] = useState<Country[]>([])
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null)
  const [tokens, setTokens] = useState<Token[]>([])
  const [selectedToken, setSelectedToken] = useState<Token | null>(null)
  const [amountError, setAmountError] = useState<string | null>(null)

  const [tokenOpen, setTokenOpen] = useState(false)
  const [regionOpen, setRegionOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [completeOpen, setCompleteOpen] = useState(false)
  const theme = useContext(ThemeContext)
  const { t } = useTranslation()
  const parsedAmount = Number(amount || 0)
  const debouncedAmount = useDebounce(amount, 500)

  const canContinue = account && parsedAmount > 0

  const openOnRampUrl = useCallback(async () => {
    if (!account) {
      toggleWalletModal()
      return
    }

    setCheckoutOpen(false)

    const merchantOrderNo = crypto.randomBytes(16).toString('hex')
    const paramsToSign = {
      address: account,
      crypto: selectedToken?.crypto || '',
      fiat: selectedCountry?.currency || '',
      fiatAmount: amount,
      merchantOrderNo: merchantOrderNo,
      network: selectedToken?.network || '',
      redirectUrl: window.location.origin
    }

    try {
      const onRampUrl = await getOnRampUrl(paramsToSign)
      window.open(onRampUrl, '_blank')
      setCompleteOpen(true)
    } catch (error) {
      console.error('Failed to get on ramp URL:', error)
    }
  }, [amount, account, toggleWalletModal, selectedCountry, selectedToken])

  useEffect(() => {
    const fetchFiatList = async () => {
      setLoading(true)
      try {
        const response = await getFiatList()
        if (response) {
          const countries = groupFiatDataByCountry(response)
          setCountries(countries)

          let selectedCountry = null

          if (urlParams.fiat) {
            selectedCountry = countries.find(country => country.currency === urlParams.fiat)
          }

          if (!selectedCountry) {
            const browserLanguage = navigator.language || navigator.language || 'en'
            const detectedCountryCode = getCountryFromLanguage(browserLanguage)
            if (detectedCountryCode) {
              selectedCountry = countries.find(country => country.country === detectedCountryCode)
            }
          }

          if (!selectedCountry && countries.length > 0) {
            selectedCountry = countries[0]
          }

          if (selectedCountry) {
            setSelectedCountry(selectedCountry)
          }
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchFiatList()
  }, [urlParams.fiat])

  useEffect(() => {
    const fetchCryptoList = async () => {
      setLoading(true)
      try {
        const response = await getCryptoList()
        if (response) {
          const tokens = response.data
          setTokens(tokens)

          const tokenParam = urlParams.crypto
          const networkParam = urlParams.network

          let selectedToken: Token | null = null

          if (networkParam && networkParam.trim() !== '' && tokenParam && tokenParam.trim() !== '') {
            selectedToken =
              tokens.find(
                token =>
                  token.crypto.toLowerCase() === tokenParam.toLowerCase() &&
                  token.network.toLowerCase() === networkParam.toLowerCase()
              ) || null
          } else if (networkParam && networkParam.trim() !== '' && (!tokenParam || tokenParam.trim() === '')) {
            selectedToken = tokens.find(token => token.network.toLowerCase() === networkParam.toLowerCase()) || null
          } else if (tokenParam && tokenParam.trim() !== '' && (!networkParam || networkParam.trim() === '')) {
            selectedToken = tokens.find(token => token.crypto.toLowerCase() === tokenParam.toLowerCase()) || null
          }

          if (!selectedToken) {
            const defaultToken = tokens.find(
              token => token.crypto.toUpperCase() === 'JOC' && token.network.toUpperCase() === 'JOC'
            )
            selectedToken = defaultToken || null
          }

          if (!selectedToken && tokens.length > 0) {
            selectedToken = tokens[0]
          }

          setSelectedToken(selectedToken)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchCryptoList()
  }, [urlParams.fiat, urlParams.crypto, urlParams.network])

  useEffect(() => {
    const handleUrlChange = () => {
      if (urlParams.amount && urlParams.amount.trim() !== '') {
        setAmount(urlParams.amount)
      }
    }

    handleUrlChange()
  }, [urlParams.amount])

  useEffect(() => {
    const fetchQuote = async () => {
      setLoading(true)
      try {
        if (!debouncedAmount || !selectedCountry) {
          setPurchaseQuote(null)
          setAmountError(null)
          return
        }

        if (debouncedAmount && selectedCountry?.currency && selectedToken?.crypto && selectedToken?.network) {
          const quote = await getQuote({
            side: 'BUY',
            fiat: selectedCountry.currency,
            crypto: selectedToken.crypto,
            network: selectedToken.network,
            amount: debouncedAmount
          })

          if (!quote || !quote.success) {
            setPurchaseQuote(null)
            setAmountError((quote?.returnMsg || t('failedToGetQuote')) + '\n' + t('pleaseContinueIfYouWantToContinue'))
            return
          }

          setAmountError(null)
          setPurchaseQuote(quote)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchQuote()
  }, [selectedCountry, selectedToken, debouncedAmount, t])

  return (
    <PageContainer>
      <AppShell>
        <Card>
          <AmountPanel>
            <BuyingHeader>
              <div>{t('youBuying')}</div>
              <RegionBadge
                onClick={() => !isCountryLocked && setRegionOpen(true)}
                disabled={isCountryLocked}
                aria-label="Choose region"
              >
                {selectedCountry ? (
                  <img
                    width={20}
                    height={20}
                    style={{ borderRadius: '9999px' }}
                    src={selectedCountry?.logo || ''}
                    alt={selectedCountry?.countryName || ''}
                  />
                ) : (
                  <Loader size="16px" stroke="white" />
                )}
                {!isCountryLocked && <ChevronDown size={20} color={theme.text1} />}
              </RegionBadge>
            </BuyingHeader>
            <AmountDisplay
              placeholder={`0`}
              value={amount}
              disabled={isAmountLocked}
              onChange={e => {
                if (!isAmountLocked) {
                  const v = e.target.value.replace(/[^\d.]/g, '')
                  setAmount(v)
                }
              }}
            />
            <SubAmount>
              {purchaseQuote?.data?.cryptoQuantity || '--'} {selectedToken?.crypto || ''}
            </SubAmount>
            {amountError && <ErrorMessage>{amountError}</ErrorMessage>}
          </AmountPanel>

          <AssetSelector
            onClick={() => !isTokenLocked && setTokenOpen(true)}
            disabled={isTokenLocked}
            aria-label="Select token"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AssetIcon>
                {!loading &&
                  selectedToken &&
                  (selectedToken.icon ? (
                    <img width={28} height={28} src={selectedToken.icon} alt={selectedToken.crypto} />
                  ) : (
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'gray',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}
                    >
                      {selectedToken.crypto.charAt(0).toUpperCase()}
                    </div>
                  ))}
                {loading && <Loader size="16px" />}
              </AssetIcon>
              <span style={{ fontWeight: 700, fontSize: 16, color: theme.text1, flex: 1 }}>
                {selectedToken?.crypto || ''}
              </span>
            </div>
            {!isTokenLocked && <ChevronRight size={20} color={theme.text1} />}
          </AssetSelector>

          {account ? (
            <ButtonPrimary
              sx={{ marginTop: '4px' }}
              disabled={!canContinue || loading}
              onClick={() => setCheckoutOpen(true)}
            >
              {loading ? (
                <>
                  <Loader size="16px" stroke="white" />
                  <span style={{ marginLeft: '8px' }}>{t('loading')}</span>
                </>
              ) : parsedAmount > 0 ? (
                t('continue')
              ) : (
                t('enterAmount')
              )}
            </ButtonPrimary>
          ) : (
            <ButtonLight sx={{ marginTop: '4px' }} disabled={loading} onClick={toggleWalletModal}>
              {loading ? (
                <>
                  <Loader size="16px" stroke={theme.primaryText1} />
                  <span style={{ marginLeft: '8px' }}>{t('loading')}</span>
                </>
              ) : (
                t('connectWallet')
              )}
            </ButtonLight>
          )}
        </Card>
      </AppShell>

      <SelectTokenModal
        isOpen={tokenOpen}
        onDismiss={() => setTokenOpen(false)}
        tokens={tokens}
        selectedToken={selectedToken}
        onTokenSelect={setSelectedToken}
      />

      <SelectCountriesModal
        isOpen={regionOpen}
        onDismiss={() => setRegionOpen(false)}
        countries={countries}
        selectedCountry={selectedCountry}
        onCountrySelect={setSelectedCountry}
      />

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        amount={parsedAmount}
        providers={PROVIDERS}
        onProviderSelect={_ => openOnRampUrl()}
        selectedToken={selectedToken}
      />

      <CompleteModal isOpen={completeOpen} onClose={() => setCompleteOpen(false)} selectedProvider={PROVIDERS[0]} />
    </PageContainer>
  )
}

export default Buy
