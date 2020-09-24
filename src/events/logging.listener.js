const recordLog = require('../../configs/logger')
const logEvent = require('./myEmitter')

const loggingListener = () => {
  logEvent.on('APP-ERROR', e => {
    recordLog({logType: 'ERROR', logTitle: e.logTitle, logMessage: e.logMessage})
  })
  logEvent.on('APP-FATAL', e => {
    recordLog({logType: 'FATAL', logTitle: e.logTitle, logMessage: e.logMessage})
  })
  logEvent.on('APP-INFO', e => {
    recordLog({logType: 'INFO', logTitle: e.logTitle, logMessage: e.logMessage})
  })
  logEvent.on('APP-DEBUG', e => {
    recordLog({logType: 'DEBUG', logTitle: e.logTitle, logMessage: e.logMessage})
  })
}

module.exports = loggingListener