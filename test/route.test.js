const server = require('../src/server')
const request = require('supertest')
const connection = require('../configs/db.connect');
const Movie = require('../src/models/movie');
const Bcrypt = require('bcryptjs');
const Admin = require('../src/models/admin');
const path = require('path');
let
  movie1,
  email,
  password

async function initDb() {
  await connection.sync({force: true})
  movie1 = await Movie.create({
    title: 'Stay On The Earth',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [1,2],
    genres: [1,3,5]
  })
  password = '123456'
  email = 'test@gmail.com'
  let salt = await Bcrypt.genSalt(10)
  let password1 = await Bcrypt.hash(password, salt)
  await Admin.create({
    username: 'test',
    email: email,
    phoneNumber: '081233132',
    password: password1,
  })
}
afterAll(async (done) => {
  await connection.close()
  done()
})

beforeAll(async (done) => {
  await initDb()
  jest.setTimeout(100*1000)
  done()
})

describe('Route No requires authenticate with all HTTP status code 200', () => {
  it('Should list all movie with page', async (done) => {
    await request(server)
      .get('/movie/page/1')
      .then(res => {
        expect(res.status).toEqual(200)
        expect(res.body.results.length).toEqual(1)
        expect(res.body.current_page).toEqual(1)
        expect(res.body.total_pages).toEqual(1)
        expect(res.body.total_results).toEqual(1)
        expect(res.body.results[0].id).toBe(movie1.id)
        done()
      })
  })

  it('Should get viewer currently movie', async (done) => {
    const res = await request(server)
      .get(`/movie/view/${movie1.id}`)
    expect(res.status).toBe(200)
    expect(res.body.viewer).toBe(1)
    done()
  })
})

describe('Route auth as admin', () => {
  let agent = request.agent(server)
  let cookie
  let id

  it('Should return a HTTP status code 400 in route /auth/admin', done => {
    agent
      .post('/auth/admin')
      .send({
        email: 'wrong email',
        password: 'wrong password'
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/^incorrect/i)
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /auth/admin', done => {
    agent
      .post('/auth/admin')
      .send({
        email: email,
        password: password
      })
      .expect(200)
      .then(res => {
        cookie = res.header['set-cookie'][0]
        expect(res.body.message).toMatch(/^success/i)
        done()
      })
  })

  it('Should return a HTTP status code 400 in route /auth/admin', done => {
    agent
      .post('/auth/admin')
      .set('Cookie',cookie)
      .send({
        email: email,
        password: password
      })
      .expect(400)
      .then(res => {
        expect(res.body.message).toMatch(/^you have already/i)
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /movie method POST',async done => {
    agent
      .post('/movie')
      .attach('movie', path.join('dummy.mp4'))
      .field('title', 'test')
      .field('description', 'test')
      .field('artists[0]', '1')
      .field('genres[0]', '1')
      .expect(200)
      .then(res => {
        id = res.body.id
        expect(res.body).toBeDefined()
        done()
      })
  })

  it('Should return a HTTP status code 400 in route /movie method POST',async done => {
    agent
      .post('/movie')
      .attach('error', path.join('dummy.mp4'))
      .field('title', 'test')
      .field('description', 'test')
      .field('artists[0]', '1')
      .field('genres[0]', '1')
      .expect(400)
      .then(res => {
        expect(res.body.message).toMatch(/^failed/)
        done()
      })
  })

  it('Should return a HTTP status code 500 in route /movie method POST',async done => {
    agent
      .post('/movie')
      .attach('movie', path.join('database.sqlite'))
      .expect(500)
      .then(res => {
        expect(res.body.message).toMatch(/something went wrong/i)
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /movie method PUT without FILE',async done => {
    agent
      .put('/movie')
      .field('id', id)
      .field('title', 'update test')
      .expect(200)
      .then(res => {
        expect(res.body).toBeDefined()
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /movie method PUT with FILE',async done => {
    agent
      .put('/movie')
      .attach('movie', path.join('dummy.mp4'))
      .field('id', id)
      .field('title', 'update test')
      .expect(200)
      .then(res => {
        expect(res.body).toBeDefined()
        done()
      })
  })

  it('Should return a HTTP status code 500 in route /movie method PUT',async done => {
    agent
      .put('/movie')
      .attach('movie', path.join('dummy.mp4'))
      .field('id', 'test')
      .field('title', 'update test')
      .expect(500)
      .then(res => {
        expect(res.body).toBeDefined()
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /search/most-voted-movie', done => {
    agent
      .get('/search/most-voted-movie')
      .expect(200)
      .then(res => {
        expect(res.body).toBeDefined()
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /search/most-viewed-movie', done => {
    agent
      .get('/search/most-viewed-movie')
      .expect(200)
      .then(res => {
        expect(res.body).toBeDefined()
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /auth/logout', done => {
    agent
      .post('/auth/logout')
      .then(res => {
        expect(res.status).toBe(200)
        done()
      })
  })
})


describe('Route auth as user', () => {
  let agent = request.agent(server)
  let cookie

  it('Register user should return a HTTP status code 400 /auth/register-user',async done => {
    await request(server)
      .post('/auth/register-user')
      .send({
        email: email,
        password: password
      })
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/^register failed/i)
        done()
      })
  })

  it('Register user should return a HTTP status code 200 /auth/register-user',async done => {
    const username = 'test'
    await request(server)
      .post('/auth/register-user')
      .send({
        username: username,
        email: email,
        password: password
      })
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.email).toBe(email)
        expect(res.body.username).toBe(username)
        done()
      })
  })

  it('Should return a HTTP status code 400 in route /auth/user',async done => {
    await request(server)
      .post('/auth/user')
      .send({
        email: 'wrong email',
        password: 'wrong password'
      })
      .then(res => {
        expect(res.status).toBe(400)
        done()
      })
  })

  it('Should have login as user in route /auth/user', done => {
    agent
      .post('/auth/user')
      .send({
        email: email,
        password: password
      })
      .expect(200)
      .then(res => {
          cookie = res.header['set-cookie'][0]
          expect(res.status).toEqual(200)
          expect(res.body.message).toMatch(/^success/i)
          done()
      })
  })

  it('Should return a HTTP status code 400 in route /auth/user', done => {
    agent
      .post('/auth/user')
      .set('Cookie', cookie)
      .send({
        email: email,
        password: password
      })
      .expect(400)
      .then(res => {
          expect(res.status).toEqual(400)
          expect(res.body.message).toMatch(/^you have already/i)
          done()
      })
  })

  it('Should return a HTTP status code 200 in route /movie/vote/:id', done => {
    agent
      .post('/movie/vote/'+ movie1.id)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.vote_count).toBe(1)
        done()
      })
  })

  it('Should return a HTTP status code 400 in route /movie/vote/:id', done => {
    agent
      .post('/movie/vote/'+ movie1.id)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/^you already/i)
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /movie/list-all-user-vote', done => {
    agent
      .get('/movie/list-all-user-vote')
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body[0].id).toBe(movie1.id)
        done()
      })
  })

  it('Should return a HTTP status code 200 in route /movie/unvote/:id', done => {
    agent
      .delete('/movie/unvote/'+ movie1.id)
      .then(res => {
        expect(res.status).toBe(200)
        expect(res.body.vote_count).toBe(0)
        done()
      })
  })

  it('Should return a HTTP status code 400 in route /movie/unvote/:id', done => {
    agent
      .delete('/movie/unvote/'+ movie1.id)
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.body.message).toMatch(/^cannot unvoted/i)
        done()
      })
  })

  it('Should return a HTTP status code 400 in route /movie/list-all-user-vote',async done => {
    jest.setTimeout(10000)
    await connection.drop();
    agent
      .get('/movie/list-all-user-vote/')
      .then(res => {
        expect(res.status).toBe(400)
        expect(res.text).toMatch(/^something/i)
        done()
      })
  })


  it('Should return a HTTP status code 200 in route /auth/logout', done => {
    agent
      .post('/auth/logout')
      .then(res => {
        expect(res.status).toBe(200)
        done()
      })
  })
})

describe('Route No requires authenticate Should NOT HTTP 200 status code',() => {
  it('Should get movie by query title', async (done) => {
    const res = await request(server)
      .get('/search?wrong-query=' + movie1.title)
    expect(res.status).toBe(400)
    done()
  })

  it('Should list all movie with page', async (done) => {
    await request(server)
      .get('/movie/page/1')
      .then(res => {
        expect(res.status).toEqual(500)
        done()
      })
  })

  it('Should get viewer currently movie', async (done) => {
    const res = await request(server)
      .get(`/movie/view/${movie1.id}`)
    expect(res.status).toBe(400)
    done()
  })
})

it('Sholud return a HTTP status code 404', async (done) => {
  const res = await request(server)
    .get('/not-found')
  expect(res.status).toBe(404)
  done()
})

it('Should get a http status code 401 in route /auth/logout', async (done) => {
  const res = await request(server)
    .post('/auth/logout')
  expect(res.status).toBe(401)
  expect(res.body.message).toMatch(/^you must be/i)
  done()
})

it('Should get a http status code 401 in route /movie/list-all-user-vote', async (done) => {
  const res = await request(server)
    .get('/movie/list-all-user-vote')
  expect(res.status).toBe(401)
  done()
})

it('Should get a http status code 401 in route /movie/vote/:id', async (done) => {
  const res = await request(server)
    .post('/movie/vote/'+movie1.id)
  expect(res.status).toBe(401)
  done()
})

it('Should get a http status code 401 in route /movie/unvote/:id', async (done) => {
  const res = await request(server)
    .delete('/movie/unvote/'+movie1.id)
  expect(res.status).toBe(401)
  done()
})

it('Should get a http status code 401 in route /search/most-voted-movie', async (done) => {
  const res = await request(server)
    .get('/search/most-voted-movie')
  expect(res.status).toBe(401)
  done()
})

it('Should get a http status code 401 in route /search/most-viewed-movie', async (done) => {
  const res = await request(server)
    .get('/search/most-viewed-movie')
  expect(res.status).toBe(401)
  done()
})

it('Should get a http status code 401 in route /search/most-viewed-genre', async (done) => {
  const res = await request(server)
    .get('/search/most-viewed-genre')
  expect(res.status).toBe(401)
  done()
})