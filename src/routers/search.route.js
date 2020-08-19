import express from 'express'
import MovieService from '../services/movie.service'
import GenreService from '../services/genre.service'
import {mostViewedGenre,mostViewedMovie, findWithQuery} from '../controllers/search'
import Movie from '../models/movie'
import Genre from '../models/genre'
import {cookieValidationAdmin, cookieValidationUser} from '../middlewares/cookie-validation'

const movieService = new MovieService(Movie)
const genreService = new GenreService(Genre)
const router = express.Router();

router.get('/', cookieValidationUser, (req, res, next) => findWithQuery(req,res, movieService))
router.get('/most-viewed-movie',cookieValidationAdmin, (req, res, next) => mostViewedMovie(req, res, movieService))
router.get('/most-viewed-genre',cookieValidationAdmin, (req, res, next) => mostViewedGenre(req, res, genreService))

export default router;
