import InfoFullMovie from './info-full-movie'
import Movie from './movie'
import Artist from './artist'
import Genre from './genre'
const dbAssociation = function () {
  InfoFullMovie.belongsTo(Movie)
  Movie.hasMany(InfoFullMovie)

  InfoFullMovie.belongsTo(Artist)
  Artist.hasMany(InfoFullMovie)

  InfoFullMovie.belongsTo(Genre)
  Genre.hasMany(InfoFullMovie)
}

export default dbAssociation