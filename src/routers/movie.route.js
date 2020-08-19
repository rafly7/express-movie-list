import express from 'express'
import MovieService from '../services/movie.service'
import {addMovie, updateMovie, getMovieWithPagination} from '../controllers/movie'
import Movie from '../models/movie'
import {cookieValidationAdmin, cookieValidationUser} from '../middlewares/cookie-validation'

const movieService = new MovieService(Movie)
const router = express.Router();
router.get('/:page',cookieValidationUser, (req, res, next) => getMovieWithPagination(req, res, movieService))
router.put('/',cookieValidationAdmin, (req, res, next) => updateMovie(req, res, movieService))
router.post('/',cookieValidationAdmin, (req, res, next) => addMovie(req, res, movieService))

export default router;
