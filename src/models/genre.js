const Sequelize = require('sequelize')
const connection = require('../../configs/db.connect')

const Genre = connection.define('genre', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  tableName: 'genre',
  paranoid: true
})

module.exports = Genre