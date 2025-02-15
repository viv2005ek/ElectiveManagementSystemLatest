import express from "express";
import SubjectController from "../controllers/SubjectController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: Subject management API
 */

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Retrieve a list of subjects
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: A list of subjects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 */
router.get("/", SubjectController.getSubjects);

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               semester:
 *                 type: integer
 *               batch:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *               branchIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               courseBucketIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               semesters:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Bad request
 */
router.post("/", SubjectController.createSubject);

/**
 * @swagger
 * /subjects:
 *   put:
 *     summary: Update an existing subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               semester:
 *                 type: integer
 *               batch:
 *                 type: integer
 *               categoryId:
 *                 type: string
 *               branchIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Subject updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put("/", SubjectController.updateSubject);

/**
 * @swagger
 * /subjects/enrollment:
 *   patch:
 *     summary: Open enrollment for a subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: The subject ID
 *               isEnrollOpen:
 *                 type: boolean
 *                 description: Set to true to open enrollment
 *               enrollmentDeadline:
 *                 type: string
 *                 format: date-time
 *                 description: Enrollment deadline (optional)
 *     responses:
 *       200:
 *         description: Enrollment status updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Subject not found
 */
router.patch("/enrollment", SubjectController.updateEnrollmentStatus);

/**
 * @swagger
 * /subjects:
 *   delete:
 *     summary: Delete a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.delete("/", SubjectController.deleteSubject);

export default router;
