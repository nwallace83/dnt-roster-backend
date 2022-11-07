import express from 'express'
import adminMiddleware from '../../../middleware/admin-middleware'
import authenticatedMiddleware from '../../../middleware/authenticated-middleware'
import dbCharacterService from '../../../services/db-character-service'
import Character from '../../../types/character-type'

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
        }).catch(err => console.warn(err))
      }).catch(err => console.warn(err))
    }
  }).catch(err => console.warn(err))
})

export default router
