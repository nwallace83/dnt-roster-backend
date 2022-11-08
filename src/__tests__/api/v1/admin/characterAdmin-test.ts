/* eslint-disable import/first */
import supertest from 'supertest'
import app from '../../../../app'

const testUser = { inactive: undefined }
const mockMiddleware = jest.fn((req, res, next) => next())
jest.doMock('../../../../middleware/authenticated-middleware', () => mockMiddleware)
jest.doMock('../../../../middleware/admin-middleware', () => mockMiddleware)

const mockUpdateCharacter = jest.fn().mockResolvedValue('not null')
const mockFindCharacterById = jest.fn().mockResolvedValue(testUser)
jest.doMock('../../../../services/db-character-service', () => ({
  updateCharacter: mockUpdateCharacter,
  findCharacterById: mockFindCharacterById

}))

const characterAdmin = require('../../../../api/v1/admin/characterAdmin').default
app.use(characterAdmin)

describe('characterAdmin', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('GET / requires admin authentication', async () => {
    expect.assertions(1)
    return await supertest(app).post('/inactive/testid/false').expect(200).then(() => {
      expect(mockMiddleware.mock.calls.length).toEqual(2)
    })
  })

  test('GET /:false returns updated user as false', async () => {
    expect.assertions(4)
    return await supertest(app).post('/inactive/testid/false').expect(200).then((res) => {
      expect(mockFindCharacterById.mock.calls[0][0]).toEqual('testid')
      expect(mockFindCharacterById.mock.calls[1][0]).toEqual('testid')
      expect(mockUpdateCharacter.mock.calls[0][0]).toEqual({ inactive: false })
      expect(res.body).toEqual({ inactive: false })
    })
  })

  test('GET /:true returns updated user as true', async () => {
    expect.assertions(4)
    return await supertest(app).post('/inactive/testid/true').expect(200).then((res) => {
      expect(mockFindCharacterById.mock.calls[0][0]).toEqual('testid')
      expect(mockFindCharacterById.mock.calls[1][0]).toEqual('testid')
      expect(mockUpdateCharacter.mock.calls[0][0]).toEqual({ inactive: true })
      expect(res.body).toEqual({ inactive: true })
    })
  })
})
