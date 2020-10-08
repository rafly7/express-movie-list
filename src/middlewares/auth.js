require('dotenv').config()
const { Unauthorized, BadRequest } = require('../errors')
const SIX_HOURS = 1000 * 60 * 60 * 6
const SESSION_ABSOLUTE_TIMEOUT = +(1000 * parseInt(process.env.SESSION_ABSOLUTE_TIMEOUT) || SIX_HOURS)

const logInAdmin = (req, id) => {
  req.session.adminId = id
  req.session.loggedIn = true
  req.session.role = 1
  req.session.createdAt = Date.now()
}

const logInUser = (req, id) => {
  req.session.userId = id
  req.session.loggedIn = true
  req.session.role = 2
  req.session.createdAt = Date.now()
}

const logOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
    if (err) {
      reject(err)
      res.status(500).send('Something went wrong')
    }
    res.clearCookie(process.env.SESSION_NAME)
    resolve()
  })
})


const restrict = (req, res, next) => {
  if(req.session.loggedIn) return next(new BadRequest('You have already logged in'))
  next()
}

const auth = (req, res, next) => {
  if(!req.session.loggedIn) return next(new Unauthorized('You must be logged in'))
  next()
}

const active = async (req, res, next) => {
  if (req.session.loggedIn) {
    const now = Date.now()
    const { createdAt } = req.session
    if (now > createdAt + SESSION_ABSOLUTE_TIMEOUT) {
      await logOut(req, res)
      return next(new Unauthorized('Session expired'))
    }
  }
  next()
}

module.exports = {
  active,
  auth,
  restrict,
  logOut,
  logInUser,
  logInAdmin
}