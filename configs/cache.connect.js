import {config} from 'dotenv'
config()

const REDIS_OPTION = {
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
}

export default REDIS_OPTION;