import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SubjectTypeController = {
  // Get all subject types
  getAllSubjectTypes: async (req: Request, res: Response): Promise<any> => {
    try {
      const subjectTypes = await prisma.subjectType.findMany({});
      res.json(subjectTypes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subject types" });
    }
  },

  // Get a single subject type by ID
  getSubjectTypeById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const subjectType = await prisma.subjectType.findUnique({
        where: { id },
        include: {
          subjects: true,
          courses: true,
        },
      });

      if (!subjectType) {
        return res.status(404).json({ error: "Subject type not found" });
      }

      res.json(subjectType);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subject type" });
    }
  },

  // Create a new subject type
  createSubjectType: async (req: Request, res: Response): Promise<any> => {
    const { name, description, allotmentType, scope } = req.body;

    try {
      const newSubjectType = await prisma.subjectType.create({
        data: {
          name,
          description,
          allotmentType,
          scope,
        },
      });

      res.status(201).json(newSubjectType);
    } catch (error) {
      res.status(500).json({ error: "Failed to create subject type" });
    }
  },

  // Update a subject type by ID
  updateSubjectType: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedSubjectType = await prisma.subjectType.update({
        where: { id },
        data: updateData,
      });

      res.json(updatedSubjectType);
    } catch (error) {
      res.status(500).json({ error: "Failed to update subject type" });
    }
  },

  // Delete a subject type by ID
  deleteSubjectType: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      await prisma.subjectType.delete({
        where: { id },
      });

      res.json({ message: "Subject type deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete subject type" });
    }
  },
};

export default SubjectTypeController;
