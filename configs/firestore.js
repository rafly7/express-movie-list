import path from 'path'
import fs from 'fs'
import {Storage} from '@google-cloud/storage'
import {v4, v1} from 'uuid'
const gstorage = new Storage({
  projectId: "express-movielist",
  keyFilename: 'configs/express-movielist.json'
})

const bucket = gstorage.bucket('express-movielist.appspot.com')

const deleteFolderRecursive = function (pathName = path.join('uploads/')) {
  if (fs.existsSync(pathName)) {
      fs.readdirSync(pathName).forEach(function (file, index) {
          const curPath = pathName + "/" + file;
           if (fs.lstatSync(curPath).isDirectory()) { // recurse
              deleteFolderRecursive(curPath);
              fs.rmdirSync(curPath);
          } else { // delete file
              fs.unlinkSync(curPath);
          }
      });
  }
};

const uploadFile = async (localFile, file) => {
  const
    uuidv1 = v1(),
    uuidv4 = v4(),
    url = await bucket.upload(localFile, {
        destination: uuidv1,
        uploadType: "media",
        metadata: {
          contentType: file.mimetype,
          firebaseStorageDownloadTokens: uuidv4
        }
      })
      .then((data) => {
          let file = data[0];
          return Promise.resolve("https://firebasestorage.googleapis.com/v0/b/" + bucket.name + "/o/" + encodeURIComponent(file.name) + "?alt=media&token=" + uuidv4);
      })
  return {result_url: url, uuid: uuidv1}
}

const updateFileFirebase = (oldFileName, newFileName, infoFile) => {
  const file = bucket.file(oldFileName)
  return file.delete()
    .then(async () => {
      return await uploadFile(`./uploads/${newFileName}`, infoFile)
  })
    .catch(e => e)
}

export {deleteFolderRecursive, uploadFile, updateFileFirebase}