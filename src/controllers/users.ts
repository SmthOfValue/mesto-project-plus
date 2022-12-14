import { Request, Response } from 'express';
import { Schema } from 'mongoose';
import User from '../models/user';
import { BAD_REQUEST_ERROR_CODE, NOT_FOUND_ERROR_CODE, SERVER_ERROR_CODE } from '../errors/constants';
// import {NotFoundError} from '../errors/notFoundErr';
// import {BadRequestError} from '../errors/badRequestErr';

export const getUsers = (req: Request, res: Response) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(() => res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' }));

export const getUserById = (req: Request, res: Response) => User.findById(req.params.userId)
  .then((user) => {
    if (!user) {
      const error = new Error('Пользователь по указанному _id не найден');
      error.name = 'UserNotFoundError';
      throw error;
    }
    res.status(201).send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'UserNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    } else {
      res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
    }
  });

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;
  return User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      } else {
        res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
      }
    });
};

const findByIdAndUpdateUser = (
  res: Response,
  id: string | Schema.Types.ObjectId,
  updateObject: Record<string, string>,
  options = {
    new: true,
  },
) => User.findByIdAndUpdate(id, updateObject, options)
  .then((user) => {
    if (!user) {
      const error = new Error('Пользователь по указанному _id не найден');
      error.name = 'UserNotFoundError';
      throw error;
    }
    res.status(200).send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      res.status(BAD_REQUEST_ERROR_CODE).send({ message: 'Переданы некорректные данные при обновлении профиля или аватара' });
    } else if (err.name === 'UserNotFoundError') {
      res.status(NOT_FOUND_ERROR_CODE).send({ message: err.message });
    }
    res.status(SERVER_ERROR_CODE).send({ message: 'Произошла ошибка' });
  });

export const updateUserInfo = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  findByIdAndUpdateUser(
    res,
    _id,
    { name, about },
  );
};

export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  findByIdAndUpdateUser(
    res,
    _id,
    { avatar },
  );
};
