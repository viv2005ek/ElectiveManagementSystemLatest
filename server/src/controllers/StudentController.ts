import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../prismaClient';

const studentController = {

  createUser: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { registrationNumber, email, password } = req.body;

    if (!registrationNumber || !email || !password) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const newStudentCredential = await prisma.studentCredential.create({
        data: {
          registrationNumber,
          email,
          passwordHash,
        },
      });

      res.status(201).json({
        msg: 'Student created successfully',
        studentCredential: newStudentCredential,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Internal Server Error' });
    }
  },

  getAllStudents: async (req: Request, res: Response): Promise<void> => {
    try {
      const students = await prisma.student.findMany();
      res.status(200).json(students);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Unable to fetch students" });
    }
  },

  updateStudent: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { registrationNumber, email, semester, DepartmentId, DepartmentName, BranchId, BranchName } = req.body;

    if (!registrationNumber || !email || !semester || !DepartmentId || !DepartmentName || !BranchId || !BranchName) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
      const updatedStudent = await prisma.student.update({
        where: { id },
        data: {
          registrationNumber,
          email,
          semester,
          DepartmentId,
          DepartmentName,
          BranchId,
          BranchName,
        },
      });

      res.status(200).json({
        msg: 'Student updated successfully',
        student: updatedStudent,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Unable to update student' });
    }
  },

  deleteStudent: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const deletedStudent = await prisma.student.delete({
        where: { id },
      });

      res.status(200).json({
        msg: 'Student deleted successfully',
        student: deletedStudent,
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Unable to delete student' });
    }
  },
};

export default studentController;
