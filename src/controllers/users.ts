import { Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import { Request } from '../@types/express/index';
import User from '../models/user';
import NotFoundError from '../errors/notFoundErr';
import BadRequestError from '../errors/badRequestErr';
import UnauthorizedError from '../errors/unauthorizedErr';
import ConflictError from '../errors/conflictErr';

export const getUsers = (req: Request, res: Response, next: NextFunction) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch(next);

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(201).send({ data: user });
    })
    .catch(next);
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные при создании пользователя');
      } else if (err.code === 11000) {
        throw new ConflictError('Пользователь с таким email уже существует');
      }
    })
    .catch(next);
};

const findByIdAndUpdateUser = (
  res: Response,
  id: string | Schema.Types.ObjectId,
  updateObject: Record<string, string>,
  next: NextFunction,
  options = {
    new: true,
    runValidators: true,
  },
) => User.findByIdAndUpdate(id, updateObject, options)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь по указанному _id не найден');
    }
    res.status(200).send({ data: user });
  })
  .catch((err) => {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      throw new BadRequestError('Переданы некорректные данные при обновлении профиля или аватара');
    }
  })
  .catch(next);

export const updateUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const { _id } = req.user;
  findByIdAndUpdateUser(
    res,
    _id,
    { name, about },
    next,
  );
};

export const updateUserAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const { _id } = req.user;
  findByIdAndUpdateUser(
    res,
    _id,
    { avatar },
    next,
  );
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
          res.send({ token });
        });
    })
    .catch(next);
};

export const getMyUserInfo = (req: Request, res: Response, next: NextFunction) => {
  const { _id } = req.user;
  return User.findOne({ _id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь по указанному _id не найден');
      }
      res.status(200).send({ data: user });
    })
    .catch(next);
};
