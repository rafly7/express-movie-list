import express from 'express'
import { authAdmin, authAllLogout } from '../controllers/auth';
import { restrict } from '../middlewares/auth';
import Admin from '../models/admin'
import AuthService from '../services/auth.service';

const authAdminService = new AuthService(Admin)
const router = express.Router();

router.post('/admin', restrict, (req, res, next) => authAdmin(req, res, authAdminService))
// router.post('/logout', async(req, res, next) => {
//   await logOut(req, res)
//   res.status(200).json({message: 'success logout'})
// })
router.post('/logout', (req, res, next) => authAllLogout(req, res, next))
export default router;