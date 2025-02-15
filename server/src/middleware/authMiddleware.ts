import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient";
import { UserRole } from "@prisma/client";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
    student?: any;
    faculty?: any;
    admin?: any;
  };
}

const authMiddleware = async (
  req: AuthenticatedRequest,
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

    const credential = await prisma.credential.findUnique({
      where: { id: decoded.id },
      include: {
        student: true,
        faculty: true,
        admin: true,
      },
    });

    if (!credential) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = {
      id: credential.id,
      role: credential.role,
      student: credential.student || null,
      faculty: credential.faculty || null,
      admin: credential.admin || null,
    };

    next();
  } catch (error) {
    console.error("JWT verification or database error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
