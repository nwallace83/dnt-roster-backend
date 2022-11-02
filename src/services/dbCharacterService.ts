import CharacterModelDB from '../models/characterModelDB'
import Character from '../types/character_type'

async function findCharacterById (characerID: string) {
  return await CharacterModelDB.findOne({ id: characerID }, { _id: 0, __v: 0 })
}

async function updateCharacterById (userID: string, character: Character) {
  try {
    const result = await CharacterModelDB.updateOne({ id: userID }, character, { upsert: true, runValidators: true })
    return result
  } catch (err) {
    console.error(err)
  }
}

async function updateCharacter (character: Character) {
  try {
    const result = await CharacterModelDB.updateOne({ id: character.id }, character, { runValidators: true })
    return result
  } catch (err) {
    console.error(err)
  }
}

async function findCharacters () {
  return await CharacterModelDB.find()
}

const dbCharacterService = { findCharacterById, updateCharacterById, updateCharacter, findCharacters }
export default dbCharacterService
