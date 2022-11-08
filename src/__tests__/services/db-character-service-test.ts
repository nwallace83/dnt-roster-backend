import dbCharacterService from '../../services/db-character-service'
import CharacterModelDB from '../../models/character-model-db'
import db from '../../services/db-service'

describe('dbCharacterService', () => {
  let testCharacter: any

  beforeEach(() => {
    testCharacter = {
      id: 'testid',
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

  afterEach(async () => {
    await db.connection.db.dropDatabase()
  })

  afterAll(async () => {
    await db.connection.close()
  })

  describe('findCharacterById', () => {
    beforeEach(async () => {
      return await CharacterModelDB.updateOne({ id: 'testid' }, { ...testCharacter, crafting: { ...testCharacter.crafting } }, { upsert: true, runValidators: true })
    })

    it('Retrieves character', async () => {
      expect.assertions(1)
      return await dbCharacterService.findCharacterById('testid').then((result: any) => {
        expect(result.toJSON()).toEqual(testCharacter)
      })
    })
  })

  describe('updateCharacter', () => {
    beforeEach(async () => {
      await CharacterModelDB.updateOne({ id: 'testid' }, { ...testCharacter, crafting: { ...testCharacter.crafting } }, { upsert: true, runValidators: true })
    })

    test('Updates existing user', async () => {
      await CharacterModelDB.find().then((res: any) => {
        expect(res).toEqual(testCharacter)
        expect(res.characterName).toEqual('bacon')
      }).catch(e => { })

      await dbCharacterService.updateCharacter({ ...testCharacter, characterName: 'testName' })

      await CharacterModelDB.find().then((res: any) => {
        expect(res).toEqual({ ...testCharacter, characterName: 'testName' })
      }).catch(e => { })

      expect.assertions(2)
    })

    test('Does not upate if user not in db', async () => {
      expect.assertions(1)

      expect(await dbCharacterService.updateCharacter({ ...testCharacter, id: undefined, characterName: 'testName' }))
        .toEqual({ acknowledged: true, matchedCount: 0, modifiedCount: 0, upsertedCount: 0, upsertedId: null })
    })
  })

  describe('findCharacters', () => {
    beforeEach(async () => {
      await CharacterModelDB.updateOne({ id: 'testid1' }, { ...testCharacter, crafting: { ...testCharacter.crafting } }, { upsert: true, runValidators: true })
      await CharacterModelDB.updateOne({ id: 'testid2' }, { ...testCharacter, crafting: { ...testCharacter.crafting } }, { upsert: true, runValidators: true })
      await CharacterModelDB.updateOne({ id: 'testid3' }, { ...testCharacter, crafting: { ...testCharacter.crafting } }, { upsert: true, runValidators: true })
    })

    test('Fetches all characters from the database', async () => {
      expect.assertions(1)
      return await dbCharacterService.findCharacters().then(res => {
        expect(res.length).toEqual(3)
      }).catch(e => { })
    })
  })
})
