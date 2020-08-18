import logEvent from '../events/myEmitter'
import Bcrypt from 'bcryptjs'

class AuthService {
  constructor(Auth) {
    this.Auth = Auth;
  }

  async authAdmin(body) {
    let result;
    try {
      result = await this.Auth.findOne({
        attributes: ['id','username','email','phoneNumber','password'],
        where: {
          email: body.email
        }
      })
      const matchPassword = Bcrypt.compareSync(body.password, result.password)
      if(matchPassword) {
        result = result.id
      }
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'CREATE-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
    }
    return result
  }
}

export default AuthService