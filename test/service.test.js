const MovieService = require('../src/services/movie.service')
const Movie = require('../src/models/movie')
const Viewer = require('../src/models/viewer')
const connection = require('../configs/db.connect')
const { MovieVoteUser } = require('../src/models/movie_vote_user')
const GenreService = require('../src/services/genre.service')
const Admin = require('../src/models/admin')
const User = require('../src/models/user')
const AuthService = require('../src/services/auth.service')
const Bcrypt = require('bcryptjs')
const Artist = require('../src/models/artist')
const Genre = require('../src/models/genre')

jest.mock('bcryptjs')

describe('Service Testing', () => {
  describe('Movie Service', () => {
    let resultTransaction
    let movie, viewer, connectiondb, movie_vote_user, artist, genre
    let movieService
    
    beforeEach(() => {
      movie_vote_user = new MovieVoteUser()
      movie = new Movie()
      viewer = new Viewer()
      artist = new Artist()
      genre = new Genre()
      connectiondb = connection
      movieService = new MovieService({
        movie: movie,
        viewer: viewer,
        connection: connectiondb,
        artist: artist,
        genre: genre,
        movie_vote_user: movie_vote_user
      })
    })

    afterEach(async done => {
      await connection.close()
      done()
    })

    it('Should call viewMovieById', async () => {
      viewer.create = jest.fn(() => {
        return {movie_id: 1}
      })
      movie.findOne = jest.fn(() => {
        return {viewer: 0}
      })
      movie.update = jest.fn(() => {
        return {viewer: 1}
      })
      movie.findOne = jest.fn(() => {
        resultTransaction = {movie_id: 1, viewer: 1}
        return resultTransaction
      })
      let result = await movieService.viewMovieById(1)
      expect(viewer.create).toBeCalledTimes(1)
      expect(movie.findOne).toBeCalledTimes(2)
      expect(movie.update).toBeCalledTimes(1)
      expect(result).toEqual({movie_id: 1, viewer: 1})
    })

    it('Should thow error when call viewMovieById', async () => {
      let message
      connectiondb.transaction = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.viewMovieById(1)
      } catch (e) {
        message = e.message
      }
      expect(connectiondb.transaction).toBeCalledTimes(1)
      expect(message).toBe('')
    })

    it('Should call addMovie', async () => {
      let newMovie = {result_url: 'a', uuid: '1'}
      let body = {title: '1', description: '1',artists: [1], genres: [1]}
      movie.create = jest.fn(() => {
        return {id: '1'}
      })
      let result = await movieService.addMovie(newMovie, 1, body)
      expect(movie.create).toBeCalledTimes(1)
      expect(result).toMatchObject({id: '1'})
    })

    it('Should throw error when call adMovie', async () => {
      let message
      let newMovie = {result_url: 'a', uuid: '1'}
      let body = {title: '1', description: '1',artists: [1], genres: [1]}
      movie.create = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.addMovie(newMovie, 1, body)
      } catch (e) {
        message = e.message
      }
      expect(movie.create).toBeCalledTimes(1)
      expect(message).toBe('')
    })

    it('Should call updateMovie', async () => {
      const data = {id: 1, title: 'test update'}
      const mockSave = {save: jest.fn()}
      movie.findByPk = jest.fn().mockResolvedValueOnce(mockSave)
      const actual = await movieService.updateMovie(data)
      expect(mockSave.save).toBeCalledTimes(1)
      expect(movie.findByPk).toBeCalledWith(1)
      expect(movie.findByPk).toBeCalledTimes(1)
      expect(actual).toBeDefined()
      expect(actual.title).toBe(data.title)
    })

    it('Should throw error when call updateMovie', async () => {
      let message
      const data = {id: 1, title: 'test update'}
      const mockSave = {save: jest.fn()}
      movie.findByPk = jest.fn(() => {
        throw new Error
      }).mockImplementationOnce(() => {
        throw new Error
      })
      try {
        await movieService.updateMovie(data)
      } catch (e) {
        message = e.message
      }
      expect(movie.findByPk).toBeCalledWith(1)
      expect(movie.findByPk).toBeCalledTimes(1)
      expect(mockSave.save).toBeCalledTimes(0)
      expect(message).toBe('')
    })

    it('Should call getOldFileName', async () => {
      const data = {id: 1, file_name: 'asd'}
      movie.findByPk = jest.fn().mockImplementationOnce(() => {
        return {dataValues: {file_name: 'asd'}}
      })
      let result = await movieService.getOldFileName(data)
      expect(movie.findByPk).toBeCalledWith(1)
      expect(movie.findByPk).toBeCalledTimes(1)
      expect(result).toBe('asd')
    })

    it('Should throw error when call getOldFileName', async () => {
      let message
      const data = {id: 1, file_name: 'asd'}
      movie.findByPk = jest.fn().mockImplementationOnce(() => {
        throw new Error
      })
      try {
        await movieService.getOldFileName(data)
      } catch (e) {
        message = e.message
      }
      expect(movie.findByPk).toBeCalledWith(1)
      expect(movie.findByPk).toBeCalledTimes(1)
      expect(message).toBe('')
    })

    it('Should call mostViewedMovie', async () => {
      const data = {id: 1, title: 'test'}
      connectiondb.query = jest.fn(() => {
        return Promise.resolve([[data]])
      })
      const result = await movieService.mostViewedMovie()
      expect(connectiondb.query).toBeCalledTimes(1)
      expect(result).toEqual(data)
    })

    it('Should throw error when call mostViewedMovie', async () => {
      let message
      connectiondb.query = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.mostViewedMovie()
      } catch (e) {
        message = e.message
      }
      expect(connectiondb.query).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })

    it('Should call mostVotedMovie', async () => {
      const data = {id: 1, title: 'test'}
      connectiondb.query = jest.fn(() => {
        return Promise.resolve([[data]])
      })
      const result = await movieService.mostVotedMovie()
      expect(connectiondb.query).toBeCalledTimes(1)
      expect(result).toEqual(data)
    })

    it('Should throw error when call mostVotedMovie', async () => {
      let message
      connectiondb.query = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.mostVotedMovie()
      } catch (e) {
        message = e.message
      }
      expect(connectiondb.query).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })

    it('Shoould call getAllMovieWithPagination',async () => {
      movie.findAndCountAll = jest.fn(() => {
        return Promise.resolve({})
      })
      movie.findAll = jest.fn(() => {
        return Promise.resolve({id: 1})
      })
      const result = await movieService.getAllMovieWithPagination(1)
      expect(movie.findAndCountAll).toBeCalledTimes(1)
      expect(movie.findAll).toBeCalledTimes(1)
      expect(result.results).toEqual({id: 1})
    })

    it('Should throw erorr when call getAllMovieWithPagination',async () => {
      let message
      movie.findAndCountAll = jest.fn(() => {
        return Promise.resolve({})
      })
      movie.findAll = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.getAllMovieWithPagination(1)
      } catch (e) {
        message = e.message
      }
      expect(movie.findAndCountAll).toBeCalledTimes(1)
      expect(movie.findAll).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })

    it('Should call findMovieWithTitle', async () => {
      const data = [{id: '1'}]
      movie.findAll = jest.fn(() => data)
      const result = await movieService.findMovieWithTitle('test')
      expect(movie.findAll).toBeCalledTimes(1)
      expect(result).toEqual(data) 
    })

    it('Should throw error when call findMovieWithTitle', async () => {
      let message
      movie.findAll = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.findMovieWithTitle('test')
      } catch (e) {
        message = e.message
      }
      expect(movie.findAll).toBeCalledTimes(1)
      expect(message).toBeDefined()
      expect(message).toEqual('')
    })

    it('Should call findMovieWithDescription', async () => {
      const data = [{id: '1'}]
      movie.findAll = jest.fn(() => data)
      const result = await movieService.findMovieWithDescription('test')
      expect(movie.findAll).toBeCalledTimes(1)
      expect(result).toEqual(data) 
    })

    it('Should throw error when call findMovieWithDescription', async () => {
      let message
      movie.findAll = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.findMovieWithDescription('test')
      } catch (e) {
        message = e.message
      }
      expect(movie.findAll).toBeCalledTimes(1)
      expect(message).toBeDefined()
      expect(message).toEqual('')
    })

    it('Should call findMovieWithArtists',async () => {
      const data = [{id: '1'}]
      const id = {dataValues: {id: '1'}}
      artist.findOne = jest.fn(() => {
        return id
      })
      movie.findAll = jest.fn(() => data)
      const result = await movieService.findMovieWithArtists('test')
      expect(artist.findOne).toBeCalledTimes(1)
      expect(artist.findOne).toReturnWith(id)
      expect(movie.findAll).toBeCalledTimes(1)
      expect(movie.findAll).toReturnWith(data)
      expect(result).toEqual(data)
    })

    it('Should throw error when call findMovieWithArtists',async () => {
      let message
      artist.findOne = jest.fn(() => {
        throw new Error
      })
      movie.findAll = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.findMovieWithArtists('test')
      } catch (e) {
        message = e.message
      }
      expect(artist.findOne).toBeCalledTimes(1)
      expect(movie.findAll).toBeCalledTimes(0)
      expect(message).toBeDefined
      expect(message).toEqual('')
    })

    it('Should call findMovieWithGenres',async () => {
      const data = [{id: '1'}]
      const id = {dataValues: {id: '1'}}
      genre.findOne = jest.fn(() => {
        return id
      })
      movie.findAll = jest.fn(() => data)
      const result = await movieService.findMovieWithGenres('test')
      expect(genre.findOne).toBeCalledTimes(1)
      expect(genre.findOne).toReturnWith(id)
      expect(movie.findAll).toBeCalledTimes(1)
      expect(movie.findAll).toReturnWith(data)
      expect(result).toEqual(data)
    })

    it('Should throw error when call findMovieWithGenres',async () => {
      let message
      genre.findOne = jest.fn(() => {
        throw new Error
      })
      movie.findAll = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.findMovieWithGenres('test')
      } catch (e) {
        message = e.message
      }
      expect(genre.findOne).toBeCalledTimes(1)
      expect(movie.findAll).toBeCalledTimes(0)
      expect(message).toBeDefined
      expect(message).toEqual('')
    })

    it('Should call voteMovie', async () => {
      const data = {movie_id: '1', user_id: '1'}
      movie_vote_user.create = jest.fn(() => {
        return data
      })
      const mockSave = {save: jest.fn(), vote_count: 0}
      movie.findByPk = jest.fn().mockResolvedValue(mockSave)
      const result = await movieService.voteMovie('1','1')
      expect(movie_vote_user.create).toReturnWith(data)
      expect(movie_vote_user.create).toBeCalledTimes(1)
      expect(movie.findByPk).toBeCalledTimes(1)
      expect(mockSave.save).toBeCalledTimes(1)
      expect(result.vote_count).toEqual(1)
    })

    it('Should throw error when call voteMovie', async () => {
      let message
      const data = {movie_id: '1', user_id: '1'}
      movie_vote_user.create = jest.fn(() => {
        return data
      })
      const mockSave = {save: jest.fn(), vote_count: 0}
      movie.findByPk = jest.fn().mockRejectedValue(mockSave)
      try {
        await movieService.voteMovie('1','1')
      } catch (e) {
        message = e.message
      }
      expect(movie_vote_user.create).toReturnWith(data)
      expect(movie_vote_user.create).toBeCalledTimes(1)
      expect(movie.findByPk).toBeCalledTimes(1)
      expect(mockSave.save).toBeCalledTimes(0)
      expect(message).toBe('')
    })

    it('Should throw error when call unvoteMovie', async () => {
      let message
      connectiondb.transaction = jest.fn(() => {
        throw new Error
      })
      try {
        await movieService.unvoteMovie('1','1')
      } catch (e) {
        message = e.message
      }
      expect(connectiondb.transaction).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })

    it('Should call listAllUserVote', async () => {
      const data = [{id: '1'}]
      movie_vote_user.findOne = jest.fn(() => {
        return {movie_id: '1'}
      })
      movie.findAll = jest.fn(() => {
        return data
      })
      const result = await movieService.listAllUserVote('1')
      expect(movie_vote_user.findOne).toBeCalledTimes(1)
      expect(movie_vote_user.findOne).toReturnWith({movie_id: '1'})
      expect(movie.findAll).toBeCalledTimes(1)
      expect(movie.findAll).toReturnWith(data)
      expect(result).toBe(data)
    })

    it('Should throw error when call listAllUserVote', async () => {
      let message
      const data = [{id: '1'}]
      movie_vote_user.findOne = jest.fn(() => {
        throw new Error
      })
      movie.findAll = jest.fn(() => {
        return data
      })
      try {
        await movieService.listAllUserVote('1')
      } catch (e) {
        message = e.message
      }
      expect(movie_vote_user.findOne).toBeCalledTimes(1)
      expect(movie.findAll).toBeCalledTimes(0)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })
  })

  describe('Genre Service', () => {
    let connectiondb

    beforeAll(() => {
      connectiondb = connection
      genreService = new GenreService(connectiondb)
    })

    afterAll(async done => {
      await connection.close()
      done()
    })

    it('Should call mostViewedGenre', async () => {
      const data = {id:1}
      connectiondb.query = jest.fn(() => {
        return [[data]]
      })
      const result = await genreService.mostViewedGenre()
      expect(connectiondb.query).toBeCalledTimes(1)
      expect(result).toEqual(data)
    })

    it('Should throw error when call mostViewedGenre', async () => {
      let message
      connectiondb.query = jest.fn(() => {
        throw new Error
      })

      try {
        await genreService.mostViewedGenre()
      } catch (e) {
        message = e.message
      }

      expect(connectiondb.query).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })
  })
  
  describe('Service Auth', () => {
    let admin, user
    let authUserService, authAdminServie
    let bcryptjs
    const data = {id: '1'}
    beforeAll(() => {
      admin = new Admin()
      user = new User()
      bcryptjs = Bcrypt
      authUserService = new AuthService(user)
      authAdminServie = new AuthService(admin)
    })

    afterAll(async done => {
      await connection.close()
      done()
    })

    it('Should call authAdmin', async () => {
      admin.findOne = jest.fn(() => {
        return data
      })
      bcryptjs.compareSync = jest.fn(() => {
        return true
      })
      const result = await authAdminServie.authAdmin(data)
      expect(admin.findOne).toBeCalledTimes(1)
      expect(bcryptjs.compareSync).toBeCalledTimes(1)
      expect(result).toBe(data.id)
    })

    it('Should throw error when call authAdmin password not match', async () => {
      let message
      admin.findOne = jest.fn(() => {
        return data
      })
      bcryptjs.compareSync = jest.fn(() => {
        return false
      })
      try {
        await authAdminServie.authAdmin(data)
      } catch (e) {
        message = e.message
      }
      expect(admin.findOne).toBeCalledTimes(1)
      expect(bcryptjs.compareSync).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })

    it('Should throw error when call authAdmin', async () => {
      let message
      admin.findOne = jest.fn(() => {
        throw new Error
      })
      try {
        await authAdminServie.authAdmin(data)
      } catch (e) {
        message = e.message
      }
      expect(admin.findOne).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })

    it('Should call authUser', async () => {
      user.findOne = jest.fn(() => {
        return data
      })
      bcryptjs.compareSync = jest.fn(() => {
        return true
      })
      const result = await authUserService.authUser(data)
      expect(user.findOne).toBeCalledTimes(1)
      expect(bcryptjs.compareSync).toBeCalledTimes(1)
      expect(result).toBe(data.id)
    })

    it('Should throw error when call authUser password not match', async () => {
      let message
      user.findOne = jest.fn(() => {
        return data
      })
      bcryptjs.compareSync = jest.fn(() => {
        return false
      })
      try {
        await authUserService.authUser(data)
      } catch (e) {
        message = e.message
      }
      expect(user.findOne).toBeCalledTimes(1)
      expect(bcryptjs.compareSync).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })

    it('Should throw error when call authUser', async () => {
      let message
      user.findOne = jest.fn(() => {
        throw new Error
      })
      try {
        await authUserService.authUser(data)
      } catch (e) {
        message = e.message
      }
      expect(user.findOne).toBeCalledTimes(1)
      expect(message).toBe('')
      expect(message).toBeDefined()
    })

    it('Should call registerUser', async () => {
      bcryptjs.genSalt = jest.fn()
      bcryptjs.hash = jest.fn(() => {
        return '1'
      })
      user.create = jest.fn(() => {
        return data
      })
      const result = await authUserService.registerUser(data)
      expect(bcryptjs.genSalt).toBeCalledTimes(1)
      expect(bcryptjs.hash).toBeCalledTimes(1)
      expect(result).toEqual({id: '1', password: '1'})
      expect(result.id).toBe('1')
      expect(result.password).toBe('1')
      expect(result).toBeDefined()
    })

    it('Should call registerUser', async () => {
      let message
      bcryptjs.genSalt = jest.fn()
      bcryptjs.hash = jest.fn(() => {
        return '1'
      })
      user.create = jest.fn(() => {
        throw new Error
      })
      try {
        await authUserService.registerUser(data)
      } catch (e) {
        message = e.message
      }
      expect(bcryptjs.genSalt).toBeCalledTimes(1)
      expect(bcryptjs.hash).toBeCalledTimes(1)
      expect(message).toEqual('')
      expect(message).toBeDefined()
    })
  })
})