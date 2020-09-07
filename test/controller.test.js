const MovieService = require('../src/services/movie.service')
const {
  getAllMovieWithPagination,
  listAllUserVote,
  unvoteMovie,
  viewMovieById,
  voteMovie} = require('../src/controllers/movie')
const Movie = require('../src/models/movie')
const AuthService = require('../src/services/auth.service')
const Admin = require('../src/models/admin')
const {
  authAdmin,
  authUser,
  authAllLogout,
  registerUser
} = require('../src/controllers/auth')
const User = require('../src/models/user')
const connection = require('../configs/db.connect')
const Genre = require('../src/models/genre')
const Artist = require('../src/models/artist')
const GenreService = require('../src/services/genre.service')
const { mostViewedMovie, mostViewedGenre, mostVotedMovie, findWithQuery } = require('../src/controllers/search')

let movieService
let authUserService
let authAdminService
let genreService

function response(statusCode) {
  return {
    send: jest.fn(),
    json: jest.fn(),
    status: function(responseStatus) {
      expect(responseStatus).toEqual(statusCode)
      return this
    }
  }
}

describe('Controller testting', () => {
  beforeAll(() => {
    movieService = new MovieService({
      movie: Movie,
      connection: connection,
      genre: Genre,
      artist: Artist
    })
    genreService = new GenreService(connection)
    authUserService = new AuthService(User)
    authAdminService = new AuthService(Admin)
  })

  describe('Movie Controller', () => {
    it('Should response 200 when call getAllMovieWithPagination', async () => {
      const req = {params: {page: '1'}}
      const res = response(200)
      const data = {id: '1'}
      movieService.getAllMovieWithPagination = jest.fn(() => {
        return data
      })
      await getAllMovieWithPagination(req, res, movieService)
      expect(movieService.getAllMovieWithPagination).toBeCalledWith('1')
      expect(movieService.getAllMovieWithPagination).toBeCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 500 when call getAllMovieWithPagination failed', async () => {
      const req = {params: {page: '1'}}
      movieService.getAllMovieWithPagination = jest.fn(() => {
        throw new Error
      })
      const res = response(500)
      await getAllMovieWithPagination(req, res, movieService)
      expect(movieService.getAllMovieWithPagination).toBeCalledWith('1')
      expect(movieService.getAllMovieWithPagination).toBeCalledTimes(1)
      expect(res.send).toHaveBeenCalledWith('Something went wrong')
      expect(res.send).toBeCalledTimes(1)
    })

    it('Should response 200 when call voteMovie', async () => {
      const req = {params: {id: '1'}, session: {userId: '1'}}
      const data = {id: '1'}
      movieService.voteMovie = jest.fn(() => {
        return data
      })
      const res = response(200)
      await voteMovie(req, res, movieService)
      expect(movieService.voteMovie).toBeCalledWith('1','1')
      expect(movieService.voteMovie).toBeCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 500 when call voteMovie failed', async () => {
      const req = {params: {id: '1'}, session: {userId: '1'}}
      movieService.voteMovie = jest.fn(() => {
        throw new Error
      })
      const res = response(400)
      await voteMovie(req, res, movieService)
      expect(movieService.voteMovie).toBeCalledWith('1','1')
      expect(movieService.voteMovie).toBeCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({message: 'You already voted this movie'})
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 200 when call unvoteMovie', async () => {
      const req = {params: {id: '1'}, session: {userId: '1'}}
      const data = {id: '1'}
      movieService.unvoteMovie = jest.fn(() => {
        return data
      })
      const res = response(200)
      await unvoteMovie(req, res, movieService)
      expect(movieService.unvoteMovie).toBeCalledWith('1','1')
      expect(movieService.unvoteMovie).toBeCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 400 when call unvoteMovie failed', async () => {
      const req = {params: {id: '1'}, session: {userId: '1'}}
      movieService.unvoteMovie = jest.fn(() => {
        throw new Error
      })
      const res = response(400)
      await unvoteMovie(req, res, movieService)
      expect(movieService.unvoteMovie).toBeCalledWith('1','1')
      expect(movieService.unvoteMovie).toBeCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith({message: 'Cannot unvoted movie before your voted'})
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 200 when call listAllUserVote', async () => {
      const req = {session: {userId: '1'}}
      const data = {id: '1'}
      movieService.listAllUserVote = jest.fn(() => {
        return data
      })
      const res = response(200)
      await listAllUserVote(req, res, movieService)
      expect(movieService.listAllUserVote).toBeCalledWith('1')
      expect(movieService.listAllUserVote).toBeCalledTimes(1)
      expect(res.json).toHaveBeenCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 400 when call listAllUserVote failed', async () => {
      const req = {session: {userId: '1'}}
      movieService.listAllUserVote = jest.fn(() => {
        throw new Error
      })
      const res = response(400)
      await listAllUserVote(req, res, movieService)
      expect(movieService.listAllUserVote).toBeCalledWith('1')
      expect(movieService.listAllUserVote).toBeCalledTimes(1)
      expect(res.send).toBeCalledWith('Something went wrong')
      expect(res.send).toBeCalledTimes(1)
    })

    it('Should response 200 when call viewMovieById', async () => {
      const req = {params: {id: '1'}}
      const data = {id: '1'}
      movieService.viewMovieById = jest.fn(() => {
        return data
      })
      const res = response(200)
      await viewMovieById(req, res, movieService)
      expect(movieService.viewMovieById).toBeCalledWith('1')
      expect(movieService.viewMovieById).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 400 when call viewMovieById failed', async () => {
      const req = {params: {id: '1'}}
      movieService.viewMovieById = jest.fn(() => {
        throw new Error
      })
      const res = response(400)
      await viewMovieById(req, res, movieService)
      expect(movieService.viewMovieById).toBeCalledWith('1')
      expect(movieService.viewMovieById).toBeCalledTimes(1)
      expect(res.send).toBeCalledWith('Something went wrong')
      expect(res.send).toBeCalledTimes(1)
    })
  })

  describe('Auth controller', () => {
    it('Should response 200 when call authAdmin', async () => {
      const data = {email: '1', password: '1'}
      const req = {
        body: data,
        session: {}
      }
      const res = response(200)
      authAdminService.authAdmin = jest.fn(() => {
        return '1'
      })
      await authAdmin(req, res, authAdminService)
      expect(authAdminService.authAdmin).toBeCalledWith(data)
      expect(authAdminService.authAdmin).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith({message: 'Success authenticate as admin'})
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should reponse 400 when call authAdmin failed', async () => {
      const data = {email: '1', password: '1'}
      const req = {
        body: data,
        session: {}
      }
      const res = response(400)
      authAdminService.authAdmin = jest.fn(() => {
        throw new Error
      })
      await authAdmin(req, res, authAdminService)
      expect(authAdminService.authAdmin).toBeCalledWith(data)
      expect(authAdminService.authAdmin).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith({message: 'Incorrect email or password'})
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 200 when call authUser', async () => {
      const data = {email: '1', password: '1'}
      const req = {
        body: data,
        session: {}
      }
      const res = response(200)
      authUserService.authUser = jest.fn(() => {
        return '1'
      })
      await authUser(req, res, authUserService)
      expect(authUserService.authUser).toBeCalledWith(data)
      expect(authUserService.authUser).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith({message: 'Success authenticate as user'})
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should reponse 400 when call authUser failed', async () => {
      const data = {email: '1', password: '1'}
      const req = {
        body: data,
        session: {}
      }
      const res = response(400)
      authUserService.authUser = jest.fn(() => {
        throw new Error
      })
      await authUser(req, res, authUserService)
      expect(authUserService.authUser).toBeCalledWith(data)
      expect(authUserService.authUser).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith({message: 'Incorrect email or password'})
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 200 when call registerUser', async () => {
      const data = {email: '1', password: '1'}
      const req = {
        body: data,
      }
      const res = response(200)
      authUserService.registerUser = jest.fn(() => {
        return data
      })
      await registerUser(req, res, authUserService)
      expect(authUserService.registerUser).toBeCalledWith(data)
      expect(authUserService.registerUser).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 400 when call registerUser failed', async () => {
      const data = {email: '1', password: '1'}
      const req = {
        body: data,
      }
      const res = response(400)
      authUserService.registerUser = jest.fn(() => {
        throw new Error
      })
      await registerUser(req, res, authUserService)
      expect(authUserService.registerUser).toBeCalledWith(data)
      expect(authUserService.registerUser).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith({message: 'Register failed'})
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 200 when call authAllLogout', async () => {
      const req = {
        session: function(){}
      }
      const res = response(200)
      req.session.destroy = jest.fn((fn) => fn(false))
      res.clearCookie = jest.fn()
      await authAllLogout(req, res)
      expect(req.session.destroy).toBeCalledTimes(1)
      expect(res.clearCookie).toBeCalledTimes(1)
      expect(res.clearCookie).toBeCalledWith(process.env.SESSION_NAME)
      expect(res.json).toBeCalledWith({message: 'success logout'})
      expect(res.json).toBeCalledTimes(1)
    })
  })
  
  describe('Search Controller', () => {
    it('Should response 200 when call mostViewedMovie', async () => {
      const data = {id: '1'}
      const req = {}
      const res = response(200)
      movieService.mostViewedMovie = jest.fn(() => {
        return data
      })
      await mostViewedMovie(req, res, movieService)
      expect(movieService.mostViewedMovie).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 500 when call mostViewedMovie failed', async () => {
      const req = {}
      const res = response(500)
      movieService.mostViewedMovie = jest.fn(() => {
        throw new Error
      })
      await mostViewedMovie(req, res, movieService)
      expect(movieService.mostViewedMovie).toBeCalledTimes(1)
      expect(res.send).toBeCalledWith('Something went wrong')
      expect(res.send).toBeCalledTimes(1)
    })

    it('Should response 200 when call mostViewedGenre', async () => {
      const data = {id: '1'}
      const req = {}
      const res = response(200)
      genreService.mostViewedGenre = jest.fn(() => {
        return data
      })
      await mostViewedGenre(req, res, genreService)
      expect(genreService.mostViewedGenre).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 500 when call mostViewedGenre failed', async () => {
      const req = {}
      const res = response(500)
      genreService.mostViewedGenre = jest.fn(() => {
        throw new Error
      })
      await mostViewedGenre(req, res, genreService)
      expect(genreService.mostViewedGenre).toBeCalledTimes(1)
      expect(res.send).toBeCalledWith('Something went wrong')
      expect(res.send).toBeCalledTimes(1)
    })

    it('Should response 200 when call mostVotedMovie', async () => {
      const data = {id: '1'}
      const req = {}
      const res = response(200)
      movieService.mostVotedMovie = jest.fn(() => {
        return data
      })
      await mostVotedMovie(req, res, movieService)
      expect(movieService.mostVotedMovie).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith(data)
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 500 when call mostVotedMovie failed', async () => {
      const req = {}
      const res = response(500)
      movieService.mostVotedMovie = jest.fn(() => {
        throw new Error
      })
      await mostVotedMovie(req, res, movieService)
      expect(movieService.mostVotedMovie).toBeCalledTimes(1)
      expect(res.send).toBeCalledWith('Something went wrong')
      expect(res.send).toBeCalledTimes(1)
    })

    it('Should response 200 when call findWithQuery by title', async () => {
      const req = {query: {title: 'test'}}
      const res = response(200)
      movieService.findMovieWithTitle = jest.fn(() => {
        return [{id: '1'}]
      })
      await findWithQuery(req, res, movieService)
      expect(movieService.findMovieWithTitle).toBeCalledWith('test')
      expect(movieService.findMovieWithTitle).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith([{id: '1'}])
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 200 when call findWithQuery by description', async () => {
      const req = {query: {description: 'test'}}
      const res = response(200)
      movieService.findMovieWithDescription = jest.fn(() => {
        return [{id: '1'}]
      })
      await findWithQuery(req, res, movieService)
      expect(movieService.findMovieWithDescription).toBeCalledWith('test')
      expect(movieService.findMovieWithDescription).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith([{id: '1'}])
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 200 when call findWithQuery by artists', async () => {
      const req = {query: {artists: 'test'}}
      const res = response(200)
      movieService.findMovieWithArtists = jest.fn(() => {
        return [{id: '1'}]
      })
      await findWithQuery(req, res, movieService)
      expect(movieService.findMovieWithArtists).toBeCalledWith('test')
      expect(movieService.findMovieWithArtists).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith([{id: '1'}])
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 200 when call findWithQuery by genres', async () => {
      const req = {query: {genres: 'test'}}
      const res = response(200)
      movieService.findMovieWithGenres = jest.fn(() => {
        return [{id: '1'}]
      })
      await findWithQuery(req, res, movieService)
      expect(movieService.findMovieWithGenres).toBeCalledWith('test')
      expect(movieService.findMovieWithGenres).toBeCalledTimes(1)
      expect(res.json).toBeCalledWith([{id: '1'}])
      expect(res.json).toBeCalledTimes(1)
    })

    it('Should response 400 when call findWithQuey with wrong query', async () => {
      const req = {query: {test: 'test'}}
      const res = response(400)
      await findWithQuery(req, res, movieService)
      expect(res.send).toBeCalledWith('Wrong query')
      expect(res.send).toBeCalledTimes(1)
    })

    it('Should response 400 when call findWithQuey failed', async () => {
      const req = undefined
      const res = response(400)
      await findWithQuery(req, res)
      expect(res.send).toBeCalledWith('Something went wrong')
      expect(res.send).toBeCalledTimes(1)
    })
  })
})
