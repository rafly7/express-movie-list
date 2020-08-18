import {Router} from 'express'
import movieRoutes from '../routers/movie.route';
import authRoutes from '../routers/auth.route'

const router = Router();

router.use('/movie', movieRoutes)
router.use('/auth', authRoutes)

export default router;