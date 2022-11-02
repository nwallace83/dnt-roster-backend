import express from 'express'
import adminMiddleware from '../../../middlware/adminMiddleware'
import dbCharacterService from '../../../services/dbCharacterService'
import Character from '../../../types/character_type'

const characterAdmin = express.Router()

characterAdmin.use(adminMiddleware)

characterAdmin.post('/inactive/:characterid/:status', (req, res) => {
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

export default characterAdmin
