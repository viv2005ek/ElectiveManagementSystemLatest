import express, { Application, Request, Response } from 'express';
import authRoute from './routes/authRoute';

const app: Application = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());

// Routes
app.use('/auth', authRoute)

// Health Check Route
app.get('/', (req: Request, res: Response) => {
  res.send('API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
