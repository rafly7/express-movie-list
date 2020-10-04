const {BadRequest, InternalServer} = require('../errors')

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
    if(req.query.page) {
      const page = Number(req.query.page)
      if(req.query.title) {
        const title = req.query.title
        const movieWithTitle = await service.findMovieWithTitle(page, title)
        res.status(200).json(movieWithTitle)
      } else if(req.query.description) {
        const description = req.query.description
        const movieWithDescription = await service.findMovieWithDescription(page, description)
        res.status(200).json(movieWithDescription)
      } else if(req.query.artist) {
        const artist = req.query.artist
        const movieWithArtists = await service.findMovieWithArtists(page, artist)
        res.status(200).json(movieWithArtists)
      } else if(req.query.genre) {
        const genre = req.query.genre
        const movieWithGenres = await service.findMovieWithGenres(page, genre)
        res.status(200).json(movieWithGenres)
      } else {
        res.status(400).json({message: 'Wrong query'})
      }
    } else {
      res.status(400).json({message: 'Wrong query'})
    }
  } catch {
    throw new BadRequest('Something went wrong')
  }
}

module.exports = {
  mostViewedGenre,
  mostViewedMovie,
  findWithQuery,
  mostVotedMovie
}

// 02129808470