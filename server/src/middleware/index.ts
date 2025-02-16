import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import express, { Express } from "express";

export const setupMiddleware = (app: Express) => {
  import cors from "cors";

  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true, // Allow cookies
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE"],
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(process.env.NODE_ENV === "production" ? "tiny" : "dev"));
  app.use(cookieParser());
};
