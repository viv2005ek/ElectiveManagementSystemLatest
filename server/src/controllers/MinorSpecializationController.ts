import {Request, Response} from 'express'
import { prisma } from '../prismaClient';


const minorSpecializationController = {

  getAllMinorSpecializations: async (req: Request, res: Response): Promise<any> => {
    try {
      const minorSpecializations = await prisma.minorSpecialization.findMany({
        include: {
          department: true,
        },
      });

      res.status(200).json(minorSpecializations);
    } catch (error) {
      console.error("Error fetching Minor Specializations:", error);
      res.status(500).json({ message: "Unable to fetch Minor Specializations" });
    }
  },

  createMinorSpecialization: async (req: Request, res: Response): Promise<any> => {
    const { name, departmentId, programmeElectiveIds } = req.body;

    if (!name) {
      return res.status(400).json({ msg: 'Missing required field: name' });
    }
    if (!departmentId) {
      return res.status(400).json({ msg: 'Missing required field: departmentId' });
    }
    if (!programmeElectiveIds || programmeElectiveIds.length === 0) {
      return res.status(400).json({ msg: 'Missing required field: programmeElectiveIds' });
    }

    try {
      const newMinorSpecialization = await prisma.minorSpecialization.create({
        data: {
          name,
          department: {
            connect: {
              id: departmentId,
            },
          },
          programmeElectives: {
            connect: programmeElectiveIds.map((electiveId: string) => ({ id: electiveId })),
          },
        },
      });

      res.status(201).json({
        msg: 'Minor Specialization created successfully',
        minorSpecialization: newMinorSpecialization,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Unable to create Minor Specialization' });
    }
  },
};

export default minorSpecializationController;
