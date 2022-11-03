import CharacterModelDB from '../models/characterModelDB'
import Character, { getNewCharacter } from '../types/character_type'

async function findCharacterById (characerID: string) {
  const character = await CharacterModelDB.findOne({ id: characerID }, { _id: 0, __v: 0 })
  if (character != null) {
    return character
  } else {
    return getNewCharacter()
  }
}

async function updateCharacter (character: Character) {
  try {
    const result = await CharacterModelDB.updateOne({ id: character.id }, character, { upsert: true, runValidators: true })
    return result
  } catch (err) {
    console.error(err)
    return await Promise.reject(new Error('Unable to update character: ' + character.characterName))
  }
}

function findCharacters () {
  return CharacterModelDB.find()
}

const dbCharacterService = { findCharacterById, updateCharacter, findCharacters }
export default dbCharacterService
