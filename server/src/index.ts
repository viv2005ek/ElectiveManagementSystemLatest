import express, { Request, Response } from 'express';
import { env } from './config/env';
import logger from './utils/logger';
import { setupMiddleware } from './middleware';
import { setupRoutes } from './routes';
import swaggerDocs from './utils/swagger';

const app = express();
const port = env.PORT;

setupMiddleware(app);
setupRoutes(app);
swaggerDocs(app, 8080);

app.get("/health-check", async (req: Request, res: Response) => {
  res
    .status(200)
    .json({ msg: "Server is online.", timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
