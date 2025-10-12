import express from 'express';
import { getProfessorRanks, getProfessorRankById } from '../controllers/professorRankController';

const router = express.Router();

router.get('/', getProfessorRanks);
router.get('/:id', getProfessorRankById);

export default router;