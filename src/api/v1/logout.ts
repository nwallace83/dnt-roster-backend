import express from 'express'

const router = express.Router()

router.post('/', (req, res) => {
  res.clearCookie('authorization')
  res.sendStatus(200)
})

export default router
