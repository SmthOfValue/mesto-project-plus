import { Request, Response, NextFunction } from 'express';
import { ICustomError } from '../errors/types';
import { SERVER_ERROR_CODE } from '../errors/constants';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err: ICustomError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = SERVER_ERROR_CODE, message } = err;
  res.status(statusCode).send({
    message: statusCode === SERVER_ERROR_CODE
      ? 'На сервере произошла ошибка'
      : message,
  });
};

export default errorHandler;
