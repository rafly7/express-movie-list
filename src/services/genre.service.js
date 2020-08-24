const logEvent = require('../events/myEmitter')
const connection = require('../../configs/db.connect')

class GenreService {
  constructor(genre) {
    this.genre = genre;
  }

  async mostViewedGenre() {
    try {
      const [results] = await connection.query(`
        select * from genre where id=(
          select genre_id from (
            select sum(viewer) as number_viewer,genre as genre_id from movie, unnest(genres) as genre
            group by genre_id order by number_viewer desc limit 1
          ) as result
        );
      `)
      return results[0]
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-MOST-VIEWED-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
      throw new Error
    }
  }
}

module.exports = GenreService