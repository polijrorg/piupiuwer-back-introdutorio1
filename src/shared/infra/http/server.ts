/* eslint-disable no-console */
import 'reflect-metadata';
import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';

import 'express-async-errors';

import '@shared/container';

import AppError from '@shared/errors/AppError';

import morgan from 'morgan';
import path from 'path';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', express.static(path.join(__dirname, '..', '..', '..', '..', 'docs')));
app.use(morgan('dev'));
app.use(routes);

app.get('/teste', (req: Request, res: Response) => {
  res.json({ message: 'Hello World' });
});

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
});

app.listen(process.env.PORT || 3333, () => {
  console.log(`🚀 \x1b[1;4;96mServer started on port ${process.env.PORT || 3333}\x1b[0m`);
});