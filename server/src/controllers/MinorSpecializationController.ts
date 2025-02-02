import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const minorSpecializationController = {

  getAllMinorSpecializations: async (req: Request, res: Response): Promise<any> => {
    try {
      const minorSpecializations = await prisma.minorSpecialization.findMany({
        include: {
          department: true,
          programmeElectives: true,
        },
      });

      res.status(200).json(minorSpecializations);
    } catch (error) {
      console.error("Error fetching Minor Specializations:", error);
      res.status(500).json({ message: "Unable to fetch Minor Specializations" });
    }
  },

  getMinorSpecializationById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const minorSpecialization = await prisma.minorSpecialization.findUnique({
        where: { id },
        include: {
          department: true,
          programmeElectives: true,
        },
      });

      if (!minorSpecialization) {
        return res.status(404).json({ message: "Minor Specialization not found" });
      }

      res.status(200).json(minorSpecialization);
    } catch (error) {
      console.error("Error fetching Minor Specialization by ID:", error);
      res.status(500).json({ message: "Unable to fetch Minor Specialization" });
    }
  },
};

export default minorSpecializationController;
