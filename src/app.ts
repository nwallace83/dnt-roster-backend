import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

import discord from './api/v1/discord'
import auth from './api/v1/auth'
import character from './api/v1/character'
import roster from './api/v1/roster'
import characterAdmin from './api/v1/admin/characterAdmin'

const app = express()

const clientSecret = process.env.CLIENT_SECRET
const JWTKey = process.env.JWT_KEY
if (clientSecret == null || JWTKey == null) {
  console.error('Missing environmental variable verify they exist: ')
  clientSecret != null ? console.info('CLIENT_SECRET: Found') : console.info('CLIENT_SECRET: missing')
  JWTKey != null ? console.info('JWT_KEY: Found') : console.info('JWT_KEY: missing')
  console.error('CLIENT_SECRET, JWT_KEY')
  process.exit(1)
}

app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api/v1/discord', discord)
app.use('/api/v1/auth', auth)
app.use('/api/v1/character', character)
app.use('/api/v1/roster', roster)
app.use('/api/v1/admin/character', characterAdmin)

app.use('/', express.static(path.join(__dirname, 'html')))

export default app
