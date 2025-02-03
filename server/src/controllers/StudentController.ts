import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const studentController = {

  getAllStudents: async (req: Request, res: Response): Promise<any> => {
    try {
      const students = await prisma.student.findMany({
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
        // Remove select from top level and include fields in `select`
      }).then((students) => {
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
      });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Unable to fetch students" });
    }
  },

  getStudentDetails: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // Get student id from route parameters

    try {
      const student = await prisma.student.findUnique({
        where: {
          id, // Use the provided id to find the student
        },
        include: {
          department: { // Include the department relation
            select: {
              id: true,
              name: true,
            },
          },
          branch: { // Include the branch relation
            select: {
              id: true,
              name: true,
            },
          },
          minorSpecialization: { // Include the minor specialization relation
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
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
          department: { connect: { id: DepartmentId } }, // Fixing department update
          branch: { connect: { id: BranchId } }, // Fixing branch update
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
