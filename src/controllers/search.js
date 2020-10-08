const {InternalServer} = require('../errors')
const client = require('redis').createClient()

const mostViewedMovie = async (req, res, service) => {
  try {
    const mostViewedMovie = await service.mostViewedMovie()
    res.status(200).json(mostViewedMovie)
  } catch {
    throw new InternalServer('Something went wrong')
  }
}

const mostViewedGenre = async (req, res, service) => {
  try {
    const mostViewedGenre = await service.mostViewedGenre()
    res.status(200).json(mostViewedGenre)
  } catch {
    throw new InternalServer('Something went wrong')
  }
}

const mostVotedMovie = async (req, res, service) => {
  try {
    const mostVotedMovie = await service.mostVotedMovie()
    res.status(200).json(mostVotedMovie)
  } catch {
    throw new InternalServer('Something went wrong')
  }
}

const findWithQuery = async (req, res, service) => {
  try {
    const page = Number(req.query.page)
    if(page && req.query.title) {
      const title = req.query.title
      const movieWithTitle = await service.findMovieWithTitle(page, title)
      res.status(200).json(movieWithTitle)
    } else if(page && req.query.description) {
      const description = req.query.description
      const movieWithDescription = await service.findMovieWithDescription(page, description)
      res.status(200).json(movieWithDescription)
    } else if(page && req.query.artist) {
      const artist = req.query.artist
      const movieWithArtist = await service.findMovieWithArtist(page, artist)
      res.status(200).json(movieWithArtist)
    } else if(page && req.query.genre) {
      const genre = req.query.genre
      const movieWithGenre = await service.findMovieWithGenre(page, genre)
      res.status(200).json(movieWithGenre)
    } else if(
      page &&
      req.query.primary_release_date_start &&
      req.query.primary_release_date_end &&
      req.query.sort_by === 'asc' || req.query.sort_by === 'desc' ? req.query.sort_by : undefined
    ) {
      const data = {
        sort_by: req.query.sort_by === 'asc' || req.query.sort_by === 'desc' ? req.query.sort_by : undefined,
        start: req.query.primary_release_date_start,
        end: req.query.primary_release_date_end,
        page
      }
      const latest_movie = await service.movieWithRangeDate(data)
      res.status(200).json(latest_movie)
    } else if(page && Boolean(req.query.genres) == true) {
      const data = req.body
      const getMovieGenres = await service.findMovieWithGenre_s(page, data)
      res.status(200).json(getMovieGenres)
    } else if(page) {
      client.get(page, async function(err, data) {
        if(err) throw err
        if(data !== null) {
          res.status(200).json(JSON.parse(data))
        } else {
          const result = await service.getAllMovieWithPagination(page)
          client.setex(page, 1800, JSON.stringify(result))
          res.status(200).json(result)
        }
      })
    } else {
      res.status(400).json({message: 'Wrong query'})
    }
  } catch {
    throw new InternalServer('Something went wrong')
  }
}

module.exports = {
  mostViewedGenre,
  mostViewedMovie,
  findWithQuery,
  mostVotedMovie
}