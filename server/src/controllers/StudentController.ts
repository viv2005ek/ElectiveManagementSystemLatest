import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const studentController = {

  // Get all students with related department and branch
  getAllStudents: async (req: Request, res: Response): Promise<any> => {
    try {
      const students = await prisma.student.findMany({
        where: {
          isDeleted: false, // Filter out deleted students
        },

        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          branch: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      // Map through the result to return the necessary fields
      const selectedStudents = students.map(student => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        registrationNumber: student.registrationNumber,
        semester: student.semester,
        department: student.department,
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
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          branch: {
            select: {
              id: true,
              name: true,
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
        return res.status(404).json({ message: 'Student not found or has been deleted' });
      }

      const studentDetails = {
        firstName: student.firstName,
        lastName: student.lastName,
        registrationNumber: student.registrationNumber,
        contactNumber: student.contactNumber,
        department: student.department,
        branch: student.branch,
        semester: student.semester,
        email: student.email,
        section: student.section,
        batch: student.batch,
        gender: student.gender,
        minorSpecialization: student.minorSpecialization,
        profilePictureId: student.profilePictureId,
      };

      res.status(200).json(studentDetails);
    } catch (error) {
      console.error('Error fetching student details:', error);
      res.status(500).json({ message: 'Unable to fetch student details' });
    }
  },

  // Update student details
  updateStudent: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { registrationNumber, email, semester, departmentId, branchId } = req.body;

    if (!registrationNumber || !email || !semester || !departmentId || !branchId) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
      const updatedStudent = await prisma.student.update({
        where: { id },
        data: {
          registrationNumber,
          email,
          semester,
          department: { connect: { id: departmentId } }, // Update department reference
          branch: { connect: { id: branchId } }, // Update branch reference
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
