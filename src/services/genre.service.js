import logEvent from '../events/myEmitter'
import connection from '../../configs/db.connect';
import Sequelize from 'sequelize';

class GenreService {
  constructor(genre) {
    this.genre = genre;
  }

  async mostViewedGenre() {
    try {
      const [results] = await connection.query('SELECT * FROM public.genre WHERE viewer = (SELECT  MAX(viewer) FROM public.genre)')
      return results[0]
    } catch (e) {
      logEvent.emit('APP-ERROR', {
        logTitle: 'GET-MOST-VIEWED-MOVIE-SERVICE-FAILED',
        logMessage: e
      })
    }
  }
}

export default GenreService