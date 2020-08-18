import express from 'express'
import MovieService from '../services/movie.service'
import {addMovie, updateMovie} from '../controllers/movie'
import Movie from '../models/movie'
import cookieValidationAdmin from '../middlewares/cookie-validation'

const movieService = new MovieService(Movie)
const router = express.Router();

router.use(cookieValidationAdmin)
router.post('/', (req, res, next) => addMovie(req, res, movieService))
router.put('/',(req, res, next) => updateMovie(req, res, movieService))

export default router;
