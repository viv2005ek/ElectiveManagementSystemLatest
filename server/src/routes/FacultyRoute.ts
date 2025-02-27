import express from "express";
import FacultyController from "../controllers/FacultyController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Faculties
 *   description: Faculty management API
 */

/**
 * @swagger
 * /faculties:
 *   post:
 *     summary: Create a new faculty
 *     tags: [Faculties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Engineering Faculty"
 *     responses:
 *       201:
 *         description: Faculty created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", FacultyController.createFaculty);

/**
 * @swagger
 * /faculties:
 *   get:
 *     summary: Get all faculties
 *     tags:
 *       - Faculties
 *     responses:
 *       200:
 *         description: List of faculties retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "123e4567-e89b-12d3-a456-426614174000"
 *                   name:
 *                     type: string
 *                     example: "Engineering"
 *       500:
 *         description: Internal server error
 */
router.get("/", FacultyController.getAllFaculties);

/**
 * @swagger
 * /faculties/{id}:
 *   get:
 *     summary: Get a faculty by ID
 *     tags: [Faculties]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Faculty ID
 *     responses:
 *       200:
 *         description: Faculty data retrieved successfully
 *       404:
 *         description: Faculty not found
 */
router.get("/:id", FacultyController.getFacultyById);

/**
 * @swagger
 * /faculties:
 *   put:
 *     summary: Update a faculty
 *     tags: [Faculties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - name
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               name:
 *                 type: string
 *                 example: "Updated Faculty Name"
 *     responses:
 *       200:
 *         description: Faculty updated successfully
 *       400:
 *         description: Invalid input
 */
router.put("/", FacultyController.updateFaculty);

/**
 * @swagger
 * /faculties:
 *   delete:
 *     summary: Delete a faculty
 *     tags: [Faculties]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Faculty deleted successfully
 *       404:
 *         description: Faculty not found
 */
router.delete("/", FacultyController.deleteFaculty);

export default router;
