import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import discord from './api/v1/discord'
import auth from './api/v1/auth'
import character from './api/v1/character'
import roster from './api/v1/roster'
import characterAdmin from './api/v1/admin/characterAdmin'

const app = express()
app.use(cookieParser())
app.use(bodyParser.json())

app.use('/api/v1/discord', discord)
app.use('/api/v1/auth', auth)
app.use('/api/v1/character', character)
app.use('/api/v1/roster', roster)
app.use('/api/v1/admin/character', characterAdmin)

export default app
