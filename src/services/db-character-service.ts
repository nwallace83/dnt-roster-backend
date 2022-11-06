import CharacterModelDB from '../models/character-model-db'
import Character, { getNewCharacter } from '../types/character-type'

async function findCharacterById (characerID: string) {
  const character = await CharacterModelDB.findOne({ id: characerID }, { _id: 0, __v: 0 })
  if (character != null) {
    return character
  } else {
    return getNewCharacter()
  }
}

async function saveCharacter (character: Character) {
  try {
    const result = await CharacterModelDB.updateOne({ id: character.id }, character, { upsert: true, runValidators: true })
    return result
  } catch (err) {
    console.warn(err)
    return await Promise.reject(new Error('Unable to update character: ' + character.characterName))
  }
}

async function updateCharacter (character: Character) {
  try {
    const result = await CharacterModelDB.updateOne({ id: character.id }, character, { runValidators: true })
    return result
  } catch (err) {
    console.warn(err)
    return await Promise.reject(new Error('Unable to update character: ' + character.characterName))
  }
}

function findCharacters () {
  return CharacterModelDB.find()
}

const dbCharacterService = { findCharacterById, updateCharacter, findCharacters, saveCharacter }
export default dbCharacterService
