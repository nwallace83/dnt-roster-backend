const Character = require('../models/characterModel')

async function findCharacterById(characerID) {
    return await Character.CharacterModel.findOne({id: characerID},{_id: 0, __v: 0})
}

async function updateCharacterById(userID,character) {
    try {
        let result = await Character.CharacterModel.updateOne({id: userID},character,{upsert: true, runValidators: true})
        return result
    } catch(err) {
        return null
    }
}

async function updateCharacter(character) {
    try {
        let result = await Character.CharacterModel.updateOne({id: character.id},character,{runValidators: true})
        return result
    } catch(err) {
        return null
    }
}


async function findCharacters() {
    return await Character.CharacterModel.find();
}

module.exports = {findCharacterById, updateCharacterById, findCharacters, updateCharacter}