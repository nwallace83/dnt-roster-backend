import express from 'express'
import app from './app'
import helmet from 'helmet'
import http from 'http'
import https from 'https'
import * as fs from 'fs'

if (process.env.NODE_ENV === 'production') {
  app.use(helmet({ crossOriginEmbedderPolicy: false }))
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'img-src': ["'self'", '*.discordapp.com', 'data:']
      }
    })
  )

  const privateKey = fs.readFileSync('dntroster.com.key')
  const certicate = fs.readFileSync('dntroster.com_2022.crt')
  const caCert = fs.readFileSync('CA.crt')
  const ciphers = [
    'DHE-RSA-AES256-SHA384',
    'ECDHE-RSA-AES256-SHA256',
    'ECDHE-RSA-AES256-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'DHE-RSA-AES256-SHA256',
    'DHE-RSA-AES128-SHA256',
    'HIGH',
    '!aNULL',
    '!eNULL',
    '!EXPORT',
    '!DES',
    '!RC4',
    '!MD5',
    '!PSK',
    '!SRP',
    '!CAMELLIA'
  ].join(':')
  const credentials = { key: privateKey, cert: certicate, ca: caCert, ciphers }

  const httpsServer = https.createServer(credentials, app)

  const httpServer = express()
  httpServer.disable('x-powered-by')
  httpServer.get('*', function (req, res) {
    if (req.headers.host != null) {
      res.redirect('https://' + req.headers.host + req.url)
    }
  })

  httpsServer.listen(8443)
  httpServer.listen(8080)
} else if (process.env.NODE_ENV === 'staging') {
  app.use(helmet({ crossOriginEmbedderPolicy: false }))
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        'img-src': ["'self'", '*.discordapp.com', 'data:']
      }
    })
  )

  const privateKey = fs.readFileSync('dntroster.com.key')
  const certicate = fs.readFileSync('dntroster.com_2022.crt')
  const caCert = fs.readFileSync('CA.crt')
  const ciphers = [
    'DHE-RSA-AES256-SHA384',
    'ECDHE-RSA-AES256-SHA256',
    'ECDHE-RSA-AES256-SHA384',
    'ECDHE-RSA-AES128-SHA256',
    'DHE-RSA-AES256-SHA256',
    'DHE-RSA-AES128-SHA256',
    'HIGH',
    '!aNULL',
    '!eNULL',
    '!EXPORT',
    '!DES',
    '!RC4',
    '!MD5',
    '!PSK',
    '!SRP',
    '!CAMELLIA'
  ].join(':')
  const credentials = { key: privateKey, cert: certicate, ca: caCert, ciphers }

  const httpsServer = https.createServer(credentials, app)

  httpsServer.listen(3001)
} else {
  const httpServer = http.createServer(app)
  httpServer.listen(3001)
}
