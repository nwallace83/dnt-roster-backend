import express from 'express'
import fetch from 'node-fetch'
import dbUserService from '../../services/db-user-service'
import tokenService from '../../services/token-service'
import { URLSearchParams } from 'url'
import DiscordUser, { DiscordUserToken } from '../../types/discord-user-type'

const THIRTY_DAYS = 2592000000
const router = express.Router()
const API_ENDPOINT = 'https://discord.com/api'
const CLIENT_ID = '944735010311786537'
const CLIENT_SECRET = process.env.CLIENT_SECRET ?? ''
const REDIRECT_URI = process.env.REDIRECT_URI ?? ''

router.post('/login/:code', (req, res) => {
  assembleTokenUserFromCode(req.params.code).then((discordtoken: any) => {
    assembleUserFromUserToken(discordtoken).then(discUser => {
      dbUserService.saveDiscordUserToDatabase(discUser).then((user) => {
        if (user != null) {
          res.cookie('authorization', tokenService.getJWTTokenForUser(user), { httpOnly: true, maxAge: THIRTY_DAYS })
          const responseUser = { id: user.id, user_name: user.user_name, is_admin: user.is_admin, avatar: user.avatar }
          res.json(responseUser)
        } else {
          res.sendStatus(401)
        }
      }).catch(err => console.warn(err))
    }).catch(err => console.warn(err))
  }).catch(err => console.warn(err))
})

async function assembleTokenUserFromCode (code: string) {
  const params = new URLSearchParams()
  params.append('grant_type', 'authorization_code')
  params.append('client_id', CLIENT_ID)
  params.append('client_secret', CLIENT_SECRET)
  params.append('code', code)
  params.append('redirect_uri', REDIRECT_URI)

  const data = {
    method: 'POST',
    body: params,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: 'application/json' }
  }

  const apiResponse = await fetch(API_ENDPOINT + '/oauth2/token', data)
  if (apiResponse.ok != null) {
    const token: DiscordUserToken = await apiResponse.json()
    return await Promise.resolve(token)
  } else {
    return await Promise.reject(new Error('Unable to get token from code: ' + code))
  }
}

async function assembleUserFromUserToken (token: DiscordUserToken) {
  const data = {
    method: 'GET',
    headers: { Authorization: 'Bearer ' + token.access_token }
  }

  const apiResponseUser: any = await fetch(API_ENDPOINT + '/users/@me', data)
  const apiReponseUserGuilds: any = await fetch(API_ENDPOINT + '/users/@me/guilds', data)

  if (apiReponseUserGuilds.ok == null || apiResponseUser == null) {
    return await Promise.reject(new Error('Non 200 reponse from user or userGuilds api'))
  }

  const user: DiscordUser = await apiResponseUser.json()
  user.token = token
  const userGuilds: DiscordUserGuild[] = await apiReponseUserGuilds.json()

  if (userIsInCompanyDiscord(userGuilds)) {
    return await Promise.resolve(user)
  } else {
    return await Promise.reject(new Error('User not in guild discord: ' + user.username + '#' + user.discriminator))
  }
}

function userIsInCompanyDiscord (userGuilds: DiscordUserGuild[]) {
  for (let i = 0; i < userGuilds.length; i++) {
    if (userGuilds[i].id === '550866967200792577') {
      return true
    }
  }
  return false
}

interface DiscordUserGuild {
  id: string
}

export default router
