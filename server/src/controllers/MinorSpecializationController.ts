import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const minorSpecializationController = {

  // Get all minor specializations
  getAllMinorSpecializations: async (req: Request, res: Response): Promise<any> => {
    try {
      const minorSpecializations = await prisma.minorSpecialization.findMany({
        where: {
          isDeleted: false, // Filter out deleted minor specializations
        },
        include: {
          department: true, // Include related department
          programmeElectives: true, // Include related programme electives
        },
      });

      res.status(200).json(minorSpecializations);
    } catch (error) {
      console.error("Error fetching Minor Specializations:", error);
      res.status(500).json({ message: "Unable to fetch Minor Specializations" });
    }
  },

  // Get minor specialization by ID
  getMinorSpecializationById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      const minorSpecialization = await prisma.minorSpecialization.findUnique({
        where: {
          isDeleted: false, // Filter out deleted minor specialization
          id
        },
        include: {
          department: true, // Include related department
          programmeElectives: true, // Include related programme electives
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
