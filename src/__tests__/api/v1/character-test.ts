/* eslint-disable import/first */
import supertest from 'supertest'

const testCharacter = { characterName: 'testCharacter' }
const testUser = { id: 'testid' }

const mockFindCharacterById = jest.fn().mockResolvedValue(testCharacter)
const mockSaveCharacter = jest.fn().mockResolvedValue(testCharacter)
jest.doMock('../../../services/db-character-service', () => ({
  findCharacterById: mockFindCharacterById,
  saveCharacter: mockSaveCharacter
}))

const mockAuthenticatedMiddleware = jest.fn((req, res, next) => {
  req.user = testUser
  next()
})
jest.doMock('../../../middleware/authenticated-middleware', () => mockAuthenticatedMiddleware)

import app from '../../../app'
import character from '../../../api/v1/character'
app.use('/api/v1/character', character)

describe('character', () => {
  const endPoint = '/api/v1/character'

  test('GET / requires authentication', async () => {
    expect.assertions(1)
    return await supertest(app).get(endPoint).expect(200).then(() => {
      expect(mockAuthenticatedMiddleware.mock.calls.length).toEqual(1)
    })
  })

  test('GET / returns character if user is authenticated', async () => {
    expect.assertions(2)
    return await supertest(app).get(endPoint).expect(200).then((result) => {
      expect(result.body).toEqual(testCharacter)
      expect(mockFindCharacterById.mock.calls[0][0]).toEqual('testid')
    })
  })

  test('POST / saves character to database', async () => {
    return await supertest(app).post(endPoint).send(testCharacter).expect(200).then(() => {
      expect(JSON.stringify(mockSaveCharacter.mock.calls[0][0])).toContain('testCharacter')
    })
  })

  test('POST / sanitizes character before returning', async () => {
    const sanitizedCharacter = {
      id: 'testid',
      characterName: 'testCharacter',
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

    return await supertest(app).post(endPoint).send(testCharacter).expect(200).then((response) => {
      expect(response.body).toEqual(sanitizedCharacter)
    })
  })
})
