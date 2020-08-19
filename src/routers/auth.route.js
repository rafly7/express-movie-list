import express from 'express'
import { authAdmin, authAllLogout } from '../controllers/auth';
import { restrict, auth } from '../middlewares/auth';
import Admin from '../models/admin'
import AuthService from '../services/auth.service';

const authAdminService = new AuthService(Admin)
const router = express.Router();

router.post('/admin', restrict, (req, res, next) => authAdmin(req, res, authAdminService))
router.post('/logout',auth, (req, res, next) => authAllLogout(req, res, next))
export default router;