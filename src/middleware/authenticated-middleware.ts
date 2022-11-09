import tokenService from '../services/token-service'
import dbUserService from '../services/db-user-service'
import express from 'express'
import User from '../types/user-type'

const THIRTY_DAYS = 2592000000

export default function authenticatedMiddleware (req: RequestWithUser, res: express.Response, next: express.NextFunction) {
  if (req.cookies.authorization == null) {
    return res.sendStatus(401)
  }
  const decodedWebToken = tokenService.decodeWebToken(req.cookies.authorization)
  if (decodedWebToken == null) {
    res.clearCookie('authorization')
    return res.status(401).send('Auth: Invalid token')
  } else {
    dbUserService.getUserById(decodedWebToken.id).then(user => {
      req.user = user
      res.cookie('authorization', tokenService.getJWTTokenForUser(user), { httpOnly: true, maxAge: THIRTY_DAYS })
      next()
    }).catch(() => res.status(401).send('Valid token but no user in database: ' + decodedWebToken.userName))
  }
}

export interface RequestWithUser extends express.Request {
  user: User
}
