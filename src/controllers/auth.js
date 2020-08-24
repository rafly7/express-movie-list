import {logInAdmin, logOut, logInUser } from '../middlewares/auth'

const authAdmin = async (req, res, service) => {
  try {
    const auth = req.body
    const admin = await service.authAdmin(auth)
    logInAdmin(req, admin)
    res.status(200)
    res.json({message: 'Success authenticate as admin'})
  } catch (e) {
    res.status(400).json({message: 'Incorrect email or password'})
  }
}

const authUser = async (req, res, service) => {
  try {
    const auth = req.body
    const user = await service.authUser(auth)
    logInUser(req, user)
    res.status(200)
    res.json({message: 'Success authenticate as user'})
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
export {
  authAdmin,
  authUser,
  authAllLogout,
  registerUser
}