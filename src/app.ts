import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'

const app = express()
app.use(cookieParser())
app.use(bodyParser.json())

export default app
