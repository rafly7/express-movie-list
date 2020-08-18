import Sequelize from 'sequelize'
import connection from '../../configs/db.connect'

const Artist = connection.define('artist', {
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
  tableName: 'artist',
  paranoid: true
})

export default Artist;