describe('Integration Test db connection', () => {
  const connection = require('../configs/db.connect')
  it('Test connection db', (done) => {
    return connection.authenticate().then(() => {
      expect().toBeUndefined()
      done()
    })
  })
})
