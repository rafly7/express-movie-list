import {config} from 'dotenv'
import server from './src'
import connection from './configs/db.connect'
import logEvent from './src/events/myEmitter'
import loggingListener from './src/events/logging.listener'

config();

if(process.env.APP_NAME) {
  loggingListener();
  connection.authenticate().then(() => {
    server.listen(process.env.APP_PORT, process.env.HOST_LISTEN, function() {
      if(server.listening) {
        console.log(`Server is listening on port ${process.env.APP_PORT}`);
        logEvent.emit('APP-INFO', {
          logTitle: 'SERVER',
          logMessage: `Server is listening on port ${process.env.APP_PORT}`
        })
      }
    })
  }).catch(err => {
    logEvent.emit('APP-ERROR', {
      logTitle: 'DB-FAILED',
      logMessage: err
    })
  })
} else {
  process.exit(1)
}