const Sequelize = require('sequelize')
const connection = require('../../configs/db.connect')

const Movie = connection.define('movie', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    allowNull: false,
    primaryKey: true
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  duration: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  vote_count: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  watch_url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  viewer: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  file_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  artists: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: false
  },
  genres: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: false
  }
}, {
  freezeTableName: true,
  tableName: 'movie',
  paranoid: true
})

module.exports = Movie