const express = require('express')
const path = require('path')
const app = express()
const userRouter = require('./routes/userRoutes')
const viewRouter = require('./routes/viewRoutes')

app.use(express.json())
app.use('/api/v1/users', userRouter)
app.use('/', viewRouter)
app.use(express.static(path.join(__dirname, 'views')))

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  let statusCode = err.statusCode || 500
  if (err.name === 'CastError' || err.name === 'ValidationError') {
    statusCode = 400
  } else if (err.code === 11000) {
    statusCode = 409
  }

  const message =
    statusCode >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message

  res.status(statusCode).json({
    status: err.status || 'error',
    message,
  })
})

module.exports = app