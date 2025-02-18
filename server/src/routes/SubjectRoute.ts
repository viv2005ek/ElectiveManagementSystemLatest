import express from "express";
import SubjectController from "../controllers/SubjectController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

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
router.get(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  SubjectController.getSubjects,
);

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
 *             required:
 *               - name
 *               - batch
 *               - categoryId
 *               - branchIds
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subject
 *               semester:
 *                 type: integer
 *                 nullable: true
 *                 description: Semester for standalone subjects (required if category allotment type is standalone)
 *               batch:
 *                 type: integer
 *                 description: Batch year of the subject
 *               categoryId:
 *                 type: string
 *                 description: ID of the category the subject belongs to
 *               branchIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of branch IDs associated with the subject
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: List of course IDs associated with the subject (for standalone or bucket-based subjects)
 *               courseBucketIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 nullable: true
 *                 description: List of course bucket IDs (required for bucket-based subjects)
 *               semesters:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 nullable: true
 *                 description: List of semesters applicable for bucket-based subjects
 *               departmentId:
 *                 type: string
 *                 description: ID of the department the subject belongs to
 *               canOptOutsideDepartment:
 *                 type: boolean
 *                 default: false
 *                 description: Whether students outside the department can opt for this subject
 *     responses:
 *       201:
 *         description: Subject created successfully
 *       400:
 *         description: Bad request (e.g., missing required fields, invalid data)
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  SubjectController.createSubject,
);

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
router.put(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  SubjectController.updateSubject,
);

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
router.patch(
  "/enrollment",
  authorizeRoles([UserRole.ADMIN]),
  SubjectController.updateEnrollmentStatus,
);

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
router.delete(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  SubjectController.deleteSubject,
);

export default router;
