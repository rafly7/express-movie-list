const {config} = require('dotenv')
config()

const REDIS_OPTION = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
}

module.exports = REDIS_OPTION