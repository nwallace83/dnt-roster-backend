import express from 'express'
import tokenService from '../../services/tokenService'
import dbUserService from '../../services/dbUserService'
import dbCharacterService from '../../services/dbCharacterService'
import Character from '../../types/character_type'
import User from '../../types/user_type'

const character = express.Router()

character.get('/', (req, res) => {
  if (req.cookies.authorization == null) {
    return res.status(401).send('No authorization token provided')
  }

  authenticateAndGetUserFromDB(req.cookies.authorization).then(user => {
    if (user == null) {
      res.status(401).send('Unable to find user in database')
    } else {
      dbCharacterService.findCharacterById(user.id).then((character: Character | null) => {
        res.json(character)
      }).catch(err => console.error(err))
    }
  }).catch(err => console.error(err))
})

character.post('/', (req, res) => {
  let character: Character
  if (req.cookies.authorization == null) {
    return res.status(401).send('No authorization token provided')
  } else {
    character = req.body
    authenticateAndGetUserFromDB(req.cookies.authorization).then((user: User | null) => {
      if (user == null) {
        res.status(401).send('Unable to find user in database')
      } else {
        character.discordUserName = user.user_name
        character.id = user.id
        dbCharacterService.updateCharacterById(user.id, character).then(() => {
          res.sendStatus(200)
        }).catch(err => console.error(err))
      }
    }).catch(err => console.error(err))
  }
})

async function authenticateAndGetUserFromDB (authorization: string) {
  const decodedWebToken = tokenService.decodeWebToken(authorization)
  if (decodedWebToken == null) {
    return await Promise.reject(new Error('Unable to decode secret: ' + authorization))
  } else {
    const user = await dbUserService.getUserById(decodedWebToken.id)
    return await Promise.resolve(user)
  }
}

export default character
