export default interface DecodedWebToken {
  userName: string
  id: string
  avatar: string
  isAdmin: boolean
  expiresAt: number
}
