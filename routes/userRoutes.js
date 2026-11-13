const express = require('express')
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController')
const authMiddleware = require('./../utils/authMiddleware')

const router = express.Router()

router.post('/signup', authController.signup)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/me', authMiddleware.protect, authController.getMe)

router.use(authMiddleware.protect, authMiddleware.restrictTo('admin'))
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router