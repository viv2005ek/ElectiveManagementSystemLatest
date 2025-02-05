import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const programmeElectiveController = {

  // Get all standalone (independent) programme electives
  getAllProgrammeStandaloneElectives: async (req: Request, res: Response): Promise<any> => {
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
  getAllProgrammeElectivesUnderMinorSpecializations: async (req: Request, res: Response): Promise<any> => {
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
};

export default programmeElectiveController;
