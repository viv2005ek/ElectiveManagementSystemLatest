import { Request, Response } from "express";
import { AllotmentType, PrismaClient, SubjectScope } from "@prisma/client";

const prisma = new PrismaClient();

const SubjectTypeController = {
  getAllSubjectTypes: async (req: Request, res: Response): Promise<void> => {
    try {
      const { allotmentType } = req.query;

      let filter: any = {
        where: {
          isDeleted: false, // Ensure only non-deleted records are fetched
        },
      };

      if (allotmentType) {
        if (
          !Object.values(AllotmentType).includes(allotmentType as AllotmentType)
        ) {
          res.status(400).json({ error: "Invalid allotment type" });
          return;
        }
        filter.where.allotmentType = allotmentType as AllotmentType;
      }

      const subjectTypes = await prisma.subjectType.findMany(filter);
      console.log(`Found ${subjectTypes.length} subject types`);

      res.status(200).json(subjectTypes);
    } catch (error: any) {
      console.error("Error fetching subject types:", error);
      res.status(500).json({ error: "Failed to fetch subject types" });
    }
  },
  getSubjectTypeById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const subjectType = await prisma.subjectType.findUnique({
        where: { id },
      });

      if (!subjectType) {
        res.status(404).json({ error: "Subject type not found" });
        return;
      }

      res.status(200).json(subjectType);
    } catch (error: any) {
      console.error("Error fetching subject type:", error);
      res.status(500).json({ error: "Failed to fetch subject type" });
    }
  },

  createSubjectType: async (req: Request, res: Response): Promise<void> => {
    const { name, description, allotmentType, scope } = req.body;

    if (!name || !allotmentType || !scope) {
      res
        .status(400)
        .json({ error: "Name, allotmentType, and scope are required" });
      return;
    }

    if (!Object.values(AllotmentType).includes(allotmentType)) {
      res.status(400).json({ error: "Invalid allotment type" });
      return;
    }

    if (!Object.values(SubjectScope).includes(scope)) {
      res.status(400).json({ error: "Invalid scope" });
      return;
    }

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
    } catch (error: any) {
      console.error("Error creating subject type:", error);
      if (error.code === "P2002") {
        res
          .status(400)
          .json({ error: "A subject type with this name already exists" });
      } else {
        res.status(500).json({ error: "Failed to create subject type" });
      }
    }
  },

  updateSubjectType: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, description, scope } = req.body;

    if (scope && !Object.values(SubjectScope).includes(scope)) {
      res.status(400).json({ error: "Invalid scope" });
      return;
    }

    try {
      const existingSubjectType = await prisma.subjectType.findUnique({
        where: { id },
      });

      if (!existingSubjectType) {
        res.status(404).json({ error: "Subject type not found" });
        return;
      }

      const updatedSubjectType = await prisma.subjectType.update({
        where: { id },
        data: {
          name,
          description,
          scope,
        },
      });

      res.status(200).json(updatedSubjectType);
    } catch (error: any) {
      console.error("Error updating subject type:", error);
      if (error.code === "P2002") {
        res
          .status(400)
          .json({ error: "A subject type with this name already exists" });
      } else {
        res.status(500).json({ error: "Failed to update subject type" });
      }
    }
  },

  deleteSubjectType: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const existingSubjectType = await prisma.subjectType.findUnique({
        where: { id },
      });

      if (!existingSubjectType) {
        res.status(404).json({ error: "Subject type not found" });
        return;
      }

      await prisma.subjectType.update({
        where: { id },
        data: { isDeleted: true },
      });

      res
        .status(200)
        .json({ message: "Subject type marked as deleted successfully" });
    } catch (error: any) {
      console.error("Error marking subject type as deleted:", error);
      res.status(500).json({ error: "Failed to mark subject type as deleted" });
    }
  },
};

export default SubjectTypeController;
