const connection = require('../configs/db.connect')
describe('database connection testing', () => {
  it('Test connection db', (done) => {
    return connection.authenticate().then((res) => {
      expect(res).toBeUndefined()
      done()
    })
  })
})
