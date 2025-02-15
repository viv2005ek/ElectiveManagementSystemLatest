import { Response, NextFunction, RequestHandler } from "express";
import { AuthenticatedRequest } from "./authMiddleware";
import { UserRole } from "@prisma/client";

export const authorizeRoles = (allowedRoles: UserRole[]): RequestHandler => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized. Please log in." });
      return;
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};
