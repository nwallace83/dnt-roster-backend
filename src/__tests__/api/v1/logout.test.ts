import supertest from 'supertest'
import app from '../../../app'

const logout = require('../../../api/v1/logout').default
app.use('/', logout)

describe('logout', () => {
  test('Logs user out', async () => {
    expect.assertions(1)
    return await supertest(app).post('/').set('Cookie', ['authorization=TOKEN']).expect(200).then(res => {
      expect(res.header['set-cookie'][0]).toContain('authorization=;')
    })
  })
})
