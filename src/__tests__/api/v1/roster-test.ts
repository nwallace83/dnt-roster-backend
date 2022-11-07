/* eslint-disable import/first */
import supertest from 'supertest'

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

import app from '../../../app'

describe('roster', () => {
  test('GET /roster returns roster', async () => {
    expect.assertions(1)
    return supertest(app).get('/api/v1/roster').expect(200).then(response => {
      expect(response.body).toEqual(mockTestCharacters)
    })
  })

  test('GET /roster returns 401 if unable to retrieve characters', async () => {
    mockFindCharacter = jest.fn().mockRejectedValue('')
    expect.assertions(1)
    return supertest(app).get('/api/v1/roster').expect(401).then(response => {
      expect(response.text).toEqual('Unable to retrieve characters')
    })
  })
})
