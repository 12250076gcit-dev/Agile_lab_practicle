const express = require('express')
const router = express.Router()
const viewsController = require('./../controllers/viewController')

router.get('/', viewsController.getHome)
router.get('/login', viewsController.getLoginForm)
router.get('/signup', viewsController.getSignupForm)

module.exports = router