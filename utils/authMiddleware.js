const jwt = require('jsonwebtoken')
const User = require('../models/userModels')
const AppError = require('./appError')

const getToken = (req) => {
  const authorization = req.headers.authorization
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.slice(7)
  }

  const cookie = req.headers.cookie
    ?.split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith('jwt='))

  return cookie?.slice(4)
}

exports.protect = async (req, res, next) => {
  const token = getToken(req)
  if (!token) {
    return next(new AppError('Please log in to access this resource', 401))
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const currentUser = await User.findById(decoded.id).select('+active')

    if (!currentUser || !currentUser.active) {
      return next(
        new AppError('The account for this token no longer exists', 401)
      )
    }

    req.user = currentUser
    return next()
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return next(new AppError('Invalid or expired token', 401))
    }
    return next(err)
  }
}

exports.restrictTo = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(
      new AppError('You do not have permission to perform this action', 403)
    )
  }
  return next()
}
