const path = require('path')
const multer = require('multer')
const {uploadFile, updateFileFirebase, deleteFile} = require('../../configs/firestore')
const {getVideoDurationInSeconds} = require('get-video-duration')
const { BadRequest } = require('../errors')

let fileName;

const multerStorage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads')
  },
  filename: function(req, file, cb) {
    fileName = file.fieldname + '-' + Date.now()
    cb(null, fileName)
  }
})

const movieUpload = multer({
  storage:multerStorage,
  fileFilter: function (req, file, callback) {
    const ext = path.extname(file.originalname)
    if(ext !== '.mp4' || ext !== '.mkv' || ext !== '.webm') return callback(null, true)
  }
}).single('movie') 

const addMovie = async (req, res, service) => {
  movieUpload(req, res, async (err) => {
    const movie = req.body;
    if(err) {
      res.status(400)
      res.json({message: 'failed upload'})
    } else {
      try {
        const duration = await getVideoDurationInSeconds(path.join('uploads',req.file.filename)).then(duration => duration.toFixed(1))
        const resultUpload = await uploadFile(`./uploads/${fileName}`, req.file);
        const addMovie = await service.addMovie(resultUpload, duration, movie)
        res.status(200).json(addMovie)
      } catch(e) {
        res.status(500).json({message: 'Something went wrong'})
      }
      deleteFile()
    }
  })
}

const updateMovie = async (req, res, service) => {
  movieUpload(req, res, async (err) => {
    try {
      let movie = req.body
      let updateMovie;
      if(req.file) {
        const duration = await getVideoDurationInSeconds(path.join('uploads',req.file.filename)).then(duration => duration.toFixed(1))
        let oldFileName = await service.getOldFileName(movie)
        const {result_url, uuid} = await updateFileFirebase(oldFileName, fileName, req.file)
        req.body.watch_url = result_url
        req.body.file_name = uuid
        req.body.duration = parseFloat(duration)
        updateMovie = await service.updateMovie(movie)
        res.status(200)
        res.json(updateMovie)
      } else {
        updateMovie = await service.updateMovie(movie)
        res.status(200)
        res.json(updateMovie)
      }
    } catch {
      res.status(500).json({message: 'Something went wrong'})
    }
    deleteFile()
  })
}

const voteMovie = async (req, res, service) => {
  try {
    const movieId = req.params.id
    const userId = req.session.userId
    const voted = await service.voteMovie(movieId, userId)
    res.status(200).json(voted)
  } catch (e) {
    res.status(400).json({message: 'You already voted this movie'})
  }
}

const unvoteMovie = async (req, res, service) => {
  try {
    const movieId = req.params.id
    const userId = req.session.userId
    const unvoted = await service.unvoteMovie(movieId, userId)
    res.status(200).json(unvoted)
  } catch (e) {
    res.status(400).json({message: 'Cannot unvoted movie before your voted'})
  }
}

const listAllUserVote = async (req, res, service) => {
  try {
    const userId = req.session.userId
    const listAllVote = await service.listAllUserVote(userId)
    res.status(200).json(listAllVote)
  } catch (e) {
    res.status(400).send('Something went wrong')
  }
}

const viewMovieById = async (req, res, service) => {
  try {
    const movieId = req.params.id
    const viewMovieById = await service.viewMovieById(movieId)
    res.status(200).json(viewMovieById)
  } catch {
    throw new BadRequest('Something went wrong')
  }
}

module.exports = {
  addMovie,
  updateMovie,
  voteMovie,
  unvoteMovie,
  listAllUserVote,
  viewMovieById,
}