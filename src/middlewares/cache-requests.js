const redis = require('redis')
const client = redis.createClient()

const cache = (req, res, next) => {
  try {
    const page = req.params.page
    getCache(page, res, next)
  } catch (e) {
    res.status(500).json({error: e})
  }
}

const getCache = (key, res, next) => {
  client.get(key, function(err, data) {
    if (err) throw err
    if (data != null) { // check if data is present in cache
      res.status(200).json(JSON.parse(data))
    } else { // if data not present 
      next()
    }
  })
}

module.exports = {
  cache
}