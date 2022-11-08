import { Schema } from 'mongoose'

describe('dbService', () => {
  const origEnv = { ...process.env }
  const testSchema = new Schema({ test: { type: String } })

  const mockConnect = jest.fn().mockImplementation(async () => await Promise.resolve('MOCK-DB-CONNECT'))
  jest.doMock('mongoose', () => ({
    ...jest.requireActual('mongoose'),
    connect: mockConnect
  }))

  afterEach(() => {
    process.env = origEnv
    jest.clearAllMocks()
  })

  it('Calls the correct production database', async () => {
    process.env.NODE_ENV = 'production'
    let db
    let testModel

    jest.isolateModules(() => {
      db = require('../../services/db-service')
      testModel = db.default.model('test', testSchema)
      testModel.updateOne({ test: 'test' })
    })

    expect(mockConnect.mock.calls[0][0]).toEqual('mongodb://mongo:27017/dntroster')
  })

  it('Calls the correct staging database', async () => {
    process.env.NODE_ENV = 'staging'
    let db
    let testModel

    jest.isolateModules(() => {
      db = require('../../services/db-service')
      testModel = db.default.model('test', testSchema)
      testModel.updateOne({ test: 'test' })
    })

    expect(mockConnect.mock.calls[0][0]).toEqual('mongodb://mongo:27017/dntroster')
  })

  it('Calls the correct test database', async () => {
    process.env.NODE_ENV = 'test'
    process.env.JEST_WORKER_ID = 'FAKE'
    let db
    let testModel

    jest.isolateModules(() => {
      db = require('../../services/db-service')
      testModel = db.default.model('test', testSchema)
      testModel.updateOne({ test: 'test' })
    })

    expect(mockConnect.mock.calls[0][0]).toEqual('mongodb://localhost:27018/dntrosterFAKE')
  })

  it('Calls the local database if NODE_ENV not set', async () => {
    process.env.NODE_ENV = ''
    let db
    let testModel

    jest.isolateModules(() => {
      db = require('../../services/db-service')
      testModel = db.default.model('test', testSchema)
      testModel.updateOne({ test: 'test' })
    })

    expect(mockConnect.mock.calls[0][0]).toEqual('mongodb://localhost:27017/dntroster')
  })
})
