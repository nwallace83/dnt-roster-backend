import express from 'express'
import { RequestWithUser } from './authenticated-middleware'

function adminMiddleware (req: RequestWithUser, res: express.Response, next: express.NextFunction) {
  if (req.user.is_admin) {
    next()
  } else {
    res.sendStatus(401)
  }
}

export default adminMiddleware
