import Sequelize from 'sequelize'
import connection from '../../configs/db.connect'

const Permission = connection.define('permission', {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  }
}, {
  freezeTableName: true,
  tableName: 'permission',
  paranoid: true
})

export default Permission;