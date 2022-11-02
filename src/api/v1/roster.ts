import express from 'express'
import Character from '../../types/character_type'
import dbUserService from '../../services/dbCharacterService'
const roster = express.Router()

roster.get('/', (req, res) => {
  dbUserService.findCharacters().then((characters: Character[]) => {
    res.json(characters)
  }).catch((err: any) => {
    console.error(err)
    res.status(401).send('Unable to retrieve characters')
  })
})

export default roster
