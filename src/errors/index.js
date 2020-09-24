class HttpError extends Error {}

class BadRequest extends HttpError {
  constructor(message = 'Bad Request') {
    super(message)
    this.status = 400
  }
}

class Unauthorized extends HttpError {
  constructor(message = 'Unauthorized') {
    super(message)
    this.status = 401
  }
}

class InternalServer extends HttpError {
  constructor(message = 'InternalServer') {
    super(message)
  }
}

module.exports = {
  BadRequest,
  Unauthorized,
  InternalServer
}