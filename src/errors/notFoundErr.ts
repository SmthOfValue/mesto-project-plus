import { ICustomError } from './types';
import { NOT_FOUND_ERROR_CODE } from './constants';

export class NotFoundError extends Error implements ICustomError {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = NOT_FOUND_ERROR_CODE;
  }
}

export default NotFoundError;
