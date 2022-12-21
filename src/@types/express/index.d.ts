import { ObjectId } from 'mongoose';

// расширение типа Request, иначе поле user у Request не проходит проверку типов
declare global {
  // eslint-disable-next-line no-unused-vars
  namespace Express {
    // eslint-disable-next-line no-unused-vars
    interface Request {
      user: { _id: string | ObjectId }
    }
  }
}
