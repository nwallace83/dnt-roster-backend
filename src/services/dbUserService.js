const User = require('../models/userModel')

async function getUserById(userid) {
    let user = await User.UserModel.findOne({id: userid})
    
    if(user) {
        return user
    } else {
        return null
    }
}

async function updateLastLoginById(userid) {
    let user = await User.UserModel.findOne({id: userid})

    if (user) {
        user.last_login = Date.now()
        User.UserModel.updateOne({id: userid},user)
    }
}

async function saveDiscordUserToDatabase(discordUser,userToken) {
    let userToSave = {
        id: discordUser.id,
        avatar: discordUser.avatar,
        id_admin: false,
        user_name: discordUser.username + '#' + discordUser.discriminator,
        last_login: Date.now(),
        token: {
            access_token: userToken.access_token,
            expires_at: (userToken.expires_in * 1000) + Date.now(),
            refresh_token: userToken.refresh_token
        }
    }

    let result = await User.UserModel.updateOne({id:discordUser.id},userToSave,{upsert: true})
    return result
}

module.exports = {getUserById, updateLastLoginById, saveDiscordUserToDatabase}