
import express from 'express'
import authenticatedMiddleware, { RequestWithUser } from '../../middleware/authenticated-middleware'

const router = express.Router()
router.use(authenticatedMiddleware)

router.get('/', (req: RequestWithUser, res) => {
  res.json(
    {
      id: req.user.id,
      user_name: req.user.user_name,
      is_admin: req.user.is_admin,
      avatar: req.user.avatar
    })
})

export default router
