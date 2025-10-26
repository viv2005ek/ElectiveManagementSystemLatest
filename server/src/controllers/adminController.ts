import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import bcrypt from 'bcrypt';
import { CreateAdminInput, UpdateAdminInput } from '../types/admin';

export const createAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { registrationNumber, email, firstName, middleName, lastName, password }: CreateAdminInput = req.body;

    // Validate input
    if (!registrationNumber || !email || !firstName || !password) {
      res.status(400).json({
        success: false,
        message: 'Registration number, email, first name, and password are required'
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
      return;
    }

    // Check if admin already exists with email or registration number
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        OR: [
          { email },
          { registrationNumber }
        ]
      }
    });

    if (existingAdmin) {
      const duplicateField = existingAdmin.email === email ? 'email' : 'registration number';
      res.status(409).json({
        success: false,
        message: `Admin with this ${duplicateField} already exists`
      });
      return;
    }

    // Check if email exists in credentials table
    const existingCredential = await prisma.credential.findUnique({
      where: { email }
    });

    if (existingCredential) {
      res.status(409).json({
        success: false,
        message: 'This email is already registered in the system'
      });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create credential first
    const credential = await prisma.credential.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role: 'Admin'
      }
    });

    // Create admin
    const admin = await prisma.admin.create({
      data: {
        registrationNumber,
        email,
        firstName,
        middleName,
        lastName,
        credentialId: credential.id
      },
      include: {
        credential: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: admin,
      message: 'Admin created successfully'
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllAdmins = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    let whereClause: any = {
      isDeleted: false
    };

    if (search) {
      whereClause.OR = [
        { firstName: { contains: search as string, mode: 'insensitive' } },
        { lastName: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { registrationNumber: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const [admins, totalCount] = await Promise.all([
      prisma.admin.findMany({
        where: whereClause,
        include: {
          credential: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true
            }
          }
        },
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.admin.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limitNum);

    res.status(200).json({
      success: true,
      data: admins,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalCount,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAdminById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const admin = await prisma.admin.findUnique({
      where: { id, isDeleted: false },
      include: {
        credential: {
          select: {
            id: true,
            email: true,
            role: true,
            createdAt: true
          }
        }
      }
    });

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    console.error('Error fetching admin:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateAdminInput = req.body;

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id, isDeleted: false }
    });

    if (!existingAdmin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
      return;
    }

    // Validate email format if email is being updated
    if (updateData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updateData.email)) {
        res.status(400).json({
          success: false,
          message: 'Please provide a valid email address'
        });
        return;
      }
    }

    // Check for duplicate email in Admin table
    if (updateData.email && updateData.email !== existingAdmin.email) {
      const duplicateAdmin = await prisma.admin.findFirst({
        where: {
          id: { not: id },
          isDeleted: false,
          email: updateData.email
        }
      });

      if (duplicateAdmin) {
        res.status(409).json({
          success: false,
          message: 'Another admin with this email already exists'
        });
        return;
      }

      // Check for duplicate email in Credential table
      const duplicateCredential = await prisma.credential.findUnique({
        where: { email: updateData.email }
      });

      if (duplicateCredential) {
        res.status(409).json({
          success: false,
          message: 'This email is already registered in the system'
        });
        return;
      }
    }

    // Check for duplicate registration number
    if (updateData.registrationNumber && updateData.registrationNumber !== existingAdmin.registrationNumber) {
      const duplicateRegistration = await prisma.admin.findFirst({
        where: {
          id: { not: id },
          isDeleted: false,
          registrationNumber: updateData.registrationNumber
        }
      });

      if (duplicateRegistration) {
        res.status(409).json({
          success: false,
          message: 'Another admin with this registration number already exists'
        });
        return;
      }
    }

    // Update admin and credential (if email changed) in transaction
    const updatedAdmin = await prisma.$transaction(async (tx) => {
      // Update credential if email changed
      if (updateData.email && updateData.email !== existingAdmin.email) {
        await tx.credential.update({
          where: { id: existingAdmin.credentialId },
          data: { email: updateData.email }
        });
      }

      // Update admin
      return await tx.admin.update({
        where: { id },
        data: updateData,
        include: {
          credential: {
            select: {
              id: true,
              email: true,
              role: true,
              createdAt: true
            }
          }
        }
      });
    });

    res.status(200).json({
      success: true,
      data: updatedAdmin,
      message: 'Admin updated successfully'
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    
    // Handle Prisma unique constraint errors
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      res.status(409).json({
        success: false,
        message: 'A record with this email or registration number already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { id, isDeleted: false }
    });

    if (!existingAdmin) {
      res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
      return;
    }

    // Soft delete admin
    await prisma.admin.update({
      where: { id },
      data: { isDeleted: true }
    });

    res.status(200).json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};