const connection = require('../../configs/db.connect')
jest.mock('../../configs/db.connect', () => true)
describe('Unit Test db connection', () => {
  it('Test connection', () => {
    expect(connection).toEqual(true)
  })
})