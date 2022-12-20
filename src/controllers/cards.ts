import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongoose';
import Card from '../models/card';
import NotFoundError from '../errors/notFoundErr';
import BadRequestError from '../errors/badRequestErr';
import ForbiddenError from '../errors/forbiddenErr';

export const getCards = (req: Request, res: Response, next: NextFunction) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(next);

// eslint-disable-next-line consistent-return
export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  const foundCard = await Card.findById(req.params.cardId);
  try {
    if (foundCard && foundCard.owner.toString() !== req.user._id) {
      throw new ForbiddenError('Нельзя удалить карточку, созданную другим пользователем');
    } else {
      return Card.findByIdAndDelete(req.params.cardId)
        .then((card) => {
          if (!card) {
            throw new NotFoundError('Карточка с указанным _id не найдена');
          }
          res.status(200).send({ message: 'Карточка успешно удалена' });
        })
        .catch(next);
    }
  } catch (err) {
    next(err);
  }
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании карточки');
      }
    })
    .catch(next);
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true, runValidators: true },
)
  .then((card) => {
    if (!card) {
      throw new NotFoundError('Передан несуществующий _id карточки');
    }
    res.status(200).send({ data: card });
  })
  .catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные для постановки лайка');
    }
  })
  .catch(next);

export const dislikeCard = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.cardId;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: req.user._id as ObjectId } },
    { new: true, runValidators: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные для постановки лайка');
      }
    })
    .catch(next);
};
