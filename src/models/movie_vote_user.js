import Movie from './movie'
import User from './user'
import connection from '../../configs/db.connect'

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
export {MovieVoteUser , dbAssociation};