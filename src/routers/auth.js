const {Router} = require('express')
const {authAdmin, authAllLogout, authUser, registerUser} = require('../controllers/auth')
const {restrict, auth} = require('../middlewares/auth')
const Admin = require('../models/admin')
const User = require('../models/user')
const AuthService = require('../services/auth')
const cookieParser = require('cookie-parser')

const authAdminService = new AuthService(Admin)
const authUserService = new AuthService(User)
const router = Router();

router.use(cookieParser())
router.post('/register-user', (req, res, next) => registerUser(req, res, authUserService))
router.post('/admin', restrict, (req, res, next) => authAdmin(req, res, authAdminService))
router.post('/user', restrict, (req, res, next) => authUser(req, res, authUserService))
router.post('/logout',auth, (req, res, next) => authAllLogout(req, res, next))

module.exports = router