import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';
import { AdminCredential } from '@prisma/client';

export interface CustomRequest extends Request {
  user?: AdminCredential;
}

const verifyAdmin = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
    const admin = await prisma.adminCredential.findUnique({
      where: { id: decoded.id },
    });

    if (!admin) {
      return res.status(403).json({ message: 'Forbidden: Not an admin user' });
    }

    // Attach the admin info to the request object
    req.user = admin;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error('JWT verification or database error:', error);
    return res.status(401).json({ message: 'Unauthorized: Invalid token or user not found' });
  }
};

export default verifyAdmin;
