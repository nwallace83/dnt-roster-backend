const db = require('../services/dbService')

const userSchema = db.mongoose.Schema({
    id: {type: String, required: true},
    user_name: {type: String},
    is_admin: {type: Boolean, default: false},
    avatar: {type: String},
    last_login: {type: Number},
    token: {
        access_token: {type: String},
        expires_at: {type: Number},
        refresh_token: {type: String},        
    }
});

const User = db.mongoose.model("users",userSchema)

exports.userSchema = userSchema
exports.UserModel = User