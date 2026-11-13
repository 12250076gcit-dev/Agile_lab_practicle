const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'sme', 'pharmacist', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el) {
        return el === this.password
      },
      message: 'Passwords are not the same',
    },
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
})

// Hash password on create/save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
  this.passwordConfirm = undefined
})

// Hash password on update (also rejects mismatched or short passwords)
userSchema.pre('findOneAndUpdate', async function () {
  const update = this.getUpdate()
  if (update.password !== undefined && update.password !== '') {
    if (update.password !== update.passwordConfirm) {
      throw new Error('Passwords are not the same')
    }
    if (update.password.length < 8) {
      throw new Error('Password must be at least 8 characters')
    }
    update.password = await bcrypt.hash(update.password, 12)
    update.passwordConfirm = undefined
  }
})

// Instance method: available on all user documents
// candidatePassword = plain password from the login body
// userPassword = hashed password stored in the DB
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User