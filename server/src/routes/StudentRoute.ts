import express from 'express';
import { PrismaClient } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();
import {Request, Response} from 'express'
import StudentController from '../controllers/StudentController';

router.get('/', StudentController.getAllStudents);

router.get('/:id', StudentController.getStudentDetails);

export default router;
