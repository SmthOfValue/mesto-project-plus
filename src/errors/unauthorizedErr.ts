import { ICustomError } from './types';
import { UNAUTHORIZED_ERROR_CODE } from './constants';

class UnauthorizedError extends Error implements ICustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR_CODE;
  }
}

export default UnauthorizedError;
