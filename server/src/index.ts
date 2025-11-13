import cluster from "cluster";
import os from "os";
import express, { Request, Response } from "express";
import { env } from "./config/env";
import logger from "./utils/logger";
import { setupMiddleware } from "./middleware";
import { setupRoutes } from "./routes";
import swaggerDocs from "./utils/swagger";
import rateLimit from "express-rate-limit";
import { UserRole } from "@prisma/client";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";


const numCPUs = os.cpus().length;
const isProduction = process.env.NODE_ENV === "production";

// Only use clustering in production
if (isProduction && cluster.isPrimary) {
  logger.info(`Primary process ${process.pid} is running in production mode`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Log when a worker exits
  cluster.on("exit", (worker, code, signal) => {
    logger.warn(
      `Worker ${worker.process.pid} exited with code ${code}, signal: ${signal}`,
    );
    // Restart the worker
    cluster.fork();
  });
} else {
  const app = express();
  const port = env.PORT;

  // Create rate limiter middleware for student routes
  const studentApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: {
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
      // Skip rate limiting if not in production
      if (!isProduction) return true;

      const userRole = req.user?.role;
      return userRole !== UserRole.Student;
    },
  });

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 login attempts per windowMs
    message: {
      message:
        "Too many login attempts from this IP, please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request) => {
      // Skip rate limiting if not in production
      return !isProduction;
    },
  });

  app.use(
    ["api/auth/login", "/api/auth/forgot-password", "/api/auth/reset-password"],
    loginLimiter,
  );

  setupMiddleware(app);

  // Apply student rate limiter to student-specific routes after auth middleware
  app.use(
    [
      "api/students/*",
      "api/subjects/*",
      "api/subject-preferences/*",
      "api/courses/*",
      "api/course-buckets/*",
    ],
    studentApiLimiter,
  );

  const apiRouter = express.Router();
  setupRoutes(apiRouter);

  app.use("/api", apiRouter);

  app.get("/api/health-check", async (req: Request, res: Response) => {
    res
      .status(200)
      .json({ msg: "Server is online.", timestamp: new Date().toISOString() });
  });
swaggerDocs(app, 8080);
// Swagger setup
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Elective Management System API",
      version: "1.0.0",
    },
     servers: [
      {
        url: "http://localhost:8080/api", // base path for all APIs
      },],
  },
  apis: ["./src/routes/*.ts","./src/routes/*.js"], // adjust if your routes live somewhere else
});

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.listen(port, () => {
    const mode = isProduction ? "production" : "development";
    const processType = cluster.isPrimary ? "Primary" : `Worker ${process.pid}`;
    logger.info(
      `Server is running in ${mode} mode on port ${port} (${processType})`,
    );
  });
}
