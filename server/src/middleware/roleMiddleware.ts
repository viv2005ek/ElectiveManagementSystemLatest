import { NextFunction, Response } from "express";
import { UserRole } from "@prisma/client";

// Since you have extended the Request type globally, you shouldn't need to import AuthenticatedRequest
// Your custom `user` property will be available on req automatically.
export const authorizeRoles = (allowedRoles: UserRole[]) => {
  return (req: Express.Request, res: Response, next: NextFunction): void => {
    // Explicitly cast req to the extended Request type, if needed
    const authenticatedReq = req as Express.Request & {
      user: { role: UserRole };
    };

    if (!authenticatedReq.user) {
      res.status(401).json({ message: "Unauthorized. Please log in." });
      return;
    }

    if (!allowedRoles.includes(authenticatedReq.user.role)) {
      console.log("User's role", authenticatedReq.user.role);
      console.log("Required roles", allowedRoles);
      res.status(403).json({ message: "Access denied" });
      return;
    }

    next();
  };
};
