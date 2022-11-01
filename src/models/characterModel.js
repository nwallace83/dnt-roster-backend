const db = require('../services/dbService')

const characterSchema = db.mongoose.Schema({
    id: {type: String, required: true},
    characterName: {type: String, default: ''},
    primaryWeapon1: {type: String, default: '', enum: ['','Bow','Fire Staff','Great Axe','Hatchet', 'Ice Gauntlet','Life Staff','Musket','Rapier','Spear','Sword','Void Gauntlet','War Hammer']},
    primaryWeapon2: {type: String, default: '', enum: ['','Bow','Fire Staff','Great Axe','Hatchet', 'Ice Gauntlet','Life Staff','Musket','Rapier','Spear','Sword','Void Gauntlet','War Hammer']},
    primaryRole: {type: String, default: '', enum: ['','DPS','Healer','Tank']},
    primaryArmor: {type: String, default: '', enum:['','Heavy','Medium','Light']},
    primaryGS: {type: Number, default: 500},
    secondaryWeapon1: {type: String, default: '', enum: ['','Bow','Fire Staff','Great Axe','Hatchet', 'Ice Gauntlet','Life Staff','Musket','Rapier','Spear','Sword','Void Gauntlet','War Hammer']},
    secondaryWeapon2: {type: String, default: '', enum: ['','Bow','Fire Staff','Great Axe','Hatchet', 'Ice Gauntlet','Life Staff','Musket','Rapier','Spear','Sword','Void Gauntlet','War Hammer']},
    secondaryRole: {type: String, default: '', enum: ['','DPS','Healer','Tank']},
    secondaryArmor: {type: String, default: '', enum:['','Heavy','Medium','Light']},
    secondaryGS: {type: Number, default: 500},
    discordUserName: {type: String, default: ''},
    inactive: {type: Boolean, default: false},
    crafting: {
            weaponSmithing: {type: Boolean, default: false},
            armoring: {type: Boolean, default: false},
            engineering: {type: Boolean, default: false},
            jewelCrafting: {type: Boolean, default: false},
            arcana: {type: Boolean, default: false},
            cooking: {type: Boolean, default: false},
            furnishing: {type: Boolean, default: false}
    }
});

const Character = db.mongoose.model("characters",characterSchema)

exports.characterSchema = characterSchema
exports.CharacterModel = Character