
import express from 'express'
import tokenService from '../../services/token-service'
import authenticatedMiddleware, { RequestWithUser } from '../../middleware/authenticated-middleware'

const router = express.Router()
router.use(authenticatedMiddleware)

router.get('/', (req: RequestWithUser, res) => {
  const newToken = tokenService.getJWTTokenForUser(req.user)
  const response = { token: newToken }
  res.json(response)
})

export default router
