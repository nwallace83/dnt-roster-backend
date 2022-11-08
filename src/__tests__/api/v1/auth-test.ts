import supertest from 'supertest'
import app from '../../../app'

const testUser = { id: 'testId' }
const mockAuthenticatedMiddleware = jest.fn((req, res, next) => {
  req.user = testUser
  next()
})
jest.doMock('../../../middleware/authenticated-middleware', () => mockAuthenticatedMiddleware)

const mockGetJWTTokenForUser = jest.fn().mockReturnValue('NewToken')
jest.doMock('../../../services/token-service', () => ({
  getJWTTokenForUser: mockGetJWTTokenForUser
}))

const auth = require('../../../api/v1/auth').default
app.use(auth)

describe('auth', () => {
  test('GET / requires authentication', async () => {
    expect.assertions(1)

    return await supertest(app).get('/').expect(200).then(() => {
      expect(mockAuthenticatedMiddleware.mock.calls.length).toEqual(1)
    })
  })

  test('returns updated token', async () => {
    expect.assertions(2)

    return await supertest(app).get('/').expect(200).then(res => {
      expect(res.body).toEqual({ token: 'NewToken' })
      expect(mockGetJWTTokenForUser.mock.calls[1][0]).toEqual(testUser)
    })
  })
})
