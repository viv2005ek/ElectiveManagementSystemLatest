import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 8080,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
};
