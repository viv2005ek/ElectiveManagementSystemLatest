import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Hello from the example route!' });
});

router.post('/', (req: Request, res: Response) => {
  const { name } = req.body;
  res.json({ message: `Hello, ${name}!` });
});

export default router;
