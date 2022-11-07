/* eslint-disable import/first */
import supertest from 'supertest'

const testUser = { inactive: undefined }
const mockMiddleware = jest.fn((req, res, next) => next())
jest.doMock('../../../../middleware/authenticated-middleware', () => mockMiddleware)
jest.doMock('../../../../middleware/admin-middleware', () => mockMiddleware)

const mockUpdateCharacter = jest.fn().mockResolvedValue('')
const mockFindCharacterById = jest.fn().mockResolvedValue(testUser)
jest.doMock('../../../../services/db-character-service', () => ({
  updateCharacter: mockUpdateCharacter,
  findCharacterById: mockFindCharacterById

}))

import app from '../../../../app'

describe('characterAdmin', () => {
  const endPoint = '/api/v1/admin/character/inactive/testid/false'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('GET / requires admin authentication', async () => {
    expect.assertions(1)
    return await supertest(app).post(endPoint).expect(200).then(() => {
      expect(mockMiddleware.mock.calls.length).toEqual(2)
    })
  })

  test('GET / returns updated user', async () => {
    expect.assertions(3)
    return await supertest(app).post(endPoint).expect(200).then((res) => {
      expect(mockFindCharacterById.mock.calls[0][0]).toEqual('testid')
      expect(mockUpdateCharacter.mock.calls[0][0]).toEqual({ inactive: false })
      expect(res.body).toEqual({ inactive: false })
    })
  })
})
