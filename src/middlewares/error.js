const serverError = (err, req, res, next) => {
  if (!err.status) {
    process.env.NODE_ENV === 'production' ? null : console.error(err.stack)
  }
  res.status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' })
}

const catchAsync = handler => (...args) => handler(...args).catch(args[2])

module.exports = {
  serverError,
  catchAsync
}