const {config} = require('dotenv')
const fs = require('fs')

config()

const privKey = process.env.PRIVATE_KEY.replace(/\\n/g, '@@@@@')
const data = {
  "type": "service_account",
  "project_id": "express-movielist",
  "private_key_id": process.env.PRIVATE_KEY_ID,
  "private_key": privKey,
  "client_email": "firebase-adminsdk-387wj@express-movielist.iam.gserviceaccount.com",
  "client_id": "117742407319516635492",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-387wj%40express-movielist.iam.gserviceaccount.com"
}
const res = JSON.stringify(data, null, 2).replace(/@@@@@/g, '\\n')
fs.writeFile('credentials-firebase.json', res, function (err) {
  if(err) throw err
  console.log('Generate credentials finished\n')
})