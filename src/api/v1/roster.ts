import express from 'express'
import Character from '../../types/character-type'
import dbCharacterService from '../../services/db-character-service'
const router = express.Router()

router.get('/', (req, res) => {
  dbCharacterService.findCharacters().then((characters: Character[]) => {
    res.json(characters)
  }).catch(() => {
    res.status(401).send('Unable to retrieve characters')
  })
})

export default router
