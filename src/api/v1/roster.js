var express = require('express')
var router = express.Router()
var dbCharacterService =  require('../../services/dbCharacterService')

router.get('/', async (req,res) => {
    let characters = await dbCharacterService.findCharacters()
    if (characters) {
        res.json(characters)
    } else {
        res.sendStatus(401)
    }

})

module.exports = router;