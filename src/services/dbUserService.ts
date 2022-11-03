import UserModelDB from '../models/userModelDB'
import DiscordUser from '../types/discord_user_type'
import User from '../types/user_type'

async function getUserById (userid: string) {
  const fetchedUser = await UserModelDB.findOne({ id: userid }, { _id: 0, __v: 0 })
  if (fetchedUser == null) {
    return await Promise.reject(new Error('User not found: ' + userid))
  } else {
    return await Promise.resolve(fetchedUser as User)
  }
}

function saveDiscordUserToDatabase (discordUser: DiscordUser) {
  const userToSave: User = {
    id: discordUser.id,
    avatar: discordUser.avatar,
    is_admin: false,
    user_name: discordUser.username + '#' + discordUser.discriminator,
    last_login: Date.now(),
    token: {
      access_token: discordUser.token.access_token,
      expires_at: (discordUser.token.expires_in * 1000) + Date.now(),
      refresh_token: discordUser.token.refresh_token
    }
  }
  return UserModelDB.updateOne({ id: discordUser.id }, userToSave, { upsert: true })
}

const dbUserService = { saveDiscordUserToDatabase, getUserById }

export default dbUserService
