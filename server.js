const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config({ path: './config.env' })
const app = require('./app')

const start = async () => {
  const localDB = process.env.DATABASE_LOCAL

  if (!localDB) {
    throw new Error('DATABASE_LOCAL is not configured')
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured')
  }

  await mongoose.connect(localDB, { serverSelectionTimeoutMS: 5000 })
  console.log('DB connection successful')

  const port = process.env.PORT || 4001
  app.listen(port, () => {
    console.log(`App running on port ${port}...`)
  })
}

start().catch((error) => {
  console.error('Unable to start application:', error.message)
  process.exitCode = 1
})