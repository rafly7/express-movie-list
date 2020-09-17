const {logInAdmin, logOut, logInUser} = require('../middlewares/auth')

const authAdmin = async (req, res, service) => {
  try {
    const auth = req.body
    const {id, token} = await service.authAdmin(auth)
    logInAdmin(req, id)
    res.status(200)
    res.json({token: token})
  } catch (e) {
    res.status(400).json({message: 'Incorrect email or password'})
  }
}

const authUser = async (req, res, service) => {
  try {
    const auth = req.body
    const {id, token} = await service.authUser(auth)
    logInUser(req, id)
    res.status(200)
    res.json({token: token})
  } catch (e) {
    res.status(400).json({message: 'Incorrect email or password'})
  }
}

const authAllLogout = async (req, res, next) => {
  await logOut(req, res)
  res.status(200).json({message: 'success logout'})
}

const registerUser = async (req, res, service) => {
  try {
    const data = req.body
    const registerUser = await service.registerUser(data)
    res.status(200).json(registerUser)
  } catch (e) {
    res.status(400).json({message: 'Register failed'})
  }
}

module.exports = {
  authAdmin,
  authUser,
  authAllLogout,
  registerUser
}