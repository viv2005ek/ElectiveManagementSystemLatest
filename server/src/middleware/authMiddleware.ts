import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';
import { Credential, UserRole } from '@prisma/client';

export interface CustomRequest extends Request {
  user?: Credential;
}

const verifyAdmin = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): Promise<any> => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
    };

    // Fetch the credential by decoded ID
    const credential = await prisma.credential.findUnique({
      where: { id: decoded.id },
      include: {
        admin: true, // Ensure we include the Admin relation
      },
    });

    if (!credential || credential.role !== UserRole.ADMIN) {
      return res.status(403).json({ message: "Forbidden: Not an admin user" });
    }

    // Assign the full credential (admin data is embedded in it) to the request object
    req.user = credential;

    next();
  } catch (error) {
    console.error("JWT verification or database error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token or user not found" });
  }
};

export default verifyAdmin;
