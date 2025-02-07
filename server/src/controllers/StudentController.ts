import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { UserRole } from "../types/UserTypes";
import { hash } from "bcrypt";
const studentController = {
  // Get all students with related department and branch
  getAllStudents: async (req: Request, res: Response): Promise<any> => {
    try {
      const students = await prisma.student.findMany({
        where: {
          isDeleted: false, // Filter out deleted students
        },
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

      // Map through the result to return the necessary fields
      const selectedStudents = students.map((student) => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        registrationNumber: student.registrationNumber,
        semester: student.semester,
        branch: student.branch,
      }));

      res.status(200).json(selectedStudents);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Unable to fetch students" });
    }
  },

  // Get student details by ID
  getStudentDetails: async (req: Request, res: Response): Promise<any> => {
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
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          minorSpecialization: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!student || student.isDeleted) {
        return res
          .status(404)
          .json({ message: "Student not found or has been deleted" });
      }

      const studentDetails = {
        firstName: student.firstName,
        lastName: student.lastName,
        registrationNumber: student.registrationNumber,
        contactNumber: student.contactNumber,
        email: student.email,
        semester: student.semester,
        section: student.section,
        batch: student.batch,
        gender: student.gender,
        profilePictureId: student.profilePictureId,
        branch: {
          id: student.branch.id,
          name: student.branch.name,
          department: student.branch.department,
        },
        minorSpecialization: student.minorSpecialization
          ? {
              id: student.minorSpecialization.id,
              name: student.minorSpecialization.name,
            }
          : null,
      };

      res.status(200).json(studentDetails);
    } catch (error) {
      console.error("Error fetching student details:", error);
      res.status(500).json({ message: "Unable to fetch student details" });
    }
  },

  // Soft delete student (mark as deleted)
  deleteStudent: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const deletedStudent = await prisma.student.update({
        where: { id },
        data: {
          isDeleted: true, // Mark as deleted instead of physical deletion
        },
      });

      res.status(200).json({
        msg: "Student deleted successfully",
        student: deletedStudent,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: "Unable to delete student" });
    }
  },

  bulkAddStudents: async (req: Request, res: Response): Promise<any> => {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid input, expected an array of students" });
    }

    try {
      // Hash passwords for all students
      const studentsWithHashedPasswords = await Promise.all(
        students.map(async (student) => ({
          firstName: student.firstName,
          lastName: student.lastName,
          contactNumber: student.contactNumber,
          registrationNumber: student.registrationNumber,
          semester: student.semester,
          email: student.email,
          section: student.section,
          batch: student.batch,
          gender: student.gender,
          departmentId: student.departmentId,
          branchId: student.branchId,
          password: await hash(student.password, 10), // Hash password
        })),
      );

      // Insert students one by one (to include credentials)
      const createdStudents = await Promise.all(
        studentsWithHashedPasswords.map(async (student) => {
          return prisma.student.create({
            data: {
              firstName: student.firstName,
              lastName: student.lastName,
              contactNumber: student.contactNumber,
              registrationNumber: student.registrationNumber,
              semester: student.semester,
              email: student.email,
              section: student.section,
              batch: student.batch,
              gender: student.gender,
              branch: { connect: { id: student.branchId } },

              // Create associated credential
              credential: {
                create: {
                  email: student.email,
                  passwordHash: student.password,
                  role: UserRole.STUDENT,
                },
              },
            },
          });
        }),
      );

      res.status(201).json({
        message:
          "Students and credentials added successfully (duplicates skipped)",
        students: createdStudents,
      });
    } catch (error) {
      console.error("Error creating students:", error);
      res.status(500).json({ message: "Unable to bulk add students" });
    }
  },
};

export default studentController;
