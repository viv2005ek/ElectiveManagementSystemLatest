import cluster from "cluster";
import os from "os";
import express, { Request, Response } from "express";
import { env } from "./config/env";
import logger from "./utils/logger";
import { setupMiddleware } from "./middleware";
import { setupRoutes } from "./routes";
import swaggerDocs from "./utils/swagger";
import rateLimit from "express-rate-limit";

const numCPUs = os.cpus().length;

if (process.env.NODE_ENV === "production" && cluster.isPrimary) {
  logger.info(`Primary process ${process.pid} is running`);

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

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per windowMs
    message: {
      message: "Too many requests from this IP, please try again later.",
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  });

  // Apply the rate limiter globally
  app.use(apiLimiter);

  setupMiddleware(app);
  swaggerDocs(app, 8080);
  setupRoutes(app);

  app.get("/health-check", async (req: Request, res: Response) => {
    res
      .status(200)
      .json({ msg: "Server is online.", timestamp: new Date().toISOString() });
  });

  app.listen(port, () => {
    logger.info(
      `Server is running on port ${port} (Worker: ${process.pid || "Single"})`,
    );
  });
}
