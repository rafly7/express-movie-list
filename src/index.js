const {createServer} = require('http')
const express = require('express')
const logEvent = require('./events/myEmitter')
const appMiddleware = require('./middlewares/app-middleware')
const appRoutes = require('./routers')
const {dbAssociation} = require('./models/movie_vote_user')

const app = express();
dbAssociation()
app.use(appMiddleware)
app.use(appRoutes)
app.get('/', (req, res) => {
  res.send('Hello world')
})
const server = createServer(app)
server.on('error', function (e) {
  logEvent.emit('APP-ERROR', {
    logTitle: 'APP-FAIED',
    logMessage: e
  })
})

module.exports = server;