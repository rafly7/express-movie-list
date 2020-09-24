const {createServer} = require('http')
const express = require('express')
const logEvent = require('./events/myEmitter')
const appMiddleware = require('./middlewares/app-middleware')
const {serverError} = require('./middlewares/error')
const appRoutes = require('./routers')
const {dbAssociation} = require('./models/movie_vote_user')

const app = express();
dbAssociation()
app.use(appMiddleware)
app.use(appRoutes)
app.use(serverError)
const server = createServer(app)
server.on('error', function (e) {
  logEvent.emit('APP-ERROR', {
    logTitle: 'APP-FAILED',
    logMessage: e
  })
})

module.exports = server;