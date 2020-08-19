import Sequelize from 'sequelize'
import connection from '../../configs/db.connect'

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
  },
  viewer: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  }
}, {
  freezeTableName: true,
  tableName: 'genre',
  paranoid: true
})

export default Genre;