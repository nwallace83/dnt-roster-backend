import CharacterModelDB from '../../models/character-model-db'

describe('CharacterModelDB', () => {
  let testCharacter: any

  beforeEach(() => {
    testCharacter = {
      id: undefined,
      characterName: '',
      primaryWeapon1: '',
      primaryWeapon2: '',
      primaryRole: '',
      primaryArmor: '',
      primaryGS: 500,
      secondaryWeapon1: '',
      secondaryWeapon2: '',
      secondaryRole: '',
      secondaryArmor: '',
      secondaryGS: 500,
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
  })

  it('Fails validation if id field is missing', async () => {
    const result: any = await CharacterModelDB.validate(testCharacter)

    expect(result).toEqual('bacon')
  })
})
