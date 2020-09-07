const logEvent = require('../src/events/myEmitter');
const loggingListener = require('../src/events/logging.listener');
const recordLog = require('../configs/logger')

beforeAll(() => {
  loggingListener()
})
it('logging listener', () => {
  logEvent.emit('APP-INFO', jest.fn(() => {
    return {logTitle: 'test title', logMessage: 'test message'}
  }))
  expect(logEvent).toBeDefined()
  logEvent.emit('APP-ERROR', jest.fn(() => {
    return {logTitle: 'test title', logMessage: 'test message'}
  }))
  expect(logEvent).toBeDefined()
  logEvent.emit('APP-FATAL', jest.fn(() => {
    return {logTitle: 'test title', logMessage: 'test message'}
  }))
  expect(logEvent).toBeDefined()
  logEvent.emit('APP-DEBUG', jest.fn(() => {
    return {logTitle: 'test title', logMessage: 'test message'}
  }))
  expect(logEvent).toBeDefined()
})
