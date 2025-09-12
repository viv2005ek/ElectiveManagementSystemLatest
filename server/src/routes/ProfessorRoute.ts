import express from "express";
import ProfessorController from "../controllers/ProfessorController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Professors
 *   description: API for managing professors
 */

/**
 * @swagger
 * /professors:
 *   get:
 *     summary: Get all professors
 *     tags: [Professors]
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter professors by department ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search professors by name, email, or registration number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of professors per page
 *     responses:
 *       200:
 *         description: List of all professors with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 professors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Professor'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       500:
 *         description: Unable to fetch professors
 */
router.get(
  "/",
  authorizeRoles([UserRole.Admin]),
  ProfessorController.getAllProfessors,
);

/**
 * @swagger
 * /professors/{id}:
 *   get:
 *     summary: Get a professor by ID
 *     tags: [Professors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The professor ID
 *     responses:
 *       200:
 *         description: Professor details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Professor'
 *       404:
 *         description: Professor not found
 *       500:
 *         description: Unable to fetch professor
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  ProfessorController.getProfessorById,
);

/**
 * @swagger
 * /professors:
 *   post:
 *     summary: Create a new professor
 *     tags: [Professors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - registrationNumber
 *               - departmentId
 *               - professorRankId
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               registrationNumber:
 *                 type: string
 *               departmentId:
 *                 type: string
 *               professorRankId:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Professor created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Unable to create professor
 */
router.post(
  "/",
  authorizeRoles([UserRole.Admin]),
  ProfessorController.createProfessor,
);

/**
 * @swagger
 * /professors/{id}:
 *   put:
 *     summary: Update a professor
 *     tags: [Professors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The professor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               middleName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               departmentId:
 *                 type: string
 *               professorRankId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Professor updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Professor not found
 *       500:
 *         description: Unable to update professor
 */
router.put(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  ProfessorController.updateProfessor,
);

/**
 * @swagger
 * /professors/{id}:
 *   delete:
 *     summary: Soft delete a professor
 *     tags: [Professors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The professor ID
 *     responses:
 *       200:
 *         description: Professor deleted successfully
 *       404:
 *         description: Professor not found
 *       500:
 *         description: Unable to delete professor
 */
router.delete(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  ProfessorController.deleteProfessor,
);

export default router;