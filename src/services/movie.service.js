import logEvent from '../events/myEmitter'

class MovieService {
  constructor(Movie) {
    this.Movie = Movie;
  }

  async addMovie(resultUpload, body) {
    let result;
    try {
      const {result_url, uuid} = resultUpload
      body.watch_url = result_url
      body.file_name = uuid
      body.artists = convertArrayString(body.artists)
      body.genres = convertArrayString(body.genres)
      result = await this.Movie.create(body)
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'CREATE-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
    }
    return result
  }
}

const convertArrayString = data => {
  return data.toString().split(',').map(Number)
}

export default MovieService