import express from 'express'
import MovieService from '../services/movie.service'
import {
  addMovie,
  updateMovie,
  getMovieWithPagination,
  voteMovie,
  unvoteMovie,
  listAllUserVote
} from '../controllers/movie'
import Movie from '../models/movie'
import {cookieValidationAdmin, cookieValidationUser} from '../middlewares/cookie-validation'

const movieService = new MovieService(Movie)
const router = express.Router();

router.get('/list-all-user-vote',cookieValidationUser, (req, res, next) => listAllUserVote(req, res, movieService)) // list all vote 
router.get('/unvote/:id',cookieValidationUser, (req, res, next) => unvoteMovie(req, res, movieService))
router.get('/vote/:id', cookieValidationUser, (req, res, next) => voteMovie(req, res, movieService))
router.get('/:page',cookieValidationUser, (req, res, next) => getMovieWithPagination(req, res, movieService))
router.put('/',cookieValidationAdmin, (req, res, next) => updateMovie(req, res, movieService))
router.post('/',cookieValidationAdmin, (req, res, next) => addMovie(req, res, movieService))

export default router;
