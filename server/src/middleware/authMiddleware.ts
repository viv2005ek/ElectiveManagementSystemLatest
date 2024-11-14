import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET;

export const verifyToken: RequestHandler = (req: Request, res: Response, next: Function): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  try {
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is missing' });
    }

    const decoded = jwt.verify(token, JWT_SECRET); // Verifies the token with the secret key
    req.user = decoded; // Attach decoded user info to the request object (optional)
    next(); // Allow the request to proceed to the next middleware or route handler
  } catch (error) {
    return res.status(400).json({ error: 'Invalid or expired token.' });
  }
};
