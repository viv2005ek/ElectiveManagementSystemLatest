import express from "express";
import SubjectTypeController from "../controllers/SubjectTypeController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SubjectTypes
 *   description: API endpoints for managing Subject Types
 */

/**
 * @swagger
 * /subject-types:
 *   get:
 *     summary: Retrieve all subject types
 *     tags: [SubjectTypes]
 *     responses:
 *       200:
 *         description: Successfully retrieved all subject types
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SubjectType'
 *       500:
 *         description: Internal server error
 */
router.get("/", SubjectTypeController.getAllSubjectTypes);

/**
 * @swagger
 * /subject-types/{id}:
 *   get:
 *     summary: Retrieve a specific subject type by ID
 *     tags: [SubjectTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the subject type
 *     responses:
 *       200:
 *         description: Successfully retrieved the subject type
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectType'
 *       404:
 *         description: Subject type not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", SubjectTypeController.getSubjectTypeById);

/**
 * @swagger
 * /subject-types:
 *   post:
 *     summary: Create a new subject type
 *     tags: [SubjectTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - allotmentType
 *               - scope
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the subject type
 *               description:
 *                 type: string
 *                 description: A brief description of the subject type
 *               allotmentType:
 *                 type: string
 *                 description: The allotment type of the subject (e.g., Pending, Confirmed)
 *               scope:
 *                 type: string
 *                 enum: [ANY_DEPARTMENT, SAME_FACULTY, SAME_SCHOOL, SAME_DEPARTMENT]
 *                 description: The scope under which students can select courses
 *     responses:
 *       201:
 *         description: Subject type created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectType'
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.post("/", SubjectTypeController.createSubjectType);

/**
 * @swagger
 * /subject-types/{id}:
 *   put:
 *     summary: Update an existing subject type by ID
 *     tags: [SubjectTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the subject type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               allotmentType:
 *                 type: string
 *               scope:
 *                 type: string
 *                 enum: [ANY_DEPARTMENT, SAME_FACULTY, SAME_SCHOOL, SAME_DEPARTMENT]
 *     responses:
 *       200:
 *         description: Subject type updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SubjectType'
 *       404:
 *         description: Subject type not found
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Internal server error
 */
router.put("/:id", SubjectTypeController.updateSubjectType);

/**
 * @swagger
 * /subject-types/{id}:
 *   delete:
 *     summary: Delete a subject type by ID
 *     tags: [SubjectTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the subject type
 *     responses:
 *       200:
 *         description: Subject type deleted successfully
 *       404:
 *         description: Subject type not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", SubjectTypeController.deleteSubjectType);

router.get("/:id", SubjectTypeController.getSubjectTypeById);

export default router;
