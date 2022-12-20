import { ObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import UnauthorizedError from '../errors/unauthorizedErr';

// расширение типа Request, иначе поле user у Request не проходит проверку типов
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars, no-shadow
    interface Request {
      user: { _id: string | ObjectId }
    }
  }
}

// eslint-disable-next-line consistent-return
export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key') as jwt.JwtPayload;
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = { _id: payload._id };
  next();
};
