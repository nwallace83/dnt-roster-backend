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
