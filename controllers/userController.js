const User = require('./../models/userModels')
const AppError = require('./../utils/appError')

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
    res.status(200).json({ data: users, status: 'success' })
  } catch (err) {
    next(err)
  }
}

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body)
    res.status(201).json({ data: user, status: 'success' })
  } catch (err) {
    next(err)
  }
}

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return next(new AppError('User not found', 404))
    }
    res.json({ data: user, status: 'success' })
  } catch (err) {
    next(err)
  }
}

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body)
    if (!user) {
      return next(new AppError('User not found', 404))
    }
    res.json({ data: user, status: 'success' })
  } catch (err) {
    next(err)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    if (!user) {
      return next(new AppError('User not found', 404))
    }
    res.json({ data: user, status: 'success' })
  } catch (err) {
    next(err)
  }
}