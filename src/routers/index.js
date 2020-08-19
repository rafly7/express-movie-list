import {Router} from 'express'
import movieRoutes from '../routers/movie.route';
import authRoutes from '../routers/auth.route'
import searchRoutes from '../routers/search.route'

const router = Router();

router.use('/movie', movieRoutes)
router.use('/auth', authRoutes)
router.use('/search', searchRoutes)

export default router;