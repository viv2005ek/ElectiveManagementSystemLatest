import express, { Application, Request, Response } from 'express';
import exampleRoute from './routes/exampleRoute';

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes
app.use('/api/example', exampleRoute);

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
