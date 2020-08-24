const logEvent = require('../events/myEmitter')
const Bcrypt = require('bcryptjs')

class AuthService {
  constructor(Auth) {
    this.Auth = Auth;
  }

  async authAdmin(body) {
    try {
      const result = await this.Auth.findOne({
        where: {
          email: body.email
        }
      })
      const matchPassword = Bcrypt.compareSync(body.password, result.password)
      if(matchPassword) {
        return result.id
      }
      throw new Error
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'AUTH-ADMIN-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async authUser(body) {
    try {
      const result = await this.Auth.findOne({
        where: {
          email: body.email
        }
      })
      const matchPassword = Bcrypt.compareSync(body.password, result.password)
      if(matchPassword) {
        return result.id
      }
      throw new Error
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'AUTH-USER-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async registerUser(body) {
    try {
      const salt = await Bcrypt.genSalt(10)
      body.password = await Bcrypt.hash(body.password, salt)
      const result = await this.Auth.create(body)
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'REGISTER-USER-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }
}

module.exports = AuthService