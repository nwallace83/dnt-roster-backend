import express from 'express'
import Character from '../../types/character-type'
import dbUserService from '../../services/db-character-service'
const router = express.Router()

router.get('/', (req, res) => {
  dbUserService.findCharacters().then((characters: Character[]) => {
    res.json(characters)
  }).catch((err: any) => {
    console.warn(err)
    res.status(401).send('Unable to retrieve characters')
  })
})

export default router
