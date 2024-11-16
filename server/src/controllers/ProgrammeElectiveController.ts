import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const programmeElectiveController = {
  getAllProgrammeElectives: async (req: Request, res: Response): Promise<any> => {
    try {
      const programmeElectives = await prisma.programmeElective.findMany({
        include: {
          MinorSpecialization: true,
        },
      });

      res.status(200).json(programmeElectives);
    } catch (error) {
      console.error("Error fetching Programme Electives:", error);
      res.status(500).json({ message: "Unable to fetch Programme Electives" });
    }
  },

  createProgrammeElective: async (req: Request, res: Response): Promise<any> => {
    const { courseCode, name, semester, minorSpecializationId } = req.body;

    if (!courseCode || !name || !semester) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
      const newProgrammeElective = await prisma.programmeElective.create({
        data: {
          courseCode,
          name,
          semester,
          minorSpecializationId,
        },
      });

      res.status(201).json({
        msg: 'Programme Elective created successfully',
        programmeElective: newProgrammeElective,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Unable to create Programme Elective' });
    }
  },

  updateProgrammeElective: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    const { courseCode, name, semester, minorSpecializationId } = req.body;

    if (!courseCode || !name || !semester || !minorSpecializationId) {
      return res.status(400).json({ msg: 'Missing required fields' });
    }

    try {
      const updatedProgrammeElective = await prisma.programmeElective.update({
        where: { id },
        data: {
          courseCode,
          name,
          semester,
          minorSpecializationId,
        },
      });

      res.status(200).json({
        msg: 'Programme Elective updated successfully',
        programmeElective: updatedProgrammeElective,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Unable to update Programme Elective' });
    }
  },

  deleteProgrammeElective: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const deletedProgrammeElective = await prisma.programmeElective.delete({
        where: { id },
      });

      res.status(200).json({
        msg: 'Programme Elective deleted successfully',
        programmeElective: deletedProgrammeElective,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Unable to delete Programme Elective' });
    }
  }
}

export default programmeElectiveController
