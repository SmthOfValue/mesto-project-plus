import { ICustomError } from './types';
import { FORBIDDEN_ERROR_CODE } from './constants';

class ForbiddenError extends Error implements ICustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = FORBIDDEN_ERROR_CODE;
  }
}

export default ForbiddenError;
