var express = require('express')
var router = express.Router()
const tokenService = require('../../services/tokenService')
const dbUserService = require('../../services/dbUserService')
const dbCharacterService = require('../../services/dbCharacterService')

router.get('/', async (req,res) => {
    if(!req.cookies.authorization) {
        return res.status(401).send('No authorization token provided')
    }

    let user = await authenticateAndGetUserFromDB(req.cookies.authorization)

    if (!user || !user.id) {
        return res.status(401).send('user not in database')
    }

    let character = await dbCharacterService.findCharacterById(user.id)

    if (character) {
        res.json(character)
    } else {
        res.json({})
    }
})

router.post('/', async (req,res) => {
    if(!req.cookies.authorization) {
        return res.status(401).send("No authorization token provided")
    }

    let character = req.body
    let user = await authenticateAndGetUserFromDB(req.cookies.authorization,res)

    if (!user) {
        console.error("Unable to find user in database")
    } 

    character.discordUserName = user.user_name ? user.user_name : ''
    character.id = user.id
    let result = await dbCharacterService.updateCharacterById(user.id,character)

    if (result && (result.modifiedCount === 1 || result.upsertedCount === 1 || result.matchedCount === 1)) {
        res.sendStatus(200)
    } else {
        res.status(401).send("Unable to validate character")
    }
})

async function authenticateAndGetUserFromDB(authorization) {
    let decodedWebToken = tokenService.decodeWebToken(authorization)
    if (!decodedWebToken) {
        return null
    }

    let user = await dbUserService.getUserById(decodedWebToken.id)
    return user
}

module.exports = router;