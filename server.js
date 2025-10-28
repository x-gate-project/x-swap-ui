/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const bodyParser = require('body-parser')
const { getFiatList } = require('./api/fiat/list')
const { getCryptoList } = require('./api/crypto/list')
const { getQuote } = require('./api/quotes')
const { getOnRampUrl } = require('./api/onramp/url')

const port = parseInt(process.env.PORT, 10) || 8080

const bootstrap = async () => {
  const app = express()

  // Body parser for JSON (needed to parse request bodies)
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  // CORS (allow frontend to call your API)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200)
    }
    return next()
  })

  // Alchemy Pay API routes
  app.get('/api/fiat/list', async (req, res, next) => {
    try {
      const fiats = await getFiatList()
      res.json(fiats)
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/crypto/list', async (req, res, next) => {
    try {
      const cryptos = await getCryptoList()
      res.json(cryptos)
    } catch (err) {
      next(err)
    }
  })

  app.post('/api/quotes', async (req, res, next) => {
    try {
      const quote = await getQuote(req.body)
      res.json(quote)
    } catch (err) {
      next(err)
    }
  })

  app.get('/api/onramp/url', (req, res, next) => {
    try {
      const { address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl } = req.query
      const url = getOnRampUrl({ address, crypto, fiat, fiatAmount, merchantOrderNo, network, redirectUrl })
      res.json({ url })
    } catch (err) {
      next(err)
    }
  })

  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
  })

  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
      message: err.message,
      ...(app.get('env') === 'development' && { error: err })
    })
  })

  app.listen(port, err => {
    if (err) throw err
    console.log(`Server is running on port ${port}`)
  })
}
bootstrap()
