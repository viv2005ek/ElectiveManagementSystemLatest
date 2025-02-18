import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { hash } from "bcrypt";
import { UserRole } from "@prisma/client";

const studentController = {
  // Get all students (excluding deleted ones)
  getAllStudents: async (req: Request, res: Response): Promise<any> => {
    try {
      const { departmentId, branchId, batch, search } = req.query;

      // Build the where condition dynamically
      const where: any = { isDeleted: false };

      if (branchId) {
        where.branchId = branchId;
      }

      if (batch) {
        where.batch = Number(batch);
      }

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { registrationNumber: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (departmentId) {
        where.branch = {
          departmentId: departmentId,
        };
      }

      const students = await prisma.student.findMany({
        where,
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json(students);
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({ message: 'Unable to fetch students' });
    }
  },

  // Get a student by ID
  getStudentById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          branch: {
            select: {
              id: true,
              name: true,
              department: {
                select: { id: true, name: true },
              },
            },
          },
        },
      });

      if (!student || student.isDeleted) {
        return res.status(404).json({ message: "Student not found" });
      }

      res.status(200).json(student);
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Unable to fetch student" });
    }
  },

  // Soft delete a student
  deleteStudent: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const student = await prisma.student.findUnique({ where: { id } });

      if (!student || student.isDeleted) {
        return res.status(404).json({ message: "Student not found" });
      }

      await prisma.student.update({
        where: { id },
        data: { isDeleted: true },
      });

      res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
      console.error("Error deleting student:", error);
      res.status(500).json({ message: "Unable to delete student" });
    }
  },

  // Bulk add students
  bulkAddStudents: async (req: Request, res: Response): Promise<any> => {
    const { students } = req.body;

    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Provide a valid student list" });
    }

    try {
      // Prepare students with hashed passwords
      const studentsWithHashedPasswords = await Promise.all(
        students.map(async (student) => ({
          firstName: student.firstName,
          lastName: student.lastName,
          registrationNumber: student.registrationNumber,
          contactNumber: student.contactNumber,
          email: student.email,
          semester: student.semester,
          batch: student.batch,
          gender: student.gender,
          branchId: student.branchId,
          password: await hash(student.password, 10),
        })),
      );

      // Insert students in a transaction
      const createdStudents = await prisma.$transaction(
        studentsWithHashedPasswords.map((student) =>
          prisma.student.create({
            data: {
              firstName: student.firstName,
              lastName: student.lastName,
              registrationNumber: student.registrationNumber,
              contactNumber: student.contactNumber,
              email: student.email,
              semester: student.semester,
              batch: student.batch,
              gender: student.gender,
              branch: { connect: { id: student.branchId } },
              credential: {
                create: {
                  email: student.email,
                  passwordHash: student.password,
                  role: UserRole.STUDENT,
                },
              },
            },
          }),
        ),
      );

      res.status(201).json({
        message: "Students added successfully",
        students: createdStudents,
      });
    } catch (error) {
      console.error("Error adding students:", error);
      res.status(500).json({ message: "Unable to add students" });
    }
  },
};

export default studentController;
