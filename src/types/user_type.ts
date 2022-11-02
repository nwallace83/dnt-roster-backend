export default interface User {
  id: string
  user_name: string
  is_admin: boolean
  avatar: string
  last_login: number
  token: UserToken
}

export interface UserToken {
  access_token: string
  expires_at: number
  refresh_token: string
}
