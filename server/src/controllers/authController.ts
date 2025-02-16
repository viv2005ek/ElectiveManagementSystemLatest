import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "../prismaClient";
import { UserRole } from "../types/UserTypes";
import bcrypt, { hash } from "bcrypt";

const authController = {
  loginController: async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    try {
      // Find the credential
      const credential = await prisma.credential.findUnique({
        where: { email },
      });

      if (!credential) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(
        password,
        credential.passwordHash,
      );
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Determine the role by checking linked tables
      let role: UserRole | null = null;

      const admin = await prisma.admin.findUnique({
        where: { credentialId: credential.id },
      });
      if (admin) role = UserRole.ADMIN;

      const faculty = await prisma.faculty.findUnique({
        where: { credentialId: credential.id },
      });
      if (faculty) role = UserRole.FACULTY;

      const student = await prisma.student.findUnique({
        where: { credentialId: credential.id },
      });
      if (student) role = UserRole.STUDENT;

      if (!role) {
        return res.status(401).json({ message: "Invalid user role" });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: credential.id, email: credential.email, role },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" },
      );

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // true on production
        sameSite: "lax",
        maxAge: 60 * 60 * 1000, // 1 hour
      });

      return res.status(200).json({
        message: "Login successful",
        role,
      });
    } catch (error) {
      console.error("Error during login:", error);
      return res
        .status(500)
        .json({ message: "An error occurred during login" });
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
          role: UserRole.ADMIN, // Explicitly set role as ADMIN
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
        sameSite: "lax",
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
        return res.status(401).json({ message: "Unauthorized" });
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
          id: true,
          email: true,
          role: true,
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              registrationNumber: true,
              semester: true,
              batch: true,
              branch: { select: { id: true, name: true } },
            },
          },
          faculty: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              registrationNumber: true,
              department: { select: { id: true, name: true } },
            },
          },
          admin: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              registrationNumber: true,
            },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default authController;
