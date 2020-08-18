import multer from 'multer'
import {deleteFolderRecursive, uploadFile} from '../../configs/firestore'

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
      if(!err) {
        
      } 
      res.status(200)
      res.send('succes')
    } catch (e) {
      console.log(e)
    } finally {
      deleteFolderRecursive()
    }
  })
}

export {addMovie, updateMovie}