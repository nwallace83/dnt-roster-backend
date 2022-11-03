export default interface Character {
  id: string
  characterName: string
  primaryWeapon1: string
  primaryWeapon2: string
  primaryRole: string
  primaryArmor: string
  primaryGS: number
  secondaryWeapon1: string
  secondaryWeapon2: string
  secondaryRole: string
  secondaryArmor: string
  secondaryGS: number
  discordUserName: string
  inactive: boolean
  crafting: {
    weaponSmithing: boolean
    armoring: boolean
    engineering: boolean
    jewelCrafting: boolean
    arcana: boolean
    cooking: boolean
    furnishing: boolean
  }
}

export function getNewCharacter () {
  const newCharacter: Character = {
    id: '',
    characterName: '',
    primaryWeapon1: '',
    primaryWeapon2: '',
    primaryRole: '',
    primaryArmor: '',
    primaryGS: 0,
    secondaryWeapon1: '',
    secondaryWeapon2: '',
    secondaryRole: '',
    secondaryArmor: '',
    secondaryGS: 0,
    discordUserName: '',
    inactive: false,
    crafting: {
      weaponSmithing: false,
      armoring: false,
      engineering: false,
      jewelCrafting: false,
      arcana: false,
      cooking: false,
      furnishing: false
    }
  }
  return newCharacter
}
