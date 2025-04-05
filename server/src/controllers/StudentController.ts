import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { hash } from "bcrypt";
import { UserRole } from "@prisma/client";

const studentController = {
  // Get all students (excluding deleted ones)
  getAllStudents: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        programId,
        batchId,
        semester,
        departmentId,
        schoolId,
        search,
        page = 1,
        pageSize = 10,
      } = req.query;

      // Build the where condition dynamically
      const where: any = { isDeleted: false };

      if (programId) {
        where.programId = String(programId);
      }
      if (batchId) {
        where.batchId = String(batchId);
      }
      if (semester) {
        where.semester = Number(semester);
      }
      if (departmentId) {
        where.program = { departmentId: String(departmentId) };
      }
      if (schoolId) {
        where.program = { department: { schoolId: String(schoolId) } };
      }

      // Ensure search is a string before using split()
      if (typeof search === "string" && search.trim() !== "") {
        const searchTerms = search
          .trim()
          .split(" ")
          .map((term) => ({
            contains: term,
            mode: "insensitive",
          }));

        where.OR = [
          {
            AND: [
              { firstName: searchTerms[0] },
              searchTerms[1] ? { middleName: searchTerms[1] } : {},
              searchTerms[2] ? { lastName: searchTerms[2] } : {},
            ],
          },
          {
            AND: [
              { firstName: searchTerms[0] },
              searchTerms[1] ? { lastName: searchTerms[1] } : {},
            ],
          },
          { registrationNumber: { contains: search, mode: "insensitive" } },
        ];
      }

      // Get total count of filtered students
      const totalStudents = await prisma.student.count({ where });
      const totalPages = Math.ceil(totalStudents / Number(pageSize));

      // Apply pagination AFTER filtering
      const students = await prisma.student.findMany({
        where,
        include: {
          program: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  id: true,
                  name: true,
                  school: { select: { id: true, name: true } },
                },
              },
            },
          },
          batch: {
            select: {
              id: true,
              year: true,
            },
          },
        },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        orderBy: { registrationNumber: "asc" }, // Sorting by registration number
      });

      res.status(200).json({
        students,
        totalPages,
        currentPage: Number(page),
        pageSize: Number(pageSize),
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Unable to fetch students" });
    }
  },

  // Get a student by ID
  getStudentById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const student = await prisma.student.findUnique({
        where: { id },
        include: {
          program: {
            select: {
              id: true,
              name: true,
              department: {
                select: {
                  id: true,
                  name: true,
                  school: { select: { id: true, name: true } },
                },
              },
            },
          },
          batch: {
            select: {
              id: true,
              year: true,
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
          programId: student.programId,
          batchId: student.batchId,
          gender: student.gender,
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
              program: { connect: { id: student.programId } },
              batch: { connect: { id: student.batchId } },
              gender: student.gender,
              credential: {
                create: {
                  email: student.email,
                  passwordHash: student.password,
                  role: UserRole.Student,
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
