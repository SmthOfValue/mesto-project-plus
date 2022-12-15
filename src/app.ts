import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';
import fakeAuth from './middlewares/fakeAuth';
import rateLimiter from './middlewares/rateLimiter';
// import { errorHandler } from './middlewares/errorHandler';

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(rateLimiter);
app.use(helmet());
app.use(fakeAuth);
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// централизованная обработка ошибок не применяется в первой проектной работе
// app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
