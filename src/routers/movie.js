const {Router} = require('express')
const MovieService = require('../services/movie')
const {
  addMovie,
  updateMovie,
  voteMovie,
  unvoteMovie,
  listAllUserVote,
  viewMovieById
} = require('../controllers/movie')
const Movie = require('../models/movie')
const Artist = require('../models/artist')
const Genre = require('../models/genre')
const Viewer = require('../models/viewer')
const connection = require('../../configs/db.connect')
const {MovieVoteUser} = require('../models/movie_vote_user')
const {cookieValidationAdmin, cookieValidationUser} = require('../middlewares/cookie-validation')
const tokenValidation = require('../middlewares/token-validation')
const {catchAsync} = require('../middlewares/error')

const movieService = new MovieService({
  movie: Movie,
  artist: Artist,
  genre: Genre,
  viewer: Viewer,
  movie_vote_user: MovieVoteUser,
  connection: connection
})
const router = Router();

router.get('/view/:id', catchAsync((req, res) => viewMovieById(req, res, movieService)))

// middleware check if token is exists
router.use(tokenValidation)
router.get('/list-all-user-vote',cookieValidationUser, (req, res, next) => listAllUserVote(req, res, movieService)) // list all vote 
router.delete('/unvote/:id',cookieValidationUser, (req, res, next) => unvoteMovie(req, res, movieService))
router.post('/vote/:id', cookieValidationUser, (req, res, next) => voteMovie(req, res, movieService))
router.put('/',cookieValidationAdmin, (req, res, next) => updateMovie(req, res, movieService))
router.post('/',cookieValidationAdmin, (req, res) => addMovie(req, res, movieService))

module.exports = router;
