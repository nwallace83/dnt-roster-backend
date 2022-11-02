export default interface DiscordUser {
  username: string
  discriminator: string
  id: string
  avatar: string
  token: DiscordUserToken
}

export interface DiscordUserToken {
  access_token: string
  expires_in: number
  refresh_token: string
}
