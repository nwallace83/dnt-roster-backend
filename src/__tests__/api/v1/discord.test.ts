/* eslint-disable @typescript-eslint/promise-function-async */
import supertest from 'supertest'
import app from '../../../app'

const mockFetch = jest.fn().mockImplementation((input, data) => {
  switch (input) {
    case 'https://discord.com/api/oauth2/token':
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ access_token: 'DISCORDTESTACCESSTOKEN' })
      })
    case 'https://discord.com/api/users/@me':
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({})
      })
    case 'https://discord.com/api/users/@me/guilds':
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ id: '550866967200792577' }])
      })
    default:
      return Promise.reject(new Error('UNEXPECTED API CALL'))
  }
})
jest.doMock('node-fetch', () => mockFetch)

const mockSaveDiscordUserToDatabase = jest.fn().mockImplementation(() => {
  return Promise.resolve({ id: 'testId', user_name: 'testUserName', is_admin: false, avatar: 'testAvatar' })
})
jest.doMock('../../../services/db-user-service', () => ({
  saveDiscordUserToDatabase: mockSaveDiscordUserToDatabase
}))

const mockGetJWTTokenForUser = jest.fn().mockImplementation(() => {
  return 'FAKEAUTHTOKEN'
})
jest.doMock('../../../services/token-service', () => ({
  getJWTTokenForUser: mockGetJWTTokenForUser
}))

const discord = require('../../../api/v1/discord').default
app.use(discord)

describe('discord', () => {
  const endPoint = '/login/testcode'

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('GET /login/:code calls the discord token API', async () => {
    const testParams = new URLSearchParams()
    testParams.append('grant_type', 'authorization_code')
    testParams.append('client_id', '944735010311786537')
    testParams.append('client_secret', process.env.CLIENT_SECRET ?? 'FAIL')
    testParams.append('code', 'testcode')
    testParams.append('redirect_uri', process.env.REDIRECT_URI ?? 'FAIL')

    expect.assertions(4)
    return await supertest(app).post(endPoint).expect(200).then(res => {
      expect(mockFetch.mock.calls[0][0].length).toBeGreaterThanOrEqual(1)
      expect(mockFetch.mock.calls[0][0]).toEqual('https://discord.com/api/oauth2/token')
      expect(mockFetch.mock.calls[0][1].method).toEqual('POST')
      expect(mockFetch.mock.calls[0][1].body).toEqual(testParams)
    })
  })

  test('GET /login/:code calls user API correctly', async () => {
    expect.assertions(5)
    return await supertest(app).post(endPoint).expect(200).then(res => {
      expect(mockFetch.mock.calls[0][0].length).toBeGreaterThanOrEqual(2)
      expect(mockFetch.mock.calls[1][0]).toEqual('https://discord.com/api/users/@me')
      expect(mockFetch.mock.calls[1][1].method).toEqual('GET')
      expect(mockFetch.mock.calls[1][1].headers).toEqual({ Authorization: 'Bearer DISCORDTESTACCESSTOKEN' })
      expect(mockFetch.mock.calls[1][1].body).toBeFalsy()
    })
  })

  test('GET /login/:code calls guilds API correctly', async () => {
    expect.assertions(5)
    return await supertest(app).post(endPoint).expect(200).then(res => {
      expect(mockFetch.mock.calls[0][0].length).toBeGreaterThanOrEqual(3)
      expect(mockFetch.mock.calls[2][0]).toEqual('https://discord.com/api/users/@me/guilds')
      expect(mockFetch.mock.calls[2][1].method).toEqual('GET')
      expect(mockFetch.mock.calls[2][1].headers).toEqual({ Authorization: 'Bearer DISCORDTESTACCESSTOKEN' })
      expect(mockFetch.mock.calls[2][1].body).toBeFalsy()
    })
  })

  test('GET /login/:code saves user to database', async () => {
    const expectedValue = { token: { access_token: 'DISCORDTESTACCESSTOKEN' } }

    expect.assertions(2)
    return await supertest(app).post(endPoint).expect(200).then(res => {
      expect(mockSaveDiscordUserToDatabase.mock.calls.length).toEqual(1)
      expect(mockSaveDiscordUserToDatabase.mock.calls[0][0]).toEqual(expectedValue)
    })
  })

  test('GET /login/:code returns user and auth token', async () => {
    jest.useFakeTimers().setSystemTime(new Date('1970-01-01'))
    expect.assertions(4)
    return await supertest(app).post(endPoint).expect(200).then(res => {
      const expectedBody = { id: 'testId', user_name: 'testUserName', is_admin: false, avatar: 'testAvatar' }
      expect(res.header['set-cookie'][0]).toContain('authorization=FAKEAUTHTOKEN')
      expect(res.header['set-cookie'][0]).toContain('HttpOnly')
      expect(res.header['set-cookie'][0]).toContain('Expires=Sat, 31 Jan 1970 00:00:00 GMT')
      expect(res.body).toEqual(expectedBody)
    })
  })
})
