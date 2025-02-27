import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../prismaClient";

const authMiddleware = async (
  req: Request,
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
        professor: true,
        admin: true,
      },
    });

    if (!credential) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    req.user = {
      id: credential.id,
      role: credential.role,
      student: credential.student,
      faculty: credential.professor,
      admin: credential.admin,
    };

    next();
  } catch (error) {
    console.error("JWT verification or database error:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default authMiddleware;
