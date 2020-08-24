const Sequelize = require('sequelize')
const connection = require('../../configs/db.connect')
const Movie = require('./movie')

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

module.exports = Viewer