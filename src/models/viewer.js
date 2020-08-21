import Sequelize from 'sequelize'
import connection from '../../configs/db.connect'
import Movie from './movie'

const Viewer = connection.define('viewer', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  movie_id: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
      model: Movie,
      key: 'id'
    }
  },
  createAt:{
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
  }
}, {
  freezeTableName: true,
  tableName: 'viewer',
  paranoid: true,
  timestamps: false
})

export default Viewer