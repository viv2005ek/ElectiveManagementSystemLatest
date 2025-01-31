import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();
import {Request, Response} from 'express'

router.get('/', async (req: Request, res: Response) => {
  try {
    const students = await prisma.student.findMany({
      select: {
        firstName: true,
        lastName: true,
        registrationNumber: true,
        semester: true,
        DepartmentName: true,
      },
    });



    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
