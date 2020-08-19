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

  async updateMovie(body) {
    let result;
    try {
      result = await this.Movie.findByPk(body.id)
      result.title = body.title === undefined ? result.title : body.title
      result.description = body.description === undefined ? result.description : body.description
      result.duration = body.duration === undefined ? result.duration : body.duration
      result.watch_url = body.watch_url === undefined ? result.watch_url : body.watch_url
      result.file_name = body.file_name === undefined ? result.file_name : body.file_name
      result.artists = body.artists === undefined ? result.artists : convertArrayString(body.artists)
      result.genres = body.genres === undefined ? result.genres : convertArrayString(body.genres)
      result.save()
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'UPDATE-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
    }
    return result
  }

  async getOldFileName(body) {
    let result;
    try {
      result = await this.Movie.findByPk(body.id)
      result = result.dataValues.file_name
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-OLD-FILENAME-MOVIE-SERVICE-FAILED',
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