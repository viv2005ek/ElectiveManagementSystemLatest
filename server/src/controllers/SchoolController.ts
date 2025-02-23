import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const SchoolController = {
  async createSchool(req: Request, res: Response): Promise<any> {
    try {
      const { name, facultyId } = req.body;

      if (!name || !facultyId) {
        return res
          .status(400)
          .json({ message: "Name and facultyId are required" });
      }

      const school = await prisma.school.create({
        data: { name, facultyId },
      });

      return res.status(201).json(school);
    } catch (error) {
      console.error("Error creating school:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get all schools
  async getAllSchools(req: Request, res: Response): Promise<any> {
    try {
      const { facultyId } = req.query; // Extract facultyId from query params

      const schools = await prisma.school.findMany({
        where: facultyId ? { facultyId: String(facultyId) } : {}, // Apply filter if facultyId exists
        include: { faculty: true },
      });

      return res.status(200).json(schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Get a single school by ID
  async getSchoolById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const school = await prisma.school.findUnique({
        where: { id },
        include: { faculty: true, departments: true },
      });

      if (!school) {
        return res.status(404).json({ message: "School not found" });
      }

      return res.status(200).json(school);
    } catch (error) {
      console.error("Error fetching school:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Update a school
  async updateSchool(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { name, facultyId } = req.body;

      const existingSchool = await prisma.school.findUnique({ where: { id } });

      if (!existingSchool) {
        return res.status(404).json({ message: "School not found" });
      }

      const updatedSchool = await prisma.school.update({
        where: { id },
        data: { name, facultyId },
      });

      return res.status(200).json(updatedSchool);
    } catch (error) {
      console.error("Error updating school:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  // Delete a school
  async deleteSchool(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      const existingSchool = await prisma.school.findUnique({ where: { id } });

      if (!existingSchool) {
        return res.status(404).json({ message: "School not found" });
      }

      await prisma.school.delete({ where: { id } });

      return res.status(200).json({ message: "School deleted successfully" });
    } catch (error) {
      console.error("Error deleting school:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default SchoolController;
