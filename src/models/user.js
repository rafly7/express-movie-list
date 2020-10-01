const Sequelize = require('sequelize')
const connection = require('../../configs/db.connect')

const User = connection.define('user', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV1,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  // resetPasswordToken: {
  //   type: Sequelize.STRING,
  //   allowNull: true
  // },

}, {
  freezeTableName: true,
  tableName: 'user',
  paranoid: true
})

module.exports = User