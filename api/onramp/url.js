/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv')
dotenv.config()

const { getStringToSign, generateSignature } = require('../utils')

const APP_ID = process.env.REACT_APP_ALCHEMY_PAY_APP_ID || ''
const APP_SECRET = process.env.REACT_APP_ALCHEMY_PAY_APP_SECRET || ''
const BASE_RAMP_URL = process.env.REACT_APP_ALCHEMY_PAY_BASE_RAMP_URL || ''
const ON_RAMP_REQUEST_PATH = '/index/rampPageBuy'

function getOnRampUrl(params) {
  const timestamp = String(Date.now())

  const paramsToSign = {
    address: params.address,
    crypto: params.crypto,
    fiat: params.fiat,
    fiatAmount: params.fiatAmount,
    merchantOrderNo: params.merchantOrderNo,
    network: params.network,
    timestamp: timestamp,
    appId: APP_ID,
    redirectUrl: params.redirectUrl
  }

  const rawDataToSign = getStringToSign(paramsToSign)
  const requestPathWithParams = ON_RAMP_REQUEST_PATH + '?' + rawDataToSign
  const onRampSignature = generateSignature(timestamp, 'GET', requestPathWithParams, APP_SECRET)

  const finalLink = `${BASE_RAMP_URL}?${rawDataToSign}&sign=${onRampSignature}`
  return finalLink
}

async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    const { address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl } = req.query
    const url = getOnRampUrl({ address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl })
    res.status(200).json({ url })
  } catch (error) {
    console.error('Error generating onramp URL:', error)
    res.status(500).json({ error: 'Failed to generate onramp URL' })
  }
}

module.exports = { getOnRampUrl, handler }
module.exports.default = handler
