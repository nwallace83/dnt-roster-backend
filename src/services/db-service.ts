import mongoose from 'mongoose'

const DB_SERVER = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') ? 'mongodb://mongo:27017/dntroster' : 'mongodb://localhost:27017/dntroster'

mongoose.connect(DB_SERVER).catch(err => console.error(err))

export default mongoose
