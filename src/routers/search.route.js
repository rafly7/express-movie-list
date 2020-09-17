const {Router} = require('express')
const MovieService = require('../services/movie.service')
const GenreService = require('../services/genre.service')
const {
  mostViewedGenre,
  mostViewedMovie,
  findWithQuery,
  mostVotedMovie
} = require('../controllers/search')
const Genre = require('../models/genre')
const {cookieValidationAdmin} = require('../middlewares/cookie-validation')
const connection = require('../../configs/db.connect')
const Movie = require('../models/movie')
const Artist = require('../models/artist')
const tokenValidation = require('../middlewares/token-validation')

const movieService = new MovieService({
  connection: connection,
  movie: Movie,
  genre: Genre,
  artist: Artist
})
const genreService = new GenreService(connection)
const router = Router();

router.get('/', (req, res, next) => findWithQuery(req,res, movieService))
router.use(tokenValidation)
router.get('/most-voted-movie',cookieValidationAdmin, (req, res, next) => mostVotedMovie(req, res, movieService))
router.get('/most-viewed-movie',cookieValidationAdmin, (req, res, next) => mostViewedMovie(req, res, movieService))
router.get('/most-viewed-genre',cookieValidationAdmin, (req, res, next) => mostViewedGenre(req, res, genreService))

module.exports = router;
