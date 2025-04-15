import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../prismaClient";
import bcrypt, { hash } from "bcrypt";
import { UserRole } from "@prisma/client";

const AuthController = {
  loginController: async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    try {
      // Fetch credential and related user details in a single query
      const credential = await prisma.credential.findUnique({
        where: { email },
        include: {
          admin: true,
          professor: true,
          student: true,
        },
      });

      if (!credential) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        credential.passwordHash,
      );
      if (!isPasswordValid) {
        res.status(401).json({ message: "Invalid email or password" });
        return;
      }

      // Determine role
      const role = credential.admin
        ? "Admin"
        : credential.professor
          ? "Professor"
          : credential.student
            ? "Student"
            : null;

      if (!role) {
        res.status(401).json({ message: "Invalid user role" });
        return;
      }

      // Generate JWT
      const token = jwt.sign(
        { id: credential.id, email: credential.email, role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" },
      );

      // Set cookie
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });

      res.status(200).json({
        message: "Login successful",
        role,
      });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ message: "An error occurred during login" });
    }
  },

  registerController: async (req: Request, res: Response): Promise<any> => {
    const { registrationNumber, email, password, firstName, lastName } =
      req.body;

    if (!registrationNumber || !email || !password || !firstName) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    try {
      const existingCredential = await prisma.credential.findUnique({
        where: { email },
      });
      if (existingCredential) {
        return res
          .status(400)
          .json({ message: "Admin with this email already exists" });
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await hash(password, salt);

      const newCredential = await prisma.credential.create({
        data: {
          email,
          passwordHash: hashedPassword,
          role: UserRole.Admin, // Explicitly set role as ADMIN
        },
      });

      await prisma.admin.create({
        data: {
          registrationNumber,
          email,
          firstName,
          lastName,
          credentialId: newCredential.id,
        },
      });

      return res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
      console.error("Error during admin registration:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during registration" });
    }
  },

  logoutController: async (req: Request, res: Response): Promise<any> => {
    try {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true on production
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      });

      return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
      console.error("Error during logout:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during logout" });
    }
  },

  getUserDetails: async (req: Request, res: Response): Promise<any> => {
    try {
      const token = req.cookies.jwt;
      if (!token) {
        return res
          .status(401)
          .json({ message: "Unauthorized. Token not found" });
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string,
      ) as JwtPayload;
      if (!decoded.id) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const user = await prisma.credential.findUnique({
        where: { id: decoded.id },
        select: {
          role: true,
          student: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          professor: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
          admin: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { role, student, professor, admin } = user;
      const firstName =
        student?.firstName || professor?.firstName || admin?.firstName;
      const lastName =
        student?.lastName || professor?.lastName || admin?.lastName;

      res.json({ role, firstName, lastName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default AuthController;
