import { ObjectId } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

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

const fakeAuth = (req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '63989960affb7b7d756a799a',
  };

  next();
};

export default fakeAuth;
