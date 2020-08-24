import {Router} from 'express'
import { authAdmin, authAllLogout, authUser, registerUser } from '../controllers/auth';
import { restrict, auth } from '../middlewares/auth';
import Admin from '../models/admin'
import User from '../models/user'
import AuthService from '../services/auth.service';
import cookieParser from 'cookie-parser';

const authAdminService = new AuthService(Admin)
const authUserService = new AuthService(User)
const router = Router();

router.use(cookieParser())
router.post('/register-user', (req, res, next) => registerUser(req, res, authUserService))
router.post('/admin', restrict, (req, res, next) => authAdmin(req, res, authAdminService))
router.post('/user', restrict, (req, res, next) => authUser(req, res, authUserService))
router.post('/logout',auth, (req, res, next) => authAllLogout(req, res, next))
export default router;