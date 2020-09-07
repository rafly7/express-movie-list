const Connection = require('./db.connect')
const User = require('../src/models/user')
const Genre = require('../src/models/genre')
const Artist = require('../src/models/artist')
const Admin = require('../src/models/admin')
const Bcrypt = require('bcryptjs')
const {dbAssociation} = require('../src/models/movie_vote_user')

const run = async function() {
  dbAssociation();
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
  process.exit(0)
};
run()