const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const secretKey = '420a1d5c32303bc96677d77d89567a75802b9843b86009274b46b592943fd940';

function getUsers(request, response) {
  User.find({})
    .then((usersData) => response.send({ data: usersData }))
    .catch(() => response.status(500).send({ message: 'На сервере произошла ошибка' }));
}

function getUser(request, response) {
  User.findById(request.params.id)
    .then((userData) => {
      userData ? response.send({ data: userData }) : response.status(404).send({ message: 'Такого пользователя нет' });
    })
    .catch(() => response.status(404).send({ message: 'Такого пользователя нет' }));
}

function postUser(request, response) {
  const { email, password, name, about, avatar } = request.body;
  bcrypt.hash(password, 10)
    .then((passwordHash) => User.create({ email, password: passwordHash, name, about, avatar })
      .then((newUserData) => response.send({ data: newUserData }))
      .catch((error) => response.status(400).send({ message: error.message }))
    )
}

function updateProfileName(request, response) {
  User.findByIdAndUpdate(
    request.user._id,
    { name: request.body.name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedData) => {
      updatedData ? response.send({ data: updatedData }) : response.status(404).send({ message: 'Такого пользователя нет' });
    })
    .catch(() => response.status(500).send({ message: 'На сервере произошла ошибка или не пройдена валидация' }));
}

function updateAvatar(request, response) {
  User.findByIdAndUpdate(
    request.user._id,
    { avatar: request.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((updatedData) => {
      updatedData ? response.send({ data: updatedData }) : response.status(404).send({ message: 'Такого пользователя нет' });
    })
    .catch(() => response.status(500).send({ message: 'На сервере произошла ошибка или не пройдена валидация' }));
}

function login(request, response) {
  const { email, password } = request.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        secretKey,
        { expiresIn: '7d' }
      );
      response.send({ token });
    })
    .catch((error) => response.status(401).send({ message: error.message }));
}

module.exports = {
  getUsers,
  getUser,
  postUser,
  updateProfileName,
  updateAvatar,
  login,
};
