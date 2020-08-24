const Router = require('express')
const movieRoutes = require('./movie.route')
const authRoutes = require('./auth.route')
const searchRoutes = require('./search.route')
const logRoute = require('./log.route')
const noRoute = require('./no.route')

const router = Router();

router.use(logRoute)
router.use('/movie', movieRoutes)
router.use('/auth', authRoutes)
router.use('/search', searchRoutes)
router.use(noRoute)

module.exports = router