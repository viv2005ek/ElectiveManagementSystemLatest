import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

export const getProfessorRanks = async (req: Request, res: Response): Promise<any> => {
  try {
    const professorRanks = await prisma.professorRank.findMany({
      orderBy: { id: 'asc' }
    });
    
    res.status(200).json({ professorRanks });
  } catch (error) {
    console.error("Error fetching professor ranks:", error);
    res.status(500).json({ message: "Unable to fetch professor ranks" });
  }
};

export const getProfessorRankById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const professorRank = await prisma.professorRank.findUnique({
      where: { id: String(id) }
    });
    
    if (!professorRank) {
      return res.status(404).json({ message: "Professor rank not found" });
    }
    
    res.status(200).json({ professorRank });
  } catch (error) {
    console.error("Error fetching professor rank:", error);
    res.status(500).json({ message: "Unable to fetch professor rank" });
  }
};