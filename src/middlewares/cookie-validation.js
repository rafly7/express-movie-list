const cookieValidationAdmin = (req, res, next) => {
  if (req.session.role === 1) {
      next()
  } else {
      res.sendStatus(401)
  }
}

const cookieValidationUser = (req, res, next) => {
  if (req.session.role === 2) {
      next()
  } else {
      res.sendStatus(401)
  }
}

export {cookieValidationAdmin, cookieValidationUser}