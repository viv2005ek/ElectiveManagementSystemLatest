import { Request, Response } from 'express';
import { AllotmentStatus, AllotmentType, Gender, ProgramType, UserRole } from '@prisma/client';

const EnumsController = {
  getGenders: (req: Request, res: Response): void => {
    res.status(200).json(Object.values(Gender));
  },

  getProgramTypes: (req: Request, res: Response): void => {
    res.status(200).json(Object.values(ProgramType));
  },

  getUserRoles: (req: Request, res: Response): void => {
    res.status(200).json(Object.values(UserRole));
  },

  getAllotmentTypes: (req: Request, res: Response): void => {
    res.status(200).json(Object.values(AllotmentType));
  },

  getAllotmentStatuses: (req: Request, res: Response): void => {
    res.status(200).json(Object.values(AllotmentStatus));
  },
};

export default EnumsController;
