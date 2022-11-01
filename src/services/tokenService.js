const jwt = require('jsonwebtoken')
const jwtKey = process.env.JWT_KEY

const THIRTY_DAYS = 604800000

function decodeWebToken(token) {
    try {
        let decodedWebToken = jwt.verify(token,jwtKey)
        return decodedWebToken
    } catch {
        return null
    }
}

function getJWTToken(discordUser){
    return jwt.sign({userName: discordUser.username + '#' + discordUser.discriminator,
            id: discordUser.id,
            avatar: discordUser.avatar,
            isAdmin: false,
            expiresAt: Date.now() + THIRTY_DAYS},
                jwtKey,{algorithm: 'HS256',
                expiresIn: THIRTY_DAYS})
}

function getJWTTokenForUser(user) {
    if (user && user.id && user.avatar) {
        return jwt.sign({userName: user.user_name,
            id: user.id,
            avatar: user.avatar,
            isAdmin: user.is_admin,
            expiresAt: Date.now() + THIRTY_DAYS},
                jwtKey,{algorithm: 'HS256',
                expiresIn: THIRTY_DAYS})  
    } else {
        return null
    }
}

module.exports = {decodeWebToken, getJWTToken, getJWTTokenForUser}