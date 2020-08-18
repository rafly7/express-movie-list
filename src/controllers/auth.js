import {logInAdmin, logOut } from '../middlewares/auth'

const authAdmin = async (req, res, service) => {
  const auth = req.body
  const admin = await service.authAdmin(auth)
  logInAdmin(req, admin)
  res.status(200)
  res.json({message: 'success authenticate'})
}

const authAllLogout = async (req, res, next) => {
  await logOut(req, res)
  res.status(200).json({message: 'success logout'})
}
export { authAdmin, authAllLogout}