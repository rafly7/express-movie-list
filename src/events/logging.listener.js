const recordLog = require('../../configs/logger')
const logEvent = require('./myEmitter')

const loggingListener = () => {
  logEvent.on('APP-ERROR', function (event) {
    recordLog({logType: 'ERROR', logTitle: event.logTitle, logMessage: event.logMessage})
  })
  logEvent.on('APP-FATAL', function (event) {
    recordLog({logType: 'FATAL', logTitle: event.logTitle, logMessage: event.logMessage})
  })
  logEvent.on('APP-INFO', function (event) {
    recordLog({logType: 'INFO', logTitle: event.logTitle, logMessage: event.logMessage})
  })
  logEvent.on('APP-DEBUG', function (event) {
    recordLog({logType: 'DEBUG', logTitle: event.logTitle, logMessage: event.logMessage})
  })
}

module.exports = loggingListener