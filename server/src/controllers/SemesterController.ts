import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SemesterController = {
  // Get all semesters
  getAllSemesters: async (req: Request, res: Response): Promise<any> => {
    try {
      const semesters = await prisma.semester.findMany();
      res.status(200).json(semesters);
    } catch (error) {
      console.error("Error fetching semesters:", error);
      res.status(500).json({ message: "Unable to fetch semesters" });
    }
  },

  // Get a single semester by ID
  getSemesterById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const semester = await prisma.semester.findUnique({
        where: { id },
      });

      if (!semester) {
        return res.status(404).json({ message: "Semester not found" });
      }

      res.status(200).json(semester);
    } catch (error) {
      console.error("Error fetching semester:", error);
      res.status(500).json({ message: "Unable to fetch semester" });
    }
  },

  // Create a new semester
  createSemester: async (req: Request, res: Response): Promise<any> => {
    const { number } = req.body;

    try {
      const existingSemester = await prisma.semester.findUnique({
        where: { number },
      });

      if (existingSemester) {
        return res
          .status(400)
          .json({ message: "Semester number already exists" });
      }

      const semester = await prisma.semester.create({
        data: { number },
      });

      res.status(201).json(semester);
    } catch (error) {
      console.error("Error creating semester:", error);
      res.status(500).json({ message: "Unable to create semester" });
    }
  },

  // Update a semester
  updateSemester: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { number } = req.body;

    try {
      const semester = await prisma.semester.update({
        where: { id },
        data: { number },
      });

      res.status(200).json(semester);
    } catch (error) {
      console.error("Error updating semester:", error);
      res.status(500).json({ message: "Unable to update semester" });
    }
  },

  // Delete a semester
  deleteSemester: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      await prisma.semester.delete({ where: { id } });
      res.status(200).json({ message: "Semester deleted successfully" });
    } catch (error) {
      console.error("Error deleting semester:", error);
      res.status(500).json({ message: "Unable to delete semester" });
    }
  },
};

export default SemesterController;
