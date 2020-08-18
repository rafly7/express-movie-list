import {createServer} from 'http'
import express from 'express'
import logEvent from './events/myEmitter'
import appMiddleware from './middlewares/app-middleware'
import appRoutes from './routers'

const app = express();
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

export default server;