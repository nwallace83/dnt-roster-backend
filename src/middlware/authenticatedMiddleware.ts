import tokenService from '../services/tokenService'
import dbUserService from '../services/dbUserService'
import express from 'express'
import User from '../types/user_type'

export default function authenticatedMiddleware (req: RequestWithUser, res: express.Response, next: express.NextFunction) {
  if (req.cookies.authorization == null) {
    res.sendStatus(401)
  }
  const decodedWebToken = tokenService.decodeWebToken(req.cookies.authorization)
  if (decodedWebToken == null) {
    res.status(401).send('Auth: Invalid token')
  } else {
    dbUserService.getUserById(decodedWebToken.id).then(user => {
      req.user = user
      res.cookie('authorization', tokenService.getJWTTokenForUser(user))
      next()
    }).catch(() => res.status(401).send('Valid token but no user in database: ' + req?.user?.user_name))
  }
}

export interface RequestWithUser extends express.Request {
  user: User
}
