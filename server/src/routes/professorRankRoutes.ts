import { Router } from 'express';
import {
  createProfessorRank,
  getAllProfessorRanks,
  getProfessorRankById,
  updateProfessorRank,
  deleteProfessorRank
} from '../controllers/professorRankController';

const router = Router();

/**
 * @swagger
 * /professor-ranks:
 *   post:
 *     summary: Create a new professor rank
 *     tags: [Professor Ranks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - priority
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Distinguished Professor"
 *               priority:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Professor rank created successfully
 *       400:
 *         description: Bad request - missing required fields
 *       409:
 *         description: Conflict - professor rank already exists
 */
router.post('/', createProfessorRank);

/**
 * @swagger
 * /professor-ranks:
 *   get:
 *     summary: Get all professor ranks
 *     tags: [Professor Ranks]
 *     responses:
 *       200:
 *         description: List of all professor ranks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProfessorRank'
 */
router.get('/', getAllProfessorRanks);

/**
 * @swagger
 * /professor-ranks/{id}:
 *   get:
 *     summary: Get professor rank by ID
 *     tags: [Professor Ranks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Professor rank ID
 *     responses:
 *       200:
 *         description: Professor rank details
 *       404:
 *         description: Professor rank not found
 */
router.get('/:id', getProfessorRankById);

/**
 * @swagger
 * /professor-ranks/{id}:
 *   put:
 *     summary: Update professor rank
 *     tags: [Professor Ranks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Professor rank ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated Professor Rank"
 *               priority:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Professor rank updated successfully
 *       404:
 *         description: Professor rank not found
 *       409:
 *         description: Conflict - professor rank name already exists
 */
router.put('/:id', updateProfessorRank);

/**
 * @swagger
 * /professor-ranks/{id}:
 *   delete:
 *     summary: Delete professor rank
 *     tags: [Professor Ranks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Professor rank ID
 *     responses:
 *       200:
 *         description: Professor rank deleted successfully
 *       404:
 *         description: Professor rank not found
 *       400:
 *         description: Cannot delete - rank is assigned to professors
 */
router.delete('/:id', deleteProfessorRank);

export default router;