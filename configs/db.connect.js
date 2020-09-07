const Sequelize = require('sequelize')
const {config} = require('dotenv')

config();

const connectionDb = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS, {
    dialect: process.env.DB_TYPE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT
  }
)
const fakeDb = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
})
const connection = process.env.NODE_ENV === 'test' ? fakeDb : connectionDb

module.exports = connection