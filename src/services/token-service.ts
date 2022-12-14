import jwt, { Secret } from 'jsonwebtoken'
import User from '../types/user-type'
import DecodedWebToken from '../types/decoded-web-token-type'

const jwtKey: Secret = process.env.JWT_KEY as Secret

const THIRTY_DAYS = 604800000

function decodeWebToken (token: string) {
  try {
    const decodedWebToken = jwt.verify(token, jwtKey) as DecodedWebToken
    return decodedWebToken
  } catch {
    return null
  }
}

function getJWTTokenForUser (user: User) {
  return jwt.sign({
    userName: user.user_name,
    id: user.id,
    avatar: user.avatar,
    isAdmin: user.is_admin,
    expiresAt: Date.now() + THIRTY_DAYS
  },
  jwtKey, {
    algorithm: 'HS256',
    expiresIn: THIRTY_DAYS
  })
}

const tokenService = { decodeWebToken, getJWTTokenForUser }
export default tokenService
