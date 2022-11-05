import UserModelDB from '../models/user-model-db'
import DiscordUser from '../types/discord-user-type'
import User, { getNewUser } from '../types/user-type'

async function getUserById (userid: string) {
  const fetchedUser = await UserModelDB.findOne({ id: userid }, { _id: 0, __v: 0 })
  if (fetchedUser == null) {
    return await Promise.reject(new Error('User not found: ' + userid))
  } else {
    return await Promise.resolve(fetchedUser as User)
  }
}

async function saveDiscordUserToDatabase (discordUser: DiscordUser) {
  const userInDatabase = await UserModelDB.findOne({ id: discordUser.id }, { _id: 0, __v: 0 })

  if (userInDatabase != null) {
    userInDatabase.last_login = Date.now()
    await UserModelDB.updateOne({ id: discordUser.id }, userInDatabase, { upsert: true })
    return userInDatabase
  } else {
    const newUser = getNewUser()
    newUser.id = discordUser.id
    newUser.avatar = discordUser.avatar
    newUser.is_admin = false
    newUser.user_name = discordUser.username + '#' + discordUser.discriminator
    newUser.last_login = Date.now()
    newUser.token.access_token = discordUser.token.access_token
    newUser.token.expires_at = (discordUser.token.expires_in * 1000) + Date.now()
    newUser.token.refresh_token = discordUser.token.refresh_token
    await UserModelDB.updateOne({ id: discordUser.id }, newUser, { upsert: true })
    const newUserinDB = UserModelDB.findOne({ id: discordUser.id }, { _id: 0, __v: 0 })
    if (newUserinDB != null) {
      return await Promise.resolve(newUserinDB)
    } 
  }
}

const dbUserService = { saveDiscordUserToDatabase, getUserById }

export default dbUserService
