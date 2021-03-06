const {createLogger} = require('bunyan')
const {config} =  require('dotenv')

config();

const logConfig = createLogger({
  name: process.env.APP_NAME,
  level: process.env.LOG_LEVEL,
  streams: [
    {
      stream: process.stdout,
    },
    {
      type: "rotating-file",
      level: process.env.LOG_LEVEL,
      period: process.env.NODE_ENV === 'test' ? "10ms" : "3d",
      count: 3,
      path: `./log/${process.env.LOG_PATH}`,
    },
  ],
});

const recordLog = (logInfo) => {
  switch (logInfo.logType) {
    case "FATAL":
      logConfig.fatal(logInfo.logTitle, logInfo.logMessage)
      break
    case 'ERROR':
      logConfig.error(logInfo.logTitle, logInfo.logMessage)
      break
    case 'INFO':
      logConfig.info(logInfo.logTitle, logInfo.logMessage)
      break
    default:
      logConfig.debug(logInfo.logTitle, logInfo.logMessage)
  }
};

module.exports = recordLog