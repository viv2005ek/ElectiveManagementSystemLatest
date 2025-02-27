import express from "express";
import SemesterController from "../controllers/SemesterController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Semesters
 *   description: API for managing semesters
 */

/**
 * @swagger
 * /semesters:
 *   get:
 *     summary: Get all semesters
 *     tags: [Semesters]
 *     responses:
 *       200:
 *         description: List of all semesters
 */
router.get(
  "/",
  authorizeRoles([UserRole.Admin]),
  SemesterController.getAllSemesters,
);

/**
 * @swagger
 * /semesters/{id}:
 *   get:
 *     summary: Get a semester by ID
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Semester details
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  SemesterController.getSemesterById,
);

/**
 * @swagger
 * /semesters:
 *   post:
 *     summary: Create a new semester
 *     tags: [Semesters]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *             properties:
 *               number:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Semester created successfully
 */
router.post(
  "/",
  authorizeRoles([UserRole.Admin]),
  SemesterController.createSemester,
);

/**
 * @swagger
 * /semesters/{id}:
 *   put:
 *     summary: Update a semester
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - number
 *             properties:
 *               number:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Semester updated successfully
 */
router.put(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  SemesterController.updateSemester,
);

/**
 * @swagger
 * /semesters/{id}:
 *   delete:
 *     summary: Delete a semester
 *     tags: [Semesters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Semester deleted successfully
 */
router.delete(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  SemesterController.deleteSemester,
);

export default router;
