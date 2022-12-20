import { ICustomError } from './types';
import { CONFLICT_ERROR_CODE } from './constants';

class ConflictError extends Error implements ICustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT_ERROR_CODE;
  }
}

export default ConflictError;
