import { Router } from "express";
import ProgramController from "../controllers/ProgramController";

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
 *         name: facultyId
 *         schema:
 *           type: string
 *         description: Filter by faculty ID
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Program'
 *       500:
 *         description: Internal server error
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       404:
 *         description: Program not found
 *       500:
 *         description: Internal server error
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Program not found
 *       500:
 *         description: Internal server error
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
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", ProgramController.deleteProgram);

export default router;
