import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import { CreateProfessorRankInput, UpdateProfessorRankInput } from '../types/professorRank';

export const createProfessorRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, priority }: CreateProfessorRankInput = req.body;

    // Validate input
    if (!name || priority === undefined) {
      res.status(400).json({
        success: false,
        message: 'Name and priority are required'
      });
      return;
    }

    // Check if professor rank already exists
    const existingRank = await prisma.professorRank.findUnique({
      where: { name }
    });

    if (existingRank) {
      res.status(409).json({
        success: false,
        message: 'Professor rank with this name already exists'
      });
      return;
    }

    const professorRank = await prisma.professorRank.create({
      data: {
        name,
        priority
      }
    });

    res.status(201).json({
      success: true,
      data: professorRank,
      message: 'Professor rank created successfully'
    });
  } catch (error) {
    console.error('Error creating professor rank:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getAllProfessorRanks = async (req: Request, res: Response): Promise<void> => {
  try {
    const professorRanks = await prisma.professorRank.findMany({
      orderBy: {
        priority: 'asc'
      }
    });

    res.status(200).json({
      success: true,
      data: professorRanks,
      count: professorRanks.length
    });
  } catch (error) {
    console.error('Error fetching professor ranks:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const getProfessorRankById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const professorRank = await prisma.professorRank.findUnique({
      where: { id }
    });

    if (!professorRank) {
      res.status(404).json({
        success: false,
        message: 'Professor rank not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: professorRank
    });
  } catch (error) {
    console.error('Error fetching professor rank:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const updateProfessorRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData: UpdateProfessorRankInput = req.body;

    // Check if professor rank exists
    const existingRank = await prisma.professorRank.findUnique({
      where: { id }
    });

    if (!existingRank) {
      res.status(404).json({
        success: false,
        message: 'Professor rank not found'
      });
      return;
    }

    // If name is being updated, check for duplicates
    if (updateData.name && updateData.name !== existingRank.name) {
      const duplicateRank = await prisma.professorRank.findUnique({
        where: { name: updateData.name }
      });

      if (duplicateRank) {
        res.status(409).json({
          success: false,
          message: 'Professor rank with this name already exists'
        });
        return;
      }
    }

    const updatedProfessorRank = await prisma.professorRank.update({
      where: { id },
      data: updateData
    });

    res.status(200).json({
      success: true,
      data: updatedProfessorRank,
      message: 'Professor rank updated successfully'
    });
  } catch (error) {
    console.error('Error updating professor rank:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const deleteProfessorRank = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if professor rank exists
    const existingRank = await prisma.professorRank.findUnique({
      where: { id }
    });

    if (!existingRank) {
      res.status(404).json({
        success: false,
        message: 'Professor rank not found'
      });
      return;
    }

    // Check if any professors are using this rank
    const professorsWithRank = await prisma.professor.findFirst({
      where: { professorRankId: id }
    });

    if (professorsWithRank) {
      res.status(400).json({
        success: false,
        message: 'Cannot delete professor rank that is assigned to professors'
      });
      return;
    }

    await prisma.professorRank.delete({
      where: { id }
    });

    res.status(200).json({
      success: true,
      message: 'Professor rank deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting professor rank:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};