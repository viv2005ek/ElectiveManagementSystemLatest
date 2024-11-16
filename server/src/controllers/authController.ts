import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../prismaClient';
import { UserRole } from '../types/UserTypes';

const authController = {

  adminLoginController: async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const admin = await prisma.adminCredential.findUnique({
        where: { email },
      });

      if (!admin) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: admin.id, email: admin.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' }
      );

      // Set the JWT cookie using the res.cookie() method.
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
      });

      return res.status(200).json({
        message: 'Login successful',
        role: UserRole.Admin
      });
    } catch (error) {
      console.error('Error during admin login:', error);
      return res.status(500).json({ message: 'An error occurred during login' });
    }
  },
};

export default authController;
