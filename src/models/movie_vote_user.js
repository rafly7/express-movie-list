const connection = require('../../configs/db.connect')
const Movie = require('./movie')
const User = require('./user')

const MovieVoteUser = connection.define('movie_vote_user',{
},{
  freezeTableName: true,
  tableName: 'movie_vote_user',
  paranoid: true,
  timestamps: false
})
const dbAssociation = () => {
  Movie.belongsToMany(User, {through: MovieVoteUser, foreignKey: 'movie_id', as: 'movies'})
  User.belongsToMany(Movie, {through: MovieVoteUser, foreignKey: 'user_id'})
}

module.exports = {
  MovieVoteUser,
  dbAssociation
}