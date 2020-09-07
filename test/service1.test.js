const Movie = require("../src/models/movie")
const { MovieVoteUser } = require("../src/models/movie_vote_user")
const connection = require("../configs/db.connect")
const MovieService = require("../src/services/movie.service")


describe('MovieService testing isolation', () => {
  let movie_vote_user, movie, movieService, connectiondb
  beforeAll(() => {
    movie = new Movie()
    movie_vote_user = new MovieVoteUser()
    connectiondb = connection
    movieService = new MovieService({
      movie: movie,
      movie_vote_user: movie_vote_user,
      connection: connectiondb
    })
  })

  afterAll(async (done) => {
    await connectiondb.close()
    done()
  })

  it('Should call unvoteMovie', async () => {
    const data = {id: '1'}
    movie_vote_user.findOne = jest.fn(() => {
      return {movie_id: '1'}
    })
    movie.findOne = jest.fn().mockResolvedValue({vote_count: 1})
    movie.update = jest.fn()
    movie_vote_user.destroy = jest.fn()
    movie.findOne = jest.fn().mockResolvedValue(data)
    const result = await movieService.unvoteMovie('1','1')
    expect(movie_vote_user.findOne).toBeCalledTimes(1)
    expect(movie_vote_user.findOne).toHaveReturnedWith({movie_id: '1'})
    expect(movie.update).toBeCalledTimes(1)
    expect(movie_vote_user.destroy).toBeCalledTimes(1)
    expect(movie.findOne).toBeCalledTimes(2)
    expect(result).toEqual(data)
  })
})