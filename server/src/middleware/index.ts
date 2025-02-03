import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';

export const setupMiddleware = (app: Express) => {
  app.use(cors({ origin: '*', credentials: true }));
  app.use(express.json());
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(cookieParser());
};
