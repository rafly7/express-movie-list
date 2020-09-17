const jwt = require('jsonwebtoken')

const tokenValidation = (req, res, next) => {
  const { movielist } = req.headers
  if (movielist) {
    const token = movielist.slice(0, movielist.length)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401)
      } else {
        const decodedToken = decoded
        if(Date.now() >= decodedToken.exp * 1000) res.sendStatus(401)
        else next()
      }
    })
  } else {
    res.sendStatus(401)
  }
}

module.exports = tokenValidation