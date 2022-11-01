const express = require('express')
const router = express.Router()
const adminMiddleware = require('../../../middlware/adminMiddleware')
const dbCharacterService = require('../../../services/dbCharacterService')

router.use(adminMiddleware)

router.post('/inactive/:characterid/:status', async (req,res) => {
    let character = await dbCharacterService.findCharacterById(req.params.characterid)
    if (!character) {
        return res.status(400).send('Admin: unable to find character ' + req.params.characterid)
    }

    character.inactive = req.params.status

    let result = await dbCharacterService.updateCharacter(character)
    if (result) {
        let newCharacter = await dbCharacterService.findCharacterById(character.id)
        res.json(newCharacter)
    } else {
        return res.status(400).send('Admin: Unable to change inactive status on ' + req.params.characterid )
    }
})

module.exports = router