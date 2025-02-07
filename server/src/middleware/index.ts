import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express, { Express } from "express";

export const setupMiddleware = (app: Express) => {
  app.use(cors({ origin: "*", credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));
  app.use(cookieParser());
};
