import { Request, Response } from 'express';
import { ObjectId } from 'mongoose';
import { BAD_REQUEST_ERROR_CODE, NOT_FOUND_ERROR_CODE, SERVER_ERROR_CODE } from '../errors/constants';
import Card from '../models/card';

// import {NotFoundError} from '../errors/notFoundErr'
// import {BadRequestError} from '../errors/badRequestErr';

export const getCards = (req: Request, res: Response) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));

// eslint-disable-next-line consistent-return
export const deleteCardById = async (req: Request, res: Response) => {
  const foundCard = await Card.findById(req.params.cardId);
  if (foundCard && foundCard.owner.toString() !== req.user._id) {
    res.status(403).send({ message: 'Нельзя удалить карточку, созданную другим пользователем' });
  } else {
    return Card.findByIdAndDelete(req.params.cardId)
      .then((card) => {
        if (!card) {
          const error = new Error('Карточка с указанным _id не найдена');
          error.name = 'CardNotFoundError';
          throw error;
        }
        res.status(200).send({ message: 'Карточка успешно удалена' });
      })
      .catch((err) => {
        if (err.name === 'CardNotFoundError') {
          res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
        } else {
          res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
        }
      });
  }
};

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

export const likeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) {
      const error = new Error('Передан несуществующий _id карточки');
      error.name = 'CardNotFoundError';
      throw error;
    }
    res.status(200).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для постановки лайка' });
    } else if (err.name === 'CardNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    }
  });

export const dislikeCard = (req: Request, res: Response) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user?._id as ObjectId } },
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) {
      const error = new Error('Передан несуществующий _id карточки');
      error.name = 'CardNotFoundError';
      throw error;
    }
    res.status(200).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные для снятия лайка' });
    } else if (err.name === 'CardNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    }
  });
