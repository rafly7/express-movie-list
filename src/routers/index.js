import {Router} from 'express'
import movieRoutes from '../routers/movie.route';
import authRoutes from '../routers/auth.route'
import searchRoutes from '../routers/search.route'
import logRoute from './log.route';
import noRoute from './no.route';

const router = Router();

router.use(logRoute)
router.use('/movie', movieRoutes)
router.use('/auth', authRoutes)
router.use('/search', searchRoutes)
router.use(noRoute)

export default router;