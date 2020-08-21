import {Router} from 'express'
import MovieService from '../services/movie.service'
import {
  addMovie,
  updateMovie,
  getAllMovieWithPagination,
  voteMovie,
  unvoteMovie,
  listAllUserVote,
  viewMovieById
} from '../controllers/movie'
import Movie from '../models/movie'
import {cookieValidationAdmin, cookieValidationUser} from '../middlewares/cookie-validation'

const movieService = new MovieService(Movie)
const router = Router();

router.get('/view/:id', (req, res, next) => viewMovieById(req, res, movieService))
router.get('/page/:page', (req, res, next) => getAllMovieWithPagination(req, res, movieService))

router.get('/list-all-user-vote',cookieValidationUser, (req, res, next) => listAllUserVote(req, res, movieService)) // list all vote 
router.get('/unvote/:id',cookieValidationUser, (req, res, next) => unvoteMovie(req, res, movieService))
router.get('/vote/:id', cookieValidationUser, (req, res, next) => voteMovie(req, res, movieService))

router.put('/',cookieValidationAdmin, (req, res, next) => updateMovie(req, res, movieService))
router.post('/',cookieValidationAdmin, (req, res, next) => addMovie(req, res, movieService))

export default router;
