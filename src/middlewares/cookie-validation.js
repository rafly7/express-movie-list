const cookieValidationAdmin = (req, res, next) => {
  if (req.session.role === 1) {
      next()
  } else {
      res.sendStatus(401)
  }
}

export default cookieValidationAdmin