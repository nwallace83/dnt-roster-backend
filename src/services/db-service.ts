import mongoose from 'mongoose'

let DB_SERVER: string
const nodeEnv = process.env.NODE_ENV

if (nodeEnv === 'production' || nodeEnv === 'staging') {
  DB_SERVER = 'mongodb://mongo:27017/dntroster'
} else if (nodeEnv === 'test') {
  const THREAD_NUMBER = process.env.JEST_WORKER_ID ?? ''
  DB_SERVER = 'mongodb://localhost:27018/dntroster' + THREAD_NUMBER
} else {
  DB_SERVER = 'mongodb://localhost:27017/dntroster'
}

mongoose.connect(DB_SERVER).catch(err => console.error(err))

export default mongoose
