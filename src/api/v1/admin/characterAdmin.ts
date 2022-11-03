import express from 'express'
import adminMiddleware from '../../../middlware/adminMiddleware'
import authenticatedMiddleware from '../../../middlware/authenticatedMiddleware'
import dbCharacterService from '../../../services/dbCharacterService'
import Character from '../../../types/character_type'

const router = express.Router()

router.use(authenticatedMiddleware)
router.use(adminMiddleware)

router.post('/inactive/:characterid/:status', (req, res) => {
  dbCharacterService.findCharacterById(req.params.characterid).then((result) => {
    let character: Character
    if (result != null) {
      character = result
      character.inactive = req.params.status === 'true'
      dbCharacterService.updateCharacter(character).then(() => {
        dbCharacterService.findCharacterById(character.id).then(character => {
          res.json(character)
        }).catch(err => console.error(err))
      }).catch(err => console.error(err))
    }
  }).catch(err => console.error(err))
})

export default router
