import { Prisma, ProgramType } from '@prisma/client';
import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const ProgramController = {
  getPrograms: async (req: Request, res: Response): Promise<any> => {
    try {
      const { departmentId, schoolId, programType, search } = req.query;

      const where: Prisma.ProgramWhereInput = {
        departmentId: departmentId ? String(departmentId) : undefined,
        department: schoolId ? { schoolId: String(schoolId) } : undefined,
        programType: programType ? (programType as ProgramType) : undefined,
        name: search
          ? { contains: String(search), mode: "insensitive" }
          : undefined,
      };

      const programs = await prisma.program.findMany({
        where,
        include: {
          department: { include: { school: true } },
        },
      });

      res.status(200).json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  getProgramById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const program = await prisma.program.findUnique({
        where: { id },
        include: {
          department: { include: { school: true } },
          students: true,
          subjects: true,
        },
      });

      if (!program) return res.status(404).json({ error: "Program not found" });

      res.status(200).json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  createProgram: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, departmentId, programType } = req.body;

      const newProgram = await prisma.program.create({
        data: { name, departmentId, programType },
      });

      res.status(201).json(newProgram);
    } catch (error) {
      console.error("Error creating program:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  updateProgram: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, departmentId, programType } = req.body;

      const updatedProgram = await prisma.program.update({
        where: { id },
        data: { name, departmentId, programType },
      });

      res.status(200).json(updatedProgram);
    } catch (error) {
      console.error("Error updating program:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

  deleteProgram: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;

      await prisma.program.delete({ where: { id } });

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting program:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default ProgramController;
