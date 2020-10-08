const {Router, json, urlencoded, raw} = require('express')
const session = require('express-session')
const {active} = require('./auth')
const connectRedis = require('connect-redis')
const Redis = require('ioredis')
const {SESSION_OPTION} = require('../../configs/session')
const REDIS_OPTION = require('../../configs/cache.connect')

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

router.use((req, res, next) => {
  next()
});

module.exports = router