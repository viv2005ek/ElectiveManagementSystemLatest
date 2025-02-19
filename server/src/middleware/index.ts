import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';

export const setupMiddleware = (app: Express) => {
  app.use(
    cors({
      origin: [
        "https://elective-management-system.vercel.app", // Updated frontend URL
        "http://localhost:3000", // For local development
      ],
      credentials: true, // Allow cookies
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );

  // Handle preflight requests
  app.options("*", cors());

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));
  app.use(cookieParser());
};
