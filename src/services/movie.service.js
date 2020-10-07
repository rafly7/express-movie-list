const logEvent = require('../events/myEmitter')
const Sequelize = require('sequelize')

class MovieService {
  constructor({
    movie: movie,
    artist: artist,
    genre: genre,
    movie_vote_user: movie_vote_user,
    viewer: viewer,
    connection: connection
  }) {
    this.movie = movie
    this.artist = artist
    this.genre = genre
    this.viewer = viewer
    this.movie_vote_user = movie_vote_user
    this.connection = connection
  }

  async checkArtist(artists) {
    const [result] = await this.connection.query(`
      select array_agg(id) ids from artist HAVING array_agg(id) @> '{${artists.toString()}}'
    `)
    if (result[0] !== undefined) return artists
    throw new Error
  }

  async checkGenre(genres) {
    const [result] = await this.connection.query(`
      select array_agg(id) from genre HAVING array_agg(id) @> '{${genres.toString()}}'
    `)
    if (result[0] !== undefined) return genres
    throw new Error
  }

  async addMovie(resultUpload, duration, body) {
    let result;
    try {
      const artists = await this.checkArtist(body.artists)
      const genres = await this.checkGenre(body.genres)
      const {result_url, uuid} = resultUpload
      body.watch_url = result_url
      body.file_name = uuid
      body.duration = duration
      body.artists = convertArrayString(artists)
      body.genres = convertArrayString(genres)
      result = await this.movie.create(body)
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'CREATE-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
    return result
  }

  async updateMovie(body) {
    let result;
    try {
      result = await this.movie.findByPk(body.id)
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
      throw new Error
    }
    return result
  }

  async getOldFileName(body) {
    let result;
    try {
      result = await this.movie.findByPk(body.id)
      result = result.dataValues.file_name
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-OLD-FILENAME-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
    return result
  }

  async mostViewedMovie() {
    try {
      const [results] = await this.connection.query('SELECT * FROM movie WHERE viewer = (SELECT MAX(viewer) FROM movie)')
      return results[0]
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-MOST-VIEWED-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async mostVotedMovie() {
    try {
      const [result] = await this.connection.query(`
        SELECT * FROM movie WHERE vote_count=(
          SELECT MAX(vote_count) FROM movie
        )
      `)
      return result[0]
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-MOST-VOTED-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async getAllMovieWithPagination(page) {
    try {
      let limit = 5
      let offset = 0
      let result = await this.movie.findAndCountAll()
        .then((data) => {
          let pages = Math.ceil(data.count / limit)
          offset = limit * (page - 1)
          return Promise.resolve({dataCount: data.count,pages: pages ,newOffset: offset})
        })
      const {dataCount, pages, newOffset} = result
      result = await this.movie.findAll({
        limit: limit,
        offset: newOffset
      }).then(data => Promise.resolve(data))
      return {
        current_page: Number(page),
        total_results: dataCount,
        total_pages: pages,
        results: result
      }
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-PAGINATION-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async findMovieWithTitle(page, title) {
    try {
      let limit = 5, offset = 0
      let result = await this.movie.findAndCountAll({
        where: {
          title: {
            [Sequelize.Op.iLike]: `%${title}%`
          }
        }
      })
        .then(data => {
          let pages = Math.ceil(data.count / limit)
          offset = limit * (page - 1)
          return Promise.resolve({dataCount: data.count, pages: pages, newOffset: offset})
        })
      const {dataCount, pages, newOffset} = result
      result = await this.movie.findAll({
        limit: limit,
        offset: newOffset,
        where: {
          title: {
            [Sequelize.Op.iLike]: `%${title}%`
          }
        }
      }).then(data => Promise.resolve(data))
      return {
        current_page: Number(page),
        total_results: dataCount,
        total_pages: pages,
        results: result
      }
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-TITLE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async findMovieWithDescription(page, description) {
    try {
      let limit = 5, offset = 0
      let result = await this.movie.findAndCountAll({
        where: {
          description: {
            [Sequelize.Op.iLike]: `%${description}%`
          }
        }
      })
        .then(data => {
          let pages = Math.ceil(data.count / limit)
          offset = limit * (page - 1)
          return Promise.resolve({dataCount: data.count, pages: pages, newOffset: offset})
        })
      const {dataCount, pages, newOffset} = result
      result = await this.movie.findAll({
        limit: limit,
        offset: newOffset,
        where: {
          description: {
            [Sequelize.Op.iLike]: `%${description}%`
          }
        }
      }).then(data => Promise.resolve(data))
      return {
        current_page: Number(page),
        total_results: dataCount,
        total_pages: pages,
        results: result
      }
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-DESCRIPTION-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async findMovieWithArtist(page, artist) {
    try {
      const {id} = await this.artist.findOne({
        where: {
          name: {
            [Sequelize.Op.iLike]: artist
          }
        },
        attributes: ['id'],
        raw: true
      })
      let limit = 5, offset = 0
      let result = await this.movie.findAndCountAll({
        where: {
          artists: {
            [Sequelize.Op.contains]: [id]
          }
        }
      })
        .then(data => {
          let pages = Math.ceil(data.count / limit)
          offset = limit * (page - 1)
          return Promise.resolve({dataCount: data.count, pages: pages, newOffset: offset})
        })
      const {dataCount, pages, newOffset} = result
      result = await this.movie.findAll({
        limit: limit,
        offset: newOffset,
        where: {
          artists: {
            [Sequelize.Op.contains]: [id] 
          }
        }
      }).then(data => Promise.resolve(data))
      return {
        current_page: Number(page),
        total_results: dataCount,
        total_pages: pages,
        results: result
      }
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-ARTIST-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async findMovieWithGenre(page, genre) {
    try {
      const {id} = await this.genre.findOne({
        where: {
          name: {
            [Sequelize.Op.iLike]: genre
          }
        },
        attributes: ['id'],
        raw: true
      })
      let limit = 5, offset = 0
      let result = await this.movie.findAndCountAll({
        where: {
          genres: {
            [Sequelize.Op.contains]: [id]
          }
        }
      })
        .then(data => {
          let pages = Math.ceil(data.count / limit)
          offset = limit * (page - 1)
          return Promise.resolve({dataCount: data.count, pages: pages, newOffset: offset})
        })
      const {dataCount, pages, newOffset} = result
      result = await this.movie.findAll({
        limit: limit,
        offset: newOffset,
        where: {
          genres: {
            [Sequelize.Op.contains]: [id] 
          }
        }
      }).then(data => Promise.resolve(data))
      return {
        current_page: Number(page),
        total_results: dataCount,
        total_pages: pages,
        results: result
      }
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-GENRE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async voteMovie(movie_id, user_id) {
    try {
      const result = await this.movie_vote_user.create({
        movie_id: movie_id,
        user_id: user_id
      })
      if(result) {
        const updateMovie = await this.movie.findByPk(movie_id)
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
      const result = this.connection.transaction(async (t) => {
        const {movie_id} = await this.movie_vote_user.findOne({
          attributes: ['movie_id'],
          where: {
            [Sequelize.Op.and]: [
              {movie_id: movieId},
              {user_id: userId}
            ]
          },
          raw: true,
          transaction: t
        })
        const {vote_count} = await this.movie.findOne({
          where: {
            id: movie_id
          },
          raw: true,
          transaction: t
        })
        await this.movie.update({vote_count: vote_count-1},{
          where: {
            id: movie_id
          },
          transaction: t
        })
        await this.movie_vote_user.destroy({
          where: {
            [Sequelize.Op.and]: [
              {movie_id: movieId},
              {user_id: userId}
            ]
          },
          transaction: t
        })
        return await this.movie.findOne({
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
      let result = await this.movie_vote_user.findOne({
        attributes: ['movie_id'],
        where: {
          user_id: userId
        },
        raw: true
      })
      result = await this.movie.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: [result.movie_id]
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

  async viewMovieById(movieId) {
    try {
      const result = this.connection.transaction(async (t) => {
        await this.viewer.create({
          movie_id: movieId
        },{transaction: t})
        const {viewer} = await this.movie.findOne({
          attributes: ['viewer'],
          where: {
            id: movieId,
          },
          raw: true,
          transaction: t
        })
        await this.movie.update({viewer: viewer+1},{
          where: {
            id: movieId
          },
          transaction: t
        })
        return await this.movie.findOne({
          where: {
            id: movieId
          },
          transaction: t
        })
      })
      return result
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'VIEW-MOVIE-BY-ID-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async movieWithRangeDate(dataObj) {
    try {
      let limit = 5, offset = 0
      let resultObj = await this.connection.query(`
        SELECT DATE("createdAt") AS dates, title, description, duration, vote_count, watch_url, viewer, artists, genres FROM movie
        WHERE DATE("createdAt") BETWEEN SYMMETRIC '${dataObj.start}' AND '${dataObj.end}' ORDER BY dates ${dataObj.sort_by};
      `).then(data => {
        const [result] = data
        let pages = Math.ceil(result.length / limit)
        offset = limit * (Number(dataObj.page) - 1)
        return Promise.resolve({dataCount: result.length, pages: pages, newOffset: offset})
      })
      const {dataCount, pages, newOffset} = resultObj
      const [result] = await this.connection.query(`
        SELECT DATE("createdAt") AS dates, title, description, duration, vote_count, watch_url, viewer, artists, genres FROM movie
        WHERE DATE("createdAt") BETWEEN SYMMETRIC '${dataObj.start}' AND '${dataObj.end}' ORDER BY dates ${dataObj.sort_by} LIMIT ${limit} OFFSET ${newOffset};
      `)
      return {
        current_page: Number(dataObj.page),
        total_results: dataCount,
        total_pages: pages,
        results: result
      }
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'MOVIE-WITH-RANGE-DATE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }

  async findMovieWithGenre_s(page, body) {
    try {
      // let limit = 5, offset = 0
      // let result = await this.movie.findAndCountAll({
      //   where: {
      //     genres: {
      //       [Sequelize.Op.contains]: body.artists
      //     }
      //   }
      // })
      //   .then(data => {
      //     let pages = Math.ceil(data.count / limit)
      //     offset = limit * (page - 1)
      //     return Promise.resolve({
      //       dataCount: data.count,
      //       pages: pages,
      //       newOffset: offset
      //     })
      //   })
      // const {dataCount, pages, newOffset} = result
      // result = await this.movie.findAll({
      //   limit: limit,
      //   offset: newOffset,
      //   where: {
      //     genres: {
      //       [Sequelize.Op.contains]: body.artists
      //     }
      //   }
      // })
      // return {
      //   current_page: Number(page),
      //   total_results: dataCount,
      //   total_pages: pages,
      //   results: result
      // }
      let limit = 5, offset = 0
      let result = await this.movie.findAndCountAll({
        where: {
          genres: {
            [Sequelize.Op.contains]: body.artists
          }
        },
        raw: true
      })
      const {count, rows} = result
      console.log(rows)
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'FIND-MOVIE-WITH-GENRES-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }
}



const convertArrayString = data => {
  return data.toString().split(',').map(Number)
}

module.exports = MovieService