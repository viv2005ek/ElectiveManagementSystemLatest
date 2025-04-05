import { prisma } from "../prismaClient";
import { Request, Response } from "express";

const FacultyController = {
  getAllFaculties: async (req: Request, res: Response): Promise<any> => {
    try {
      const faculties = await prisma.faculty.findMany({
        include: { schools: true },
      });
      res.json(faculties);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch faculties" });
    }
  },

  getFacultyById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const faculty = await prisma.faculty.findUnique({
        where: { id },
        include: { schools: true },
      });
      if (!faculty) return res.status(404).json({ error: "Faculty not found" });
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch faculty" });
    }
  },

  createFaculty: async (req: Request, res: Response): Promise<any> => {
    try {
      const { name, schoolIds } = req.body;
      const faculty = await prisma.faculty.create({
        data: {
          name,
          schools: { connect: schoolIds?.map((id: string) => ({ id })) || [] },
        },
      });
      res.status(201).json(faculty);
    } catch (error) {
      res.status(500).json({ error: "Failed to create faculty" });
    }
  },

  updateFaculty: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, schoolIds } = req.body;
      const faculty = await prisma.faculty.update({
        where: { id },
        data: {
          name,
          schools: { set: schoolIds?.map((id: string) => ({ id })) || [] },
        },
      });
      res.json(faculty);
    } catch (error) {
      res.status(500).json({ error: "Failed to update faculty" });
    }
  },

  deleteFaculty: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      await prisma.faculty.delete({ where: { id } });
      res.json({ message: "Faculty deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete faculty" });
    }
  },
};

export default FacultyController;
