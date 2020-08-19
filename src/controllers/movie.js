import multer from 'multer'
import {deleteFolderRecursive, uploadFile, updateFileFirebase} from '../../configs/firestore'

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

const movieUpload = multer({storage:multerStorage}).single('movie') 

const addMovie = async (req, res, service) => {
  movieUpload(req, res, async (err) => {
    const movie = req.body;
    if(err) {
      res.status(404)
      res.json({message: 'failed upload'})
    } else {
      try {
        const resultUpload = await uploadFile(`./uploads/${fileName}`, req.file);
        const addMovie = await service.addMovie(resultUpload, movie)
        res.status(200)
        res.json(addMovie)
      } catch (e) {
        console.log(e)
        res.status(500)
        res.json({message: 'Something went wrong'})
      } finally {
        deleteFolderRecursive()
      }
    }
  })
}


const updateMovie = async (req, res, service) => {
  movieUpload(req, res, async (err) => {
    try {
      let movie = req.body
      let updateMovie;
      if(req.file) {
        let oldFileName = await service.getOldFileName(movie)
        const {result_url, uuid} = await updateFileFirebase(oldFileName, fileName, req.file)
        req.body.watch_url = result_url
        req.body.file_name = uuid
        updateMovie = await service.updateMovie(movie)
        res.status(200)
        res.json(updateMovie)
      } else {
        updateMovie = await service.updateMovie(movie)
        res.status(200)
        res.json(updateMovie)
      }
    } catch (e) {
      res.status(500)
      res.json({message: 'Something went wrong'})
    } finally {
      deleteFolderRecursive()
    }
  })
}

const getMovieWithPagination = async (req, res, service) => {
  try {
    const page = req.params.page
    const result = await service.getMovieWithPagination(page)
    res.status(200).json(result)
  } catch (e) {
    res.status(500).send('Something went wrong')
  }
}
export {addMovie, updateMovie, getMovieWithPagination}