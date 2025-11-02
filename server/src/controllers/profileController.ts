// controllers/profileController.ts
import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export const getStudentProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming student ID is available from auth middleware
    const studentId = (req as any).user?.id;

    if (!studentId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Student ID not found'
      });
      return;
    }

    const student = await prisma.student.findUnique({
      where: { 
        id: studentId,
        isDeleted: false 
      },
      include: {
        program: {
          include: {
            department: {
              include: {
                school: true
              }
            }
          }
        },
        batch: true
      }
    });

    if (!student) {
      res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
      return;
    }

    const profile = {
      name: `${student.firstName}${student.middleName ? ` ${student.middleName}` : ''}${student.lastName ? ` ${student.lastName}` : ''}`,
      registrationNumber: student.registrationNumber,
      email: student.email,
      personalInformation: {
        contactNumber: student.contactNumber
      },
      academicInformation: {
        program: student.program.name,
        semester: `Semester ${student.semester}`,
        batch: student.batch.year.toString(),
        department: student.program.department.name,
        school: student.program.department.school.name
      },
      contactInformation: {
        emailAddress: student.email,
        registrationNumber: student.registrationNumber
      }
    };

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAdminProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // Assuming admin ID is available from auth middleware
    const adminId = (req as any).user?.id;

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized: Admin ID not found'
      });
      return;
    }

    const admin = await prisma.admin.findUnique({
      where: { 
        id: adminId,
        isDeleted: false 
      },
      include: {
        credential: {
          select: {
            role: true,
            createdAt: true
          }
        }
      }
    });

    if (!admin) {
      res.status(404).json({
        success: false,
        message: 'Admin profile not found'
      });
      return;
    }

    const profile = {
      firstName: admin.firstName,
      lastName: admin.lastName || '',
      email: admin.email,
      registrationNumber: admin.registrationNumber,
      createdDate: admin.createdAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      role: admin.credential.role
    };

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};