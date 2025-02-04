import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const departmentController = {

  // Get all departments
  getAllDepartments: async (req: Request, res: Response): Promise<any> => {
    try {
      const departments = await prisma.department.findMany({
        select: {
          id: true,
          name: true
        },
        where: {
          isDeleted: false,
        },
      });
      return res.status(200).json(departments);
    } catch (error) {
      console.error('Error fetching departments:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get department by ID
  getDepartmentById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const department = await prisma.department.findUnique({
        where: {
          id,
          isDeleted: false, // Ensure only non-deleted department is fetched
        },
        include: {
          branches: true, // Include associated branches
          minorSpecializations: true, // Include associated minor specializations
          faculty: true, // Include associated faculty
          student: true, // Include associated students
        },
      });

      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }

      return res.status(200).json(department);
    } catch (error) {
      console.error('Error fetching department:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  },
};

export default departmentController;
