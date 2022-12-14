import { ICustomError } from './types';
import { BAD_REQUEST_ERROR_CODE } from './constants';

class BadRequestError extends Error implements ICustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = BAD_REQUEST_ERROR_CODE;
  }
}

export default BadRequestError;
