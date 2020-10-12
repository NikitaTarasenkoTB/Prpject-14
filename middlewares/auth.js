const jwt = require('jsonwebtoken');
module.exports = (request, response, next) => {
  const secretKey = '420a1d5c32303bc96677d77d89567a75802b9843b86009274b46b592943fd940';
  const { authorization } = request.headers;
  if(!authorization || !authorization.startsWith('Bearer ')) {
    return response.status(401).send({ message: 'Необходимо авторизоваться' })
  }
  const token = authorization.replace('Bearer ', '');
  let userId;

  try {
    userId = jwt.verify(token, secretKey);
  } catch (err) {
    return response.status(401).send({ message: 'Необходимо авторизоваться' });
  }

  request.user = userId;
  next();
}