/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv')
dotenv.config()

const axios = require('axios')
const { getApiSignature } = require('../utils')

const BASE_API_URL = process.env.REACT_APP_ALCHEMY_PAY_BASE_API_URL || ''
const APP_ID = process.env.REACT_APP_ALCHEMY_PAY_APP_ID || ''
const APP_SECRET = process.env.REACT_APP_ALCHEMY_PAY_APP_SECRET || ''

async function getFiatList() {
  const timestamp = String(Date.now())
  const method = 'GET'
  const path = '/open/api/v4/merchant/fiat/list'
  const body = ''
  const sign = getApiSignature(timestamp, method, path, body, APP_SECRET)

  const response = await axios.get(`${BASE_API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      appid: APP_ID,
      timestamp: timestamp,
      sign: sign
    }
  })

  return response.data
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
    const data = await getFiatList()
    res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching fiat list:', error)
    res.status(500).json({ error: 'Failed to fetch fiat list' })
  }
}

module.exports = { getFiatList, handler }
module.exports.default = handler
