import {Router, json, urlencoded, raw} from 'express'
import session from 'express-session'
import {active} from './auth'
import {config} from 'dotenv'
import connectRedis from 'connect-redis'
import Redis from 'ioredis'
import { SESSION_OPTION } from '../../configs/session'
import REDIS_OPTION from '../../configs/cache.connect'
import cors from 'cors'

config()
const RedisStore = connectRedis(session)
const client = new Redis(REDIS_OPTION)
const store = new RedisStore({client})
const router = Router()

// For BodyParser
router.use(json());
router.use(urlencoded({extended: true}))
router.use(raw())

// For Session in Redis
router.use(session({
  ...SESSION_OPTION,
  store: store
}))
router.use(active)
router.use(cors())

router.use((req, res, next) => {
  next()
});

export default router;