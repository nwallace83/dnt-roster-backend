import supertest from 'supertest'
import app from '../../../app'

const testUser = { id: 'testId', user_name: 'testUserName', is_admin: false, avatar: 'testAvatar' }
const mockAuthenticatedMiddleware = jest.fn((req, res, next) => {
  req.user = testUser
  next()
})
jest.doMock('../../../middleware/authenticated-middleware', () => mockAuthenticatedMiddleware)

const auth = require('../../../api/v1/auth').default
app.use(auth)

describe('auth', () => {
  test('GET / requires authentication', async () => {
    expect.assertions(1)

    return await supertest(app).get('/').expect(200).then(() => {
      expect(mockAuthenticatedMiddleware.mock.calls.length).toEqual(1)
    })
  })

  test('GET / returns user as body', async () => {
    expect.assertions(1)

    return await supertest(app).get('/').expect(200).then(res => {
      expect(res.body).toEqual(testUser)
    })
  })
})
