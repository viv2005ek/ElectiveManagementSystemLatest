import express from 'express';
import SchoolController from '../controllers/SchoolController';

/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: API endpoints for managing schools
 */

const router = express.Router();

/**
 * @swagger
 * /schools:
 *   post:
 *     summary: Create a new school
 *     tags: [Schools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - facultyId
 *             properties:
 *               name:
 *                 type: string
 *                 example: "School of Engineering"
 *               facultyId:
 *                 type: string
 *                 example: "e6f8e5a7-09dc-4e99-b63c-0f98765b4321"
 *     responses:
 *       201:
 *         description: Successfully created a school
 *       400:
 *         description: Validation error
 */
router.post("/", SchoolController.createSchool);

/**
 * @swagger
 * /schools:
 *   get:
 *     summary: Get all schools
 *     tags: [Schools]
 *     responses:
 *       200:
 *         description: List of schools retrieved successfully
 */
router.get("/", SchoolController.getAllSchools);

/**
 * @swagger
 * /schools/{id}:
 *   get:
 *     summary: Get a school by ID
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The school ID
 *     responses:
 *       200:
 *         description: School retrieved successfully
 *       404:
 *         description: School not found
 */
router.get("/:id", SchoolController.getSchoolById);

/**
 * @swagger
 * /schools/{id}:
 *   put:
 *     summary: Update a school
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The school ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Updated School Name"
 *               facultyId:
 *                 type: string
 *                 example: "new-faculty-id-1234"
 *     responses:
 *       200:
 *         description: Successfully updated school
 *       400:
 *         description: Validation error
 *       404:
 *         description: School not found
 */
router.put("/:id", SchoolController.updateSchool);

/**
 * @swagger
 * /schools/{id}:
 *   delete:
 *     summary: Delete a school
 *     tags: [Schools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The school ID
 *     responses:
 *       200:
 *         description: Successfully deleted school
 *       404:
 *         description: School not found
 */
router.delete("/:id", SchoolController.deleteSchool);

export default router;
