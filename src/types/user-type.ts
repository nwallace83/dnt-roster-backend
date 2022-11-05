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

export function getNewUser () {
  const user: User = {
    id: '',
    user_name: '',
    is_admin: false,
    avatar: '',
    last_login: 0,
    token: {
      access_token: '',
      expires_at: 0,
      refresh_token: ''
    }
  }

  return user
}
