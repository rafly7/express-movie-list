import logEvent from '../events/myEmitter'
import connection from '../../configs/db.connect';
import Sequelize from 'sequelize';
import Genre from '../models/genre';
import Artist from '../models/artist';
import { MovieVoteUser } from '../models/movie_vote_user';
import User from '../models/user';

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
  async mostViewedMovie() {
    try {
      const [results] = await connection.query('SELECT * FROM public.movie WHERE viewer = (SELECT  MAX(viewer) FROM public.movie)')
      return results[0]
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-MOST-VIEWED-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
    }
  }

  async getMovieWithPagination(page) {
    try {
      let limit = 5
      let offset = 0
      let result = await this.Movie.findAndCountAll()
        .then((data) => {
          let pages = Math.ceil(data.count / limit)
          offset = limit * (page - 1)
          return Promise.resolve({dataCount: data.count,pages: pages ,newOffset: offset})
        })
      const {dataCount, pages, newOffset} = result
      result = await this.Movie.findAll({
        limit: limit,
        offset: newOffset
      }).then(movies => {
          return Promise.resolve(movies)
        }
      )
      return {current_page: parseInt(page), total_results: dataCount, total_pages: pages, results: result}
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-PAGINATION-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
    }
  }

  async findMovieWithTitle(title) {
    try {
      const result = await this.Movie.findAll({
        where: {
          title: {
            [Sequelize.Op.iLike]: `%${title}%`
          }
        }
      })
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-TITLE-SERVICE-FAILED',
        logMessage: e
      })
    }
  }

  async findMovieWithDescription(description) {
    try {
      const result = await this.Movie.findAll({
        where: {
          description: {
            [Sequelize.Op.iLike]: `%${description}%`
          }
        }
      })
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-DESCRIPTION-SERVICE-FAILED',
        logMessage: e
      })
    }
  }

  async findMovieWithArtists(artist) {
    try {
      const {dataValues: {id}} = await Artist.findOne({
        where: {
          name: {
            [Sequelize.Op.iLike]: artist
          }
        }
      })
      const result = await this.Movie.findAll({
        where: {
          artists: {
            [Sequelize.Op.contains]: [id]
          }
        }
      })
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-ARTISTS-SERVICE-FAILED',
        logMessage: e
      })
    }
  }

  async findMovieWithGenres(genre) {
    try {
      const {dataValues: {id}} = await Genre.findOne({
        where: {
          name: {
            [Sequelize.Op.iLike]: genre
          }
        }
      })
      const result = await this.Movie.findAll({
        where: {
          genres: {
            [Sequelize.Op.contains]: [id]
          }
        }
      })
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-GENRES-SERVICE-FAILED',
        logMessage: e
      })
    }
  }

  async voteMovie(movie_id, user_id) {
    try {
      const result = await MovieVoteUser.create({
        movie_id: movie_id,
        user_id: user_id
      })
      if(result) {
        const updateMovie = await this.Movie.findByPk(movie_id)
        updateMovie.vote_count = updateMovie.vote_count+1
        updateMovie.save()
        return updateMovie
      }
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'VOTED-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async unvoteMovie(movieId, userId) {
    try {
      const result = connection.transaction(async (t) => {
        const {dataValues: {movie_id}} = await MovieVoteUser.findOne({
          attributes: ['movie_id'],
          where: {
            [Sequelize.Op.and]: [
              {movie_id: movieId},
              {user_id: userId}
            ]
          },
          transaction: t
        })
        const {dataValues: {vote_count}} = await this.Movie.findOne({
          where: {
            id: movie_id
          },
          transaction: t
        })
        await this.Movie.update({vote_count: vote_count-1},{
          where: {
            id: movie_id
          },
          transaction: t
        })
        await MovieVoteUser.destroy({
          where: {
            [Sequelize.Op.and]: [
              {movie_id: movieId},
              {user_id: userId}
            ]
          },
          transaction: t
        })
        return await this.Movie.findOne({
          where: {
            id: movie_id
          },
          transaction: t
        })
      })
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'UNVOTED-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async listAllUserVote(userId) {
    try {
      let result = await MovieVoteUser.findAll({
        attributes: ['movie_id'],
        where: {
          user_id: userId
        },
        raw: true
      }).then(data => {
        return data.map(movie => movie.movie_id)
      })
      result = await this.Movie.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: result
          }
        },
        raw: true
      })
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'LIST-ALL-VOTED-USER-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }
}



const convertArrayString = data => {
  return data.toString().split(',').map(Number)
}

export default MovieService