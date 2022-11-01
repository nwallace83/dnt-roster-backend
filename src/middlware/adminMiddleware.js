var tokenService = require('../services/tokenService')
var dbUserService = require('../services/dbUserService')

module.exports = function(req,res,next) {
    if(!req.cookies.authorization) {
        return res.sendStatus(401)
    }

    let decodedWebToken = tokenService.decodeWebToken(req.cookies.authorization)

    if (!decodedWebToken) {
        return res.status(401).send("Admin: Invalid token")
    }

    dbUserService.getUserById(decodedWebToken.id).then(result => {
        let user = result
        if (!user) {
            return res.status(401).send("User not in database")
        }

        if (user.is_admin) {
            console.info('Authorized Admin: ' + user.user_name)
            next()
        } else {
            return res.status(401).send("Admin:  user is not an admin")
        }
    })


}
