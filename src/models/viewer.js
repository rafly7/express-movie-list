import Sequelize from 'sequelize'
import connection from '../../configs/db.connect'
import User from './user'
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
  // user_id: {
  //   type: Sequelize.UUID,
  //   allowNull: false,
  //   references: {
  //     model: User,
  //     key: 'id'
  //   }
  // },
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