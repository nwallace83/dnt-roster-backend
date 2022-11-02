import db from '../services/dbService'
import { Schema } from 'mongoose'
import Character from '../types/character_type'

const characterSchema = new Schema<Character>({
  id: { type: String, required: true },
  characterName: { type: String, default: '' },
  primaryWeapon1: { type: String, default: '', enum: ['', 'Bow', 'Fire Staff', 'Great Axe', 'Hatchet', 'Ice Gauntlet', 'Life Staff', 'Musket', 'Rapier', 'Spear', 'Sword', 'Void Gauntlet', 'War Hammer'] },
  primaryWeapon2: { type: String, default: '', enum: ['', 'Bow', 'Fire Staff', 'Great Axe', 'Hatchet', 'Ice Gauntlet', 'Life Staff', 'Musket', 'Rapier', 'Spear', 'Sword', 'Void Gauntlet', 'War Hammer'] },
  primaryRole: { type: String, default: '', enum: ['', 'DPS', 'Healer', 'Tank'] },
  primaryArmor: { type: String, default: '', enum: ['', 'Heavy', 'Medium', 'Light'] },
  primaryGS: { type: Number, default: 500 },
  secondaryWeapon1: { type: String, default: '', enum: ['', 'Bow', 'Fire Staff', 'Great Axe', 'Hatchet', 'Ice Gauntlet', 'Life Staff', 'Musket', 'Rapier', 'Spear', 'Sword', 'Void Gauntlet', 'War Hammer'] },
  secondaryWeapon2: { type: String, default: '', enum: ['', 'Bow', 'Fire Staff', 'Great Axe', 'Hatchet', 'Ice Gauntlet', 'Life Staff', 'Musket', 'Rapier', 'Spear', 'Sword', 'Void Gauntlet', 'War Hammer'] },
  secondaryRole: { type: String, default: '', enum: ['', 'DPS', 'Healer', 'Tank'] },
  secondaryArmor: { type: String, default: '', enum: ['', 'Heavy', 'Medium', 'Light'] },
  secondaryGS: { type: Number, default: 500 },
  discordUserName: { type: String, default: '' },
  inactive: { type: Boolean, default: false },
  crafting: {
    weaponSmithing: { type: Boolean, default: false },
    armoring: { type: Boolean, default: false },
    engineering: { type: Boolean, default: false },
    jewelCrafting: { type: Boolean, default: false },
    arcana: { type: Boolean, default: false },
    cooking: { type: Boolean, default: false },
    furnishing: { type: Boolean, default: false }
  }
})

const CharacterModelDB = db.model('characters', characterSchema)

export default CharacterModelDB
