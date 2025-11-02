// controllers/passwordController.ts
import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import bcrypt from 'bcrypt';

interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    const { currentPassword, newPassword, confirmPassword }: ChangePasswordInput = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirm password are required'
      });
      return;
    }

    // Check if new password matches confirm password
    if (newPassword !== confirmPassword) {
      res.status(400).json({
        success: false,
        message: 'New password and confirm password do not match'
      });
      return;
    }

    // Validate password strength
    if (newPassword.length < 4) {
      res.status(400).json({
        success: false,
        message: 'New password must be at least 4 characters long'
      });
      return;
    }

    // Find user based on role
    let user;
    let credential;

    switch (userRole) {
      case 'Admin':
        user = await prisma.admin.findUnique({
          where: { id: userId, isDeleted: false },
          include: { credential: true }
        });
        break;
      case 'Student':
        user = await prisma.student.findUnique({
          where: { id: userId, isDeleted: false },
          include: { credential: true }
        });
        break;
      case 'Professor':
        user = await prisma.professor.findUnique({
          where: { id: userId, isDeleted: false },
          include: { credential: true }
        });
        break;
      default:
        res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
        return;
    }

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    credential = user.credential;

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, credential.passwordHash);
    if (!isCurrentPasswordValid) {
      res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
      return;
    }

    // Check if new password is same as current password
    const isSamePassword = await bcrypt.compare(newPassword, credential.passwordHash);
    if (isSamePassword) {
      res.status(400).json({
        success: false,
        message: 'New password cannot be the same as current password'
      });
      return;
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password in transaction
    await prisma.$transaction(async (tx) => {
      await tx.credential.update({
        where: { id: credential.id },
        data: { 
          passwordHash: hashedNewPassword,
          updatedAt: new Date()
        }
      });
    });

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const validatePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Password is required'
      });
      return;
    }

    // Find user based on role
    let user;

    switch (userRole) {
      case 'Admin':
        user = await prisma.admin.findUnique({
          where: { id: userId, isDeleted: false },
          include: { credential: true }
        });
        break;
      case 'Student':
        user = await prisma.student.findUnique({
          where: { id: userId, isDeleted: false },
          include: { credential: true }
        });
        break;
      case 'Professor':
        user = await prisma.professor.findUnique({
          where: { id: userId, isDeleted: false },
          include: { credential: true }
        });
        break;
      default:
        res.status(400).json({
          success: false,
          message: 'Invalid user role'
        });
        return;
    }

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.credential.passwordHash);

    res.status(200).json({
      success: true,
      data: {
        isValid: isPasswordValid
      }
    });

  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};