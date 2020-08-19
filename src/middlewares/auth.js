import {config} from 'dotenv'

config()

const SIX_HOURS = 1000 * 60 * 60 * 6
const SESSION_ABSOLUTE_TIMEOUT = +(process.env.SESSION_ABSOLUTE_TIMEOUT || SIX_HOURS)

const catchAsync = handler =>
  (...args) => handler(...args).catch(args[2])

export const logInAdmin = (req, userId) => {
  req.session.userId = userId
  req.session.loggedIn = true
  req.session.role = 1
  req.session.createdAt = Date.now()
}

export const logOut = (req, res) =>
  new Promise((resolve, reject) => {
    req.session.destroy(err => {
    if (err) reject(err)
    res.clearCookie(process.env.SESSION_NAME)
    resolve()
  })
})


export const restrict = (req, res, next) => {
  if(req.session.loggedIn) {
    res.status(400).json({message: 'You have already logged in'})
  } else {
    next()
  }
}

export const auth = (req, res, next) => {
  if(req.session.loggedIn) {
    next()
  } else {
    res.status(401).json({message: 'You must be logged in'})
  }
}

export const active  = catchAsync(
  async (req, res, next) => {
    if (req.session.loggedIn) {
      const now = Date.now()
      const { createdAt } = req.session

      if (now > createdAt + SESSION_ABSOLUTE_TIMEOUT) {
        await logOut(req, res)

        res.status(401).send('Session expired')
      }
    }

    next()
  }
)