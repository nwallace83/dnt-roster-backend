
const mockConnect = jest.fn().mockImplementation(async () => await Promise.resolve('MOCK-DB-CONNECT'))
jest.doMock('mongoose', () => ({
  ...jest.requireActual('mongoose'),
  connect: mockConnect
}))

const CharacterModelDB = require('../../models/character-model-db').default

describe('CharacterModelDB', () => {
  let testCharacter: any

  beforeEach(() => {
    testCharacter = {
      id: '',
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
    expect.assertions(1)
    testCharacter.id = undefined
    return await expect(CharacterModelDB.validate(testCharacter)).rejects.toThrowError('Validation failed: id: Path `id` is required.')
  })
})
