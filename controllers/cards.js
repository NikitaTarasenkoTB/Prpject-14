const Card = require('../models/card');

function getCards(request, response) {
  Card.find({})
    .then((cardsData) => response.send({ data: cardsData }))
    .catch(() => response.status(500).send({ message: 'На сервере произошла ошибка' }));
}

function postCard(request, response) {
  const { name, link } = request.body;
  Card.create({ name, link, owner: request.user._id })
    .then((cardData) => response.send({ data: cardData }))
    .catch((error) => response.status(400).send({ message: error.message }));
}

function deleteCard(request, response) {
  Card.findByIdAndRemove(request.params.cardId)
    .then((cardData) => {
      if(cardData) {
        String(request.user._id) === String(cardData.owner) ? response.send({ data: cardData }) : response.status(401).send({ message: 'Нет прав' });
      } else {
        response.status(404).send({ message: 'Карточка не найдена' });
      }
    })
    .catch(() => response.status(404).send({ message: 'Карточка не найдена' }));
}

function addLike(request, response) {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $addToSet: { likes: request.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newLikeData) => {
      newLikeData ? response.send({ message: newLikeData }) : response.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch(() => response.status(500).send({ message: 'На сервере произошла ошибка' }));
}

function removeLike(request, response) {
  Card.findByIdAndUpdate(
    request.params.cardId,
    { $pull: { likes: request.user._id } },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newLikeData) => {
      newLikeData ? response.send({ message: newLikeData }) : response.status(404).send({ message: 'Карточка не найдена' });
    })
    .catch(() => response.status(500).send({ message: 'На сервере произошла ошибка' }));
}

module.exports = {
  getCards,
  postCard,
  deleteCard,
  addLike,
  removeLike,
};
