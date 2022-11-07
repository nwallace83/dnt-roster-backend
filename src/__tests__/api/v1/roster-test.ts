import app from '../../../app'
import supertest from 'supertest'

jest.mock('../../../services/db-character-service', () => {
  const mockTestCharacters = [
    { id: 'test1' },
    { id: 'test2' },
    { id: 'test3' }
  ]
  return {
    findCharacters: jest.fn()
      .mockResolvedValueOnce(mockTestCharacters)
      .mockRejectedValueOnce('')
  }
})

describe('roster', () => {
  const mockTestCharacters = [
    { id: 'test1' },
    { id: 'test2' },
    { id: 'test3' }
  ]

  test('GET /roster returns roster', async () => {
    expect.assertions(1)
    return supertest(app).get('/api/v1/roster').expect(200).then(response => {
      expect(response.body).toEqual(mockTestCharacters)
    })
  })

  test('GET /roster returns 401 if unable to retrieve characters', async () => {
    expect.assertions(1)
    return supertest(app).get('/api/v1/roster').expect(401).then(response => {
      expect(response.text).toEqual('Unable to retrieve characters')
    })
  })
})
