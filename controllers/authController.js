const User = require('./../models/userModels')
const jwt = require('jsonwebtoken')
const AppError = require('./../utils/appError')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  }

  res.cookie('jwt', token, cookieOptions)

  // Don't send the hashed password back to the client
  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, passwordConfirm, role = 'user' } =
      req.body || {}

    if (!['user', 'sme', 'pharmacist'].includes(role)) {
      return next(new AppError('Invalid account role', 400))
    }

    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
      role,
    })
    createSendToken(newUser, 201, res)
  } catch (err) {
    next(err)
  }
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {}

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide an email and password!', 400))
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password +active')

    if (
      !user ||
      !user.active ||
      !(await user.correctPassword(password, user.password))
    ) {
      return next(new AppError('Incorrect email or password', 401))
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res)
  } catch (err) {
    next(err)
  }
}

exports.getMe = (req, res) => {
  const { _id, name, email, photo, role } = req.user
  res.status(200).json({
    status: 'success',
    data: { user: { _id, name, email, photo, role } },
  })
}

exports.logout = (req, res) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  })
  res.status(200).json({ status: 'success' })
}