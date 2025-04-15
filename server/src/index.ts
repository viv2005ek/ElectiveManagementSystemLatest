import cluster from "cluster";
import os from "os";
import express, { Request, Response } from "express";
import { env } from "./config/env";
import logger from "./utils/logger";
import { setupMiddleware } from "./middleware";
import { setupRoutes } from "./routes";
import swaggerDocs from "./utils/swagger";

const numCPUs = os.cpus().length;

if (process.env.NODE_ENV === "production" && cluster.isPrimary) {
  logger.info(`Primary process ${process.pid} is running`);

  // Fork workers for each CPU core
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Log when a worker exits
  cluster.on("exit", (worker, code, signal) => {
    logger.warn(`Worker ${worker.process.pid} exited with code ${code}`);
    // Optionally restart the worker
    cluster.fork();
  });
} else {
  const app = express();
  const port = env.PORT;

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
