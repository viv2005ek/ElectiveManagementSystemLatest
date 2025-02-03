import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const programmeElectiveController = {
  getAllProgrammeStandaloneElectives: async (req: Request, res: Response): Promise<any> => {
    try {
      const programmeElectives = await prisma.programmeElective.findMany({
        where: {
          isStandalone: true,
        },
        include: {
          minorSpecialization: true,
        },
      });

      res.status(200).json(programmeElectives);
    } catch (error) {
      console.error("Error fetching Programme Electives:", error);
      res.status(500).json({ message: "Unable to fetch Programme Electives" });
    }
  },

  getAllProgrammeElectivesUnderMinorSpecializations: async (req: Request, res: Response): Promise<any> => {
    try {
      const programmeElectives = await prisma.programmeElective.findMany({
        where: {
          minorSpecializationId: { not: null },
        },
        include: {
          minorSpecialization: true,
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
