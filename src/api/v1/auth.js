var express = require('express')
var router = express.Router()
var tokenService = require('../../services/tokenService')
var dbUserService = require('../../services/dbUserService')

router.get('/',async (req,res) => {
    if(!req.cookies.authorization) {
        return res.sendStatus(401)
    }

    let decodedWebToken = tokenService.decodeWebToken(req.cookies.authorization)

    if (!decodedWebToken) {
        return res.status(401).send("Invalid token")
    }

    let user = await dbUserService.getUserById(decodedWebToken.id)

    if (!user) {
        return res.status(401).send("User not in database")
    }

    dbUserService.updateLastLoginById(decodedWebToken.id)
    const newToken = tokenService.getJWTTokenForUser(user)
    if (!newToken) {
        return res.status(401).send("Unable to refresh token")
    }

    let response = {token: newToken}

    res.json(response)
})

module.exports = router;