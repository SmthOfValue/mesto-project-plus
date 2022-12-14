import { Request, Response } from 'express';
import { ICustomError } from '../errors/types';
// централизованная обработка ошибок не применяется в первой проектной работе
const errorHandler = (err: ICustomError, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
};

export default errorHandler;
