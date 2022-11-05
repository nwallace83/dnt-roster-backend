import db from '../services/db-service'
import { Schema } from 'mongoose'
import User from '../types/user-type'

const userSchema = new Schema<User>({
  id: { type: String, required: true },
  user_name: { type: String },
  is_admin: { type: Boolean, default: false },
  avatar: { type: String },
  last_login: { type: Number },
  token: {
    access_token: { type: String },
    expires_at: { type: Number },
    refresh_token: { type: String }
  }
})

const UserModelDB = db.model('users', userSchema)

export default UserModelDB
