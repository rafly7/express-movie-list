import Connection from './db.connect'
import User from '../src/models/user'
import Genre from '../src/models/genre'
import Artist from '../src/models/artist'
import Admin from '../src/models/admin'
import Movie from '../src/models/movie'
import Bcrypt from 'bcryptjs'
import Viewer from '../src/models/viewer'
import {dbAssociation} from '../src/models/movie_vote_user'

(async _ => {
  dbAssociation()
  await Connection.sync({force: true})
  let salt = await Bcrypt.genSalt(10)
  let password1 = await Bcrypt.hash('123456', salt)
  let password2 = await Bcrypt.hash('654321', salt)
  let user1 = await User.create({
    username: 'Dita',
    email: 'dita@gmail.com',
    password: password1,
  })
  let user2 = await User.create({
    username: 'Ava',
    email: 'ava@gmail.com',
    password: password2,
  })

  /**
   * Migrate for table genre
   */
  let genre1 = await Genre.create({
    name: 'Action'
  })
  let genre2 = await Genre.create({
    name: 'Adventure'
  })
  let genre3 = await Genre.create({
    name: 'Horror'
  })
  let genre4 = await Genre.create({
    name: 'Thriller'
  })
  let genre5 = await Genre.create({
    name: 'War'
  })
  let genre6 = await Genre.create({
    name: 'Science Fiction'
  })

  /**
   * Migrate for table artist
   */
  let artist1 = await Artist.create({
    name: 'Dita'
  })
  let artist2 = await Artist.create({
    name: 'Rafly'
  })
  let artist3 = await Artist.create({
    name: 'Fina'
  })
  let artist4 = await Artist.create({
    name: 'Farel'
  })
  let artist5 = await Artist.create({
    name: 'Ava'
  })
  let artist6 = await Artist.create({
    name: 'Genul'
  })

  /**
   * Migrate for table admin
   */
  let passwordAdmin1 = await Bcrypt.hash('654321', salt)
  let admin1 = await Admin.create({
    username: 'Alvito',
    email: 'alvito@gmail.com',
    phoneNumber: '6281345542323',
    password: passwordAdmin1
  })
  let passwordAdmin2 = await Bcrypt.hash('123456', salt)
  let admin2 = await Admin.create({
    username: 'Rafly',
    email: 'rafly@gmail.com',
    phoneNumber: '628145542323',
    password: passwordAdmin2
  })
  let passwordAdmin3 = await Bcrypt.hash('123123', salt)
  let admin3 = await Admin.create({
    username: 'Agna',
    email: 'agna@gmail.com',
    phoneNumber: '634445542323',
    password: passwordAdmin3
  })

  /**
   * Migrate for table movie
   */
  let movie1 = await Movie.create({
    title: 'Stay On The Earth',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [1,2],
    genres: [1,3,5]
  })
  let movie2 = await Movie.create({
    title: 'Planet of the apes',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [3,4],
    genres: [1,2,5]
  })
  let movie3 = await Movie.create({
    title: 'Neptune Wars',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [1,4],
    genres: [1,2,3]
  })
  let movie4 = await Movie.create({
    title: 'Special Group',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [1,3],
    genres: [2,5,6]
  })
  let movie5 = await Movie.create({
    title: 'Pluto and venus',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [2,3,4,5],
    genres: [1,2,6]
  })
  let movie6 = await Movie.create({
    title: 'Crackers',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [2,4,6],
    genres: [3,4,5]
  })
  let movie7 = await Movie.create({
    title: 'Shadow Time',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [1,3,6],
    genres: [2,4,6]
  })
  let movie8 = await Movie.create({
    title: 'Space adventure',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [1,4,5],
    genres: [4,5,6]
  })
  let movie9 = await Movie.create({
    title: 'Nightmare',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [2,3,5],
    genres: [3,4,6]
  })
  let movie10 = await Movie.create({
    title: 'Demon king',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [4,5,6],
    genres: [1,4,5]
  })
  process.exit(0)
})();