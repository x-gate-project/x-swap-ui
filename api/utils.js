/* eslint-disable @typescript-eslint/no-var-requires */
const crypto = require('crypto')

function removeEmptyKeys(map) {
  const retMap = {}
  for (const [key, value] of Object.entries(map)) {
    if (value !== null && value !== '') {
      retMap[key] = value
    }
  }
  return retMap
}

function sortObject(obj) {
  if (typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    const objectList = []
    const intList = []
    const floatList = []
    const stringList = []
    const jsonArray = []

    for (const item of obj) {
      if (typeof item === 'object') {
        jsonArray.push(item)
      } else if (Number.isInteger(item)) {
        intList.push(item)
      } else if (typeof item === 'number') {
        floatList.push(item)
      } else if (typeof item === 'string') {
        stringList.push(item)
      } else {
        intList.push(item)
      }
    }

    intList.sort((a, b) => a - b)
    floatList.sort((a, b) => a - b)
    stringList.sort()

    objectList.push(...intList, ...floatList, ...stringList, ...jsonArray)
    obj.length = 0
    obj.push(...objectList)

    const retList = []
    for (const item of obj) {
      if (typeof item === 'object') {
        retList.push(sortObject(item))
      } else {
        retList.push(item)
      }
    }
    return retList
  }

  const sortedMap = new Map(Object.entries(removeEmptyKeys(obj)).sort(([aKey], [bKey]) => aKey.localeCompare(bKey)))

  for (const [key, value] of sortedMap.entries()) {
    if (typeof value === 'object') {
      sortedMap.set(key, sortObject(value))
    }
  }

  return Object.fromEntries(sortedMap.entries())
}

function getJsonBody(body) {
  let map = {}
  try {
    map = JSON.parse(body)
  } catch (error) {
    map = {}
  }

  if (Object.keys(map).length === 0) {
    return ''
  }

  map = removeEmptyKeys(map)
  map = sortObject(map)

  return JSON.stringify(map)
}

function getApiSignature(timestamp, method, path, body, secretkey) {
  const content = timestamp + method.toUpperCase() + path + getJsonBody(body)
  const signVal = crypto
    .createHmac('sha256', secretkey)
    .update(content, 'utf8')
    .digest('base64')
  return signVal
}

function getStringToSign(params) {
  const sortedKeys = Object.keys(params).sort()
  const s2s = sortedKeys
    .map(key => {
      const value = params[key]
      if (Array.isArray(value) || value === '') {
        return null
      }
      return `${key}=${value}`
    })
    .filter(Boolean)
    .join('&')

  return s2s
}

function generateSignature(timestamp, httpMethod, requestPath, secretKey) {
  const signatureString = timestamp + httpMethod + requestPath
  const hmac = crypto.createHmac('sha256', secretKey)
  hmac.update(signatureString)
  const signature = hmac.digest('base64')
  return encodeURIComponent(signature)
}

module.exports = {
  removeEmptyKeys,
  sortObject,
  getJsonBody,
  getApiSignature,
  getStringToSign,
  generateSignature
}
