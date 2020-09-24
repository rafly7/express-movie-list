const logEvent = require('../events/myEmitter')
const Bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

class AuthService {
  constructor(Auth) {
    this.Auth = Auth;
  }

  generateToken(id, username, email) {
    const expiresIn = 10**4
    const accessToken = jwt.sign({
      id: id,
      username: username,
      email: email
    }, process.env.TOKEN_SECRET, {
      expiresIn: expiresIn
    })
    return accessToken
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
        const accessToken = this.generateToken(result.id, result.username, result.email)
        return {id: result.id, token: accessToken}
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
        const accessToken = this.generateToken(result.id, result.username, result.email)
        return {id: result.id, token: accessToken}
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

  async registerAdmin(body) {
    try {
      const salt = await Bcrypt.genSalt(10)
      body.password = await Bcrypt.hash(body.password, salt)
      const result = await this.Auth.create(body)
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'REGISTER-ADMIN-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }
}

module.exports = AuthService