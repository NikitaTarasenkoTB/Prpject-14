const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (validateEmail) => validator.isEmail(validateEmail),
      message: (wrongEmail) => `${wrongEmail} не верно введен email`,
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
    select: false
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (validateItem) => validator.isURL(validateItem),
      message: (wrongItem) => `${wrongItem.value} не ссылка!`,
    },
  },
});

userSchema.statics.findUserByCredentials = function(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if(!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'))
      }
      return bcrypt.compare(password, user.password)
        .then((isMatched) => {
          return !isMatched ? Promise.reject(new Error('Неправильные почта или пароль')) : user;
        })
    })
};

module.exports = mongoose.model('user', userSchema);
