import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';
import { UserRole } from '../types/UserTypes'; // Define roles: Admin, Faculty, Student

const authController = {
  loginController: async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      let user = null;
      let role: UserRole | null = null;

      // Check Admin table
      user = await prisma.adminCredential.findUnique({ where: { email } });
      if (user) {
        role = UserRole.Admin;
      }

      // Check Faculty table if not found in Admin
      if (!user) {
        user = await prisma.facultyCredential.findUnique({ where: { email } });
        if (user) {
          role = UserRole.Faculty;
        }
      }

      // Check Student table if not found in Admin or Faculty
      if (!user) {
        user = await prisma.studentCredential.findUnique({ where: { email } });
        if (user) {
          role = UserRole.Student;
        }
      }

      // If no user is found
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate JWT
      const token = jwt.sign(
        { id: user.id, email: user.email, role },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      // Set the JWT cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'Login successful',
        role,
      });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'An error occurred during login' });
    }
  },

  registerController: async (req: Request, res: Response): Promise<any> => {
    const { registrationNumber, email, password, firstName, lastName } = req.body;

    if (!registrationNumber || !email || !password || !firstName) {
      return res.status(400).json({ message: 'All required fields must be provided' });
    }

    try {
      const existingAdmin = await prisma.adminCredential.findUnique({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin with this email already exists' });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newAdmin = await prisma.adminCredential.create({
        data: {
          registrationNumber,
          email,
          passwordHash: hashedPassword,
        },
      });
      await prisma.admin.create({
        data: {
          id: newAdmin.id,
          registrationNumber,
          email,
          firstName,
          lastName,
        },
      });

      return res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
      console.error('Error during registration:', error);
      return res.status(500).json({ message: 'An error occurred during registration' });
    }
  },
};

export default authController;
