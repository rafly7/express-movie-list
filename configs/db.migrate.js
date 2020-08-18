import Connection from './db.connect'
import User from '../src/models/user'
import Genre from '../src/models/genre'
import Artist from '../src/models/artist'
import Admin from '../src/models/admin'
import Permission from '../src/models/permission'
import Movie from '../src/models/movie'
import Bcrypt from 'bcryptjs'

(async _ => {
  await Connection.sync({force: true})
  let salt = await Bcrypt.genSalt(10)
  let password1 = await Bcrypt.hash('123456', salt)
  let user1 = await User.create({
    username: 'rafly',
    email: 'rafly@gmail.com',
    password: password1,
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
   * Migrate for table permission
   */
  let permission1 = await Permission.create({
    id: 1,
    description: 'CREATE MOVIE'
  })
  let permission2 = await Permission.create({
    id: 2,
    description: 'UPDATE MOVIE'
  })
  let permission3 = await Permission.create({
    id: 4,
    description: 'READ MOVIE'
  })
  let permission4 = await Permission.create({
    id: 8,
    description: 'DELETE MOVIE'
  })
  let permission5 = await Permission.create({
    id: 16,
    description: 'GET MOST VOTED MOVIE'
  })
  let permission6 = await Permission.create({
    id: 32,
    description: 'GET MOST VIEWED GENRE'
  })

  /**
   * Migrate for table movie
   */
  const a = ["1","2","3"]
  const res = a.toString().split(',').map(Number)
  console.log(res)
  let movie1 = await Movie.create({
    title: 'Stay On The Earth',
    description: 'An ex-soldier, a teen and a cop collide in New Orleans as they hunt for the source behind a dangerous new pill that grants users temporary superpowers.',
    duration: '0',
    vote_count: '0',
    watch_url: 'https://example.com',
    file_name: 'efeufwf',
    artists: [1,2,3,4],
    genres: [1,3,5]
  })
  process.exit(0)
})();