import tokenService from '../../services/token-service'
import jwt, { Secret } from 'jsonwebtoken'
import User from '../../types/user-type'

describe('tokenService', () => {
  describe('decodeWebToken', () => {
    let testToken: string
    const jwtKey = process.env.JWT_KEY as Secret

    beforeEach(() => {
      jest.useFakeTimers().setSystemTime(new Date('1970-01-01'))
      testToken = jwt.sign({ userName: 'testUser', id: 'testID', avatar: 'testAvatar', isAdmin: false }, jwtKey, { algorithm: 'HS256', expiresIn: 604800000 })
    })

    test('Returns null if key is not set', () => {
      process.env.JEW_KEY = undefined
      const result = tokenService.decodeWebToken('FAKETOKEN')

      expect(result).toBeNull()
    })

    test('Returns decoded web token', () => {
      const result = tokenService.decodeWebToken(testToken)

      expect(result).toEqual({ avatar: 'testAvatar', exp: 604800000, iat: 0, id: 'testID', isAdmin: false, userName: 'testUser' })
    })

    test('Returns null if token is expired', () => {
      jest.useFakeTimers().setSystemTime(new Date('3000-01-01'))
      const result = tokenService.decodeWebToken(testToken)
      expect(result).toBeNull()
    })
  })

  describe('getJWTTokenForUser', () => {
    test('returns a new token for the user', () => {
      const testUser: User = {
        id: 'testUser',
        user_name: 'testUserName',
        is_admin: false,
        avatar: 'testAvatar'
      }

      const result = tokenService.getJWTTokenForUser(testUser)

      expect(result).toEqual('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6InRlc3RVc2VyTmFtZSIsImlkIjoidGVzdFVzZXIiLCJhdmF0YXIiOiJ0ZXN0QXZhdGFyIiwiaXNBZG1pbiI6ZmFsc2UsImV4cGlyZXNBdCI6MzI1MDQyODQ4MDAwMDAsImlhdCI6MzI1MDM2ODAwMDAsImV4cCI6MzMxMDg0ODAwMDB9.YtuINbyhK6NSY5KvaeMLBhRA4640r6cpAe8Mo6VN_fQ')
    })
  })
})
