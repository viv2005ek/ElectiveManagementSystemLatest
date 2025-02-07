import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const programmeElectiveController = {
  // Get all standalone (independent) programme electives
  getAllProgrammeStandaloneElectives: async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    try {
      const programmeElectives = await prisma.programmeElective.findMany({
        where: {
          isIndependentCourse: true,
          isDeleted: false, // Ensure only non-deleted programme electives
        },
        include: {
          minorSpecialization: true, // Include associated minor specialization details
        },
      });

      res.status(200).json(programmeElectives);
    } catch (error) {
      console.error("Error fetching Programme Electives:", error);
      res.status(500).json({ message: "Unable to fetch Programme Electives" });
    }
  },

  // Get all programme electives under minor specializations
  getAllProgrammeElectivesUnderMinorSpecializations: async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    try {
      const programmeElectives = await prisma.programmeElective.findMany({
        where: {
          minorSpecializationId: { not: null },
          isDeleted: false, // Ensure only non-deleted programme electives
        },
        include: {
          minorSpecialization: true, // Include associated minor specialization details
        },
      });

      res.status(200).json(programmeElectives);
    } catch (error) {
      console.error("Error fetching Programme Electives:", error);
      res.status(500).json({ message: "Unable to fetch Programme Electives" });
    }
  },
  bulkCreateProgrammeElectives: async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    try {
      const programmeElectivesData = req.body;

      if (
        !Array.isArray(programmeElectivesData) ||
        programmeElectivesData.length === 0
      ) {
        return res.status(400).json({
          message: "Invalid input. Expected an array of programme electives.",
        });
      }

      const createdProgrammeElectives =
        await prisma.programmeElective.createMany({
          data: programmeElectivesData,
          skipDuplicates: true, // Avoid duplicate entries if courseCode is unique
        });

      res.status(201).json({
        message: "Programme electives created successfully",
        count: createdProgrammeElectives.count,
      });
    } catch (error) {
      console.error("Error creating programme electives:", error);
      res.status(500).json({ message: "Unable to create programme electives" });
    }
  },

  bulkAddProgrammeElectivesToMinorSpecialization: async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    try {
      const { minorSpecializationId, programmeElectives } = req.body;

      if (
        !minorSpecializationId ||
        !Array.isArray(programmeElectives) ||
        programmeElectives.length === 0
      ) {
        return res.status(400).json({
          message:
            "Invalid input. Provide a minorSpecializationId and an array of programmeElectives.",
        });
      }

      const minorSpecialization = await prisma.minorSpecialization.findUnique({
        where: { id: minorSpecializationId },
      });

      if (!minorSpecialization) {
        return res
          .status(404)
          .json({ message: "Minor Specialization not found." });
      }

      const formattedElectives = programmeElectives.map((elective) => ({
        ...elective,
        minorSpecializationId,
      }));

      await prisma.programmeElective.createMany({
        data: formattedElectives,
      });

      res
        .status(201)
        .json({ message: "Programme electives added successfully." });
    } catch (error) {
      console.error("Error adding programme electives:", error);
      res.status(500).json({ message: "Unable to add programme electives." });
    }
  },
};

export default programmeElectiveController;
