const mostViewedMovie = async (req, res, service) => {
  try {
    const mostViewedMovie = await service.mostViewedMovie()
    res.status(200).json(mostViewedMovie)
  } catch (e) {
    res.status(500).send('Something went wrong')
  }
}

const mostViewedGenre = async (req, res, service) => {
  try {
    const mostViewedGenre = await service.mostViewedGenre()
    res.status(200).json(mostViewedGenre)
  } catch (e) {
    res.status(500).send('Something went wrong')
  }
}

const mostVotedMovie = async (req, res, service) => {
  try {
    const mostVotedMovie = await service.mostVotedMovie()
    res.status(200).json(mostVotedMovie)
  } catch (e) {
    res.status(500).send('Something went wrong')
  }
}

const findWithQuery = async (req, res, service) => {
  try {
    if(req.query.title) {
      const title = req.query.title
      const movieWithTitle = await service.findMovieWithTitle(title)
      res.status(200).json(movieWithTitle)
    } else if(req.query.description) {
      const description = req.query.description
      const movieWithDescription = await service.findMovieWithDescription(description)
      res.status(200).json(movieWithDescription)
    } else if(req.query.artists) {
      const artist = req.query.artists
      const movieWithArtists = await service.findMovieWithArtists(artist)
      res.status(200).json(movieWithArtists)
    } else if(req.query.genres) {
      const genre = req.query.genres
      const movieWithGenres = await service.findMovieWithGenres(genre)
      res.status(200).json(movieWithGenres)
    }
    res.status(400).send('Something went wrong')
  } catch (e) {
    res.status(400).send('Something went wrong')
  }
}

module.exports = {
  mostViewedGenre,
  mostViewedMovie,
  findWithQuery,
  mostVotedMovie
}