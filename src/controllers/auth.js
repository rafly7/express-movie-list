const { BadRequest, InternalServer } = require('../errors')
const {logInAdmin, logOut, logInUser} = require('../middlewares/auth')
const client = require('redis').createClient()
const crypto = require('crypto')
const sendEmail = require('../utils/sendEmail')
const logEvent = require('../events/myEmitter')

const authAdmin = async (req, res, service) => {
  try {
    const auth = req.body
    const {id, token} = await service.authAdmin(auth)
    logInAdmin(req, id)
    res.status(200)
    res.json({token: token})
  } catch {
    throw new BadRequest('Incorrect email or password')
  }
}

const authUser = async (req, res, service) => {
  try {
    const auth = req.body
    const {id, token} = await service.authUser(auth)
    logInUser(req, id)
    res.status(200)
    res.json({token: token})
  } catch {
    throw new BadRequest('Incorrect email or password')
  }
}

const authAllLogout = async (req, res) => {
  await logOut(req, res)
  res.status(200).json({message: 'success logout'})
}

const registerUser = async (req, res, service) => {
  try {
    const data = req.body
    const registerUser = await service.registerUser(data)
    res.status(200).json(registerUser)
  } catch {
    throw new BadRequest('Register user failed')
  }
}

const registerAdmin = async (req, res, service) => {
  try {
    const data = req.body
    const registerAdmin = await service.registerAdmin(data)
    res.status(200).json(registerAdmin)
  } catch {
    throw new BadRequest('Register admin failed')
  }
}

const forgotPasswordUser = async (req, res, next, service) => {
  try {
    const data = req.body
    const getUser = await service.getEmail(data)
    if(getUser === null) {
      return next(new BadRequest('There is no email with that user'))
    }
    const resetToken = crypto.randomBytes(20).toString('hex')
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    client.setex(resetPasswordToken, 600, JSON.stringify(getUser))
    
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/auth/resetpassword-user/${resetToken}`
    
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

    await sendEmail({
      email: getUser.email,
      subject: 'Password reset token',
      message
    })
    res.status(200).json({
      success: true,
      data: 'Email sent'
    })
  } catch (e) {
    throw new InternalServer('Something went wrong')
  }
}

const resetPasswordUser = async (req, res, next, service) => {
  try {
    const resetToken = req.params.resettoken
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex')
    client.get(resetPasswordToken,async function(err, data) {
      if(err) {
        logEvent.emit('APP-ERROR', {
          logTitle: 'GET-KEY-RESET-PASSWORD-TOKEN-REDIS-FAILED',
          logMessage: err
        })
      }
      if(data != null) {
        const id = JSON.parse(data).id
        req.body.id = id
        const body = req.body
        const user = await service.changePasswordUser(body)
        const result = client.del(resetPasswordToken)
        if(!result) return next(new InternalServer('Something went wrong'))
        res.status(200).json(user)
      } else {
        return next(new BadRequest('Key not found'))
      }
    })
  } catch (e) {
    logEvent.emit('APP-ERROR', {
      logTitle: 'RESET-PASSWORD-USER-CONTROLLER-FAILED',
      logMessage: e
    })
    throw new InternalServer('Something went wrong')
  }
}

module.exports = {
  authAdmin,
  authUser,
  authAllLogout,
  registerUser,
  registerAdmin,
  forgotPasswordUser,
  resetPasswordUser
}