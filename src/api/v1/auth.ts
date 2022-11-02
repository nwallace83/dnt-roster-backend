
import express from 'express'
import tokenService from '../../services/tokenService'
import dbUserService from '../../services/dbUserService'
import User from '../../types/user_type'
import DecodedWebToken from '../../types/decoded_web_token_type'

const auth = express.Router()

auth.get('/', (req, res) => {
  if (req.cookies.authorization == null) {
    return res.sendStatus(401)
  }

  let decodedWebToken: DecodedWebToken
  let user: User

  const nonValidatedToken = tokenService.decodeWebToken(req.cookies.authorization)

  if (nonValidatedToken == null) {
    res.status(401).send('Invalid token')
  } else {
    decodedWebToken = nonValidatedToken
    dbUserService.updateLastLoginById(decodedWebToken.id).catch(err => console.error(err))

    dbUserService.getUserById(decodedWebToken.id).then((result) => {
      user = result as User
      const newToken = tokenService.getJWTTokenForUser(user)
      const response = { token: newToken }
      res.json(response)
    }).catch(err => console.error(err))
  }
})

export default auth
