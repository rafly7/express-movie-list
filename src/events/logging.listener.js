import recordLog from '../../configs/logger'
import logEvent from './myEmitter'

const loggingListener = _ => {
  logEvent.on('APP-ERROR', function (event) {
    recordLog({logType: 'ERROR', logTitle: event.logTitle, logMessage: event.logMessage})
  })
  logEvent.on('APP-FATAL', function (event) {
    recordLog({logType: 'FATAL', logTitle: event.logTitle, logMessage: event.logMessage})
  })
  logEvent.on('APP-INFO', function (event) {
    recordLog({logType: 'INFO', logTitle: event.logTitle, logMessage: event.logMessage})
  })
}

export default loggingListener;