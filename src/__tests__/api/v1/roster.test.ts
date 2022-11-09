import supertest from 'supertest'
import app from '../../../app'

const mockTestCharacters = [
  { id: 'test1' },
  { id: 'test2' },
  { id: 'test3' }
]
let mockFindCharacter = jest.fn().mockResolvedValueOnce(mockTestCharacters).mockRejectedValueOnce('')
jest.doMock('../../../services/db-character-service', () => {
  return {
    findCharacters: mockFindCharacter
  }
})

const roster = require('../../../api/v1/roster').default
app.use(roster)

describe('roster', () => {
  test('GET / roster returns roster', async () => {
    expect.assertions(1)
    return await supertest(app).get('/').expect(200).then(response => {
      expect(response.body).toEqual(mockTestCharacters)
    })
  })

  test('GET / roster returns 401 if unable to retrieve characters', async () => {
    mockFindCharacter = jest.fn().mockRejectedValue('')
    expect.assertions(1)
    return await supertest(app).get('/').expect(401).then(response => {
      expect(response.text).toEqual('Unable to retrieve characters')
    })
  })
})
