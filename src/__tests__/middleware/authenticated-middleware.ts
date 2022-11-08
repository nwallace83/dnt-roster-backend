import supertest from 'supertest'
import app from '../../app'

const mockGetUserById = jest.fn().mockImplementation(id => {
  switch (id) {
    case 'TESTID':
      return Promise.resolve('FAKEUSER')
    case 'MISSINGID':
      return Promise.reject(new Error(''))
    default:
      return null
  }
})
jest.doMock('../../services/db-user-service', () => ({
  getUserById: mockGetUserById
}))

const mockDecodeWebToken = jest.fn().mockImplementation((token) => {
  switch (token) {
    case 'GOODTOKEN':
      return { id: 'TESTID' }
    case 'MISSINGTOKEN':
      return { id: 'MISSINGID' }
    case 'BADTOKEN':
      return null
  }
})
const mockGetJWTTokenForUser = jest.fn().mockReturnValue('NEWTOKEN')
jest.doMock('../../services/token-service', () => ({
  decodeWebToken: mockDecodeWebToken,
  getJWTTokenForUser: mockGetJWTTokenForUser
}))

const mockMiddleware = jest.fn().mockImplementation((req, res, next) => {
  res.sendStatus(200)
})
const authenticatedMiddleware = require('../../middleware/authenticated-middleware').default
app.use(authenticatedMiddleware)
app.use(mockMiddleware)

describe('authenticatedMiddlware', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('Returns 401 if no token', async () => {
    expect.assertions(3)
    return await supertest(app).get('/').expect(401).then(() => {
      expect(mockDecodeWebToken.mock.calls.length).toEqual(0)
      expect(mockGetJWTTokenForUser.mock.calls.length).toEqual(0)
      expect(mockGetUserById.mock.calls.length).toEqual(0)
    })
  })

  test('Returns 401 if token is invalid', async () => {
    expect.assertions(4)
    return await supertest(app).get('/').set('Cookie', ['authorization=BADTOKEN']).expect(401).then(() => {
      expect(mockDecodeWebToken.mock.calls.length).toEqual(1)
      expect(mockDecodeWebToken.mock.calls[0][0]).toEqual('BADTOKEN')
      expect(mockGetJWTTokenForUser.mock.calls.length).toEqual(0)
      expect(mockGetUserById.mock.calls.length).toEqual(0)
    })
  })

  test('Returns 401 if user is not in the database', async () => {
    expect.assertions(5)
    return await supertest(app).get('/').set('Cookie', ['authorization=MISSINGTOKEN']).expect(401).then(() => {
      expect(mockDecodeWebToken.mock.calls.length).toEqual(1)
      expect(mockDecodeWebToken.mock.calls[0][0]).toEqual('MISSINGTOKEN')
      expect(mockGetUserById.mock.calls.length).toEqual(1)
      expect(mockGetUserById.mock.calls[0][0]).toEqual('MISSINGID')
      expect(mockGetJWTTokenForUser.mock.calls.length).toEqual(0)
    })
  })

  test('Adds user property to request and updates token', async () => {
    expect.assertions(8)
    return await supertest(app).get('/').set('Cookie', ['authorization=GOODTOKEN']).expect(200).then((res) => {
      expect(mockDecodeWebToken.mock.calls.length).toEqual(1)
      expect(mockDecodeWebToken.mock.calls[0][0]).toEqual('GOODTOKEN')
      expect(mockGetUserById.mock.calls.length).toEqual(1)
      expect(mockGetUserById.mock.calls[0][0]).toEqual('TESTID')
      expect(mockGetJWTTokenForUser.mock.calls.length).toEqual(1)
      expect(mockGetJWTTokenForUser.mock.calls[0][0]).toEqual('FAKEUSER')
      expect(mockMiddleware.mock.calls[0][0].user).toEqual('FAKEUSER')
      expect(res.header['set-cookie'][0]).toContain('authorization=NEWTOKEN')
    })
  })
})
