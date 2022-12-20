import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import { errors } from 'celebrate';
import errorHandler from './middlewares/errorHandler';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import auth from './middlewares/auth';
import rateLimiter from './middlewares/rateLimiter';
import { login, createUser } from './controllers/users';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateLoginCredentials, validateSignUpData } from './middlewares/validators';
import NotFoundError from './errors/notFoundErr';

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use(rateLimiter);

app.use(helmet());

app.use(requestLogger);

app.post('/signin', validateLoginCredentials, login);
app.post('/signup', validateSignUpData, createUser);

app.use(auth);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
// eslint-disable-next-line no-unused-vars
app.get('*', (req: Request, res: Response) => {
  throw new NotFoundError('Запрашиваемая страница не существует');
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
