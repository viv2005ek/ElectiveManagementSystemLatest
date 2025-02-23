import { Router } from 'express';
import ProgramController from '../controllers/ProgramController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Programs
 *   description: Program management API
 */

/**
 * @swagger
 * /programs:
 *   get:
 *     summary: Get all programs
 *     tags: [Programs]
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter by department ID
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         description: Filter by school ID
 *       - in: query
 *         name: programType
 *         schema:
 *           type: string
 *           enum: [Undergraduate, Postgraduate, PhD]
 *         description: Filter by program type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search programs by name
 *     responses:
 *       200:
 *         description: List of programs
 */
router.get("/", ProgramController.getPrograms);

/**
 * @swagger
 * /programs/{id}:
 *   get:
 *     summary: Get a single program by ID
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The program ID
 *     responses:
 *       200:
 *         description: Program details
 *       404:
 *         description: Program not found
 */
router.get("/:id", ProgramController.getProgramById);

/**
 * @swagger
 * /programs:
 *   post:
 *     summary: Create a new program
 *     tags: [Programs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, departmentId, programType]
 *             properties:
 *               name:
 *                 type: string
 *               departmentId:
 *                 type: string
 *               programType:
 *                 type: string
 *                 enum: [Undergraduate, Postgraduate, PhD]
 *     responses:
 *       201:
 *         description: Program created successfully
 */
router.post("/", ProgramController.createProgram);

/**
 * @swagger
 * /programs/{id}:
 *   put:
 *     summary: Update an existing program
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The program ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               departmentId:
 *                 type: string
 *               programType:
 *                 type: string
 *                 enum: [Undergraduate, Postgraduate, PhD]
 *     responses:
 *       200:
 *         description: Program updated successfully
 *       404:
 *         description: Program not found
 */
router.put("/:id", ProgramController.updateProgram);

/**
 * @swagger
 * /programs/{id}:
 *   delete:
 *     summary: Delete a program
 *     tags: [Programs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The program ID
 *     responses:
 *       204:
 *         description: Program deleted successfully
 *       404:
 *         description: Program not found
 */
router.delete("/:id", ProgramController.deleteProgram);

export default router;
