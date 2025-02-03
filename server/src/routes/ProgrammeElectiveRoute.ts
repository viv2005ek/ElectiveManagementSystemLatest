import express from 'express';
import programmeElectiveController from '../controllers/ProgrammeElectiveController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProgrammeElectives
 *   description: API for managing programme electives
 */

/**
 * @swagger
 * /programme-electives/standalone:
 *   get:
 *     summary: Get all standalone programme electives
 *     tags: [ProgrammeElectives]
 *     responses:
 *       200:
 *         description: List of all standalone programme electives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProgrammeElective'
 *       500:
 *         description: Internal server error
 */
router.get('/standalone', programmeElectiveController.getAllProgrammeStandaloneElectives);

/**
 * @swagger
 * /programme-electives/under-minor-specializations:
 *   get:
 *     summary: Get all programme electives under minor specializations
 *     tags: [ProgrammeElectives]
 *     responses:
 *       200:
 *         description: List of all programme electives under minor specializations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProgrammeElective'
 *       500:
 *         description: Internal server error
 */
router.get('/under-minor-specializations', programmeElectiveController.getAllProgrammeElectivesUnderMinorSpecializations);

export default router;
