const {Router} = require('express')
const {
  authAdmin,
  authAllLogout,
  authUser,
  registerUser,
  registerAdmin,
  forgotPasswordUser,
  resetPasswordUser
} = require('../controllers/auth')
const {restrict, auth} = require('../middlewares/auth')
const {cookieValidationAdmin} = require('../middlewares/cookie-validation')
const {catchAsync} = require('../middlewares/error')
const Admin = require('../models/admin')
const User = require('../models/user')
const AuthService = require('../services/auth')
const cookieParser = require('cookie-parser')
const adminService = new AuthService(Admin)
const userService = new AuthService(User)
const router = Router();

router.use(cookieParser())
router.post('/register-user', catchAsync((req, res) => registerUser(req, res, userService)))
router.post('/register-admin',cookieValidationAdmin, catchAsync((req, res) => registerAdmin(req, res, adminService)))
router.post('/admin', restrict, catchAsync((req, res) => authAdmin(req, res, adminService)))
router.post('/user', restrict, catchAsync((req, res) => authUser(req, res, userService)))
router.post('/logout',auth, (req, res, next) => authAllLogout(req, res, next))
router.post('/forgotpassword-user', catchAsync((req, res, next) => forgotPasswordUser(req, res, next, userService)))
router.put('/resetpassword-user/:resettoken', catchAsync((req, res, next) => resetPasswordUser(req, res, next, userService)))

module.exports = router