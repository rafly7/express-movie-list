const Router = require('express')
const movieRoutes = require('./movie')
const authRoutes = require('./auth')
const searchRoutes = require('./search')
const logRoute = require('./log')
const noRoute = require('./no')

const router = Router();

router.use(logRoute)
router.use('/movie', movieRoutes)
router.use('/auth', authRoutes)
router.use('/search', searchRoutes)
router.use(noRoute)

module.exports = router