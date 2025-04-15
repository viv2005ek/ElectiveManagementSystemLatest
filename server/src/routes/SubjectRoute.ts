import express from "express";
import SubjectController from "../controllers/SubjectController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Subjects
 *   description: API for managing subjects
 */

/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get all subjects
 *     tags: [Subjects]
 *     parameters:
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
 *         description: Number of subjects per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search subjects by name
 *       - in: query
 *         name: batchId
 *         schema:
 *           type: string
 *         description: Filter subjects by batch ID
 *       - in: query
 *         name: semesterId
 *         schema:
 *           type: string
 *         description: Filter subjects by semester ID
 *       - in: query
 *         name: subjectTypeId
 *         schema:
 *           type: string
 *         description: Filter subjects by subject type ID
 *       - in: query
 *         name: isPreferenceWindowOpen
 *         schema:
 *           type: boolean
 *         description: Filter subjects by preference window status
 *       - in: query
 *         name: isAllotmentFinalized
 *         schema:
 *           type: boolean
 *         description: Filter subjects by allotment finalized status
 *       - in: query
 *         name: programIds
 *         schema:
 *           type: string
 *         description: Filter subjects by program IDs (comma-separated)
 *     responses:
 *       200:
 *         description: List of all subjects with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subjects:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Subject'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *       500:
 *         description: Unable to fetch subjects
 */
router.get(
  "/",
  authorizeRoles([UserRole.Admin]),
  SubjectController.getAllSubjects,
);

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Get a subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: Subject details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Unable to fetch subject
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  SubjectController.getSubjectById,
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
 *               - batchId
 *               - subjectTypeId
 *               - programIds
 *             properties:
 *               name:
 *                 type: string
 *               batchId:
 *                 type: string
 *               subjectTypeId:
 *                 type: string
 *               departmentId:
 *                 type: string
 *               facultyId:
 *                 type: string
 *               schoolId:
 *                 type: string
 *               programIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               semesterId:
 *                 type: string
 *               semesterIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               coursesWithSeats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     seats:
 *                       type: integer
 *               courseBucketsWithSeats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     seats:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Subject created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Unable to create subject
 */
router.post(
  "/",
  authorizeRoles([UserRole.Admin]),
  SubjectController.createSubject,
);

/**
 * @swagger
 * /subjects/{id}/status:
 *   patch:
 *     summary: Update subject status
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPreferenceWindowOpen:
 *                 type: boolean
 *               isAllotmentFinalized:
 *                 type: boolean
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Subject status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subject'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Unable to update subject status
 */
router.patch(
  "/:id/status",
  authorizeRoles([UserRole.Admin]),
  SubjectController.updateSubjectStatus,
);

/**
 * @swagger
 * /subjects/{id}/offerings:
 *   get:
 *     summary: Get subject offerings
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search offerings by course or bucket name
 *     responses:
 *       200:
 *         description: List of subject offerings
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 subjectName:
 *                   type: string
 *                 subjectType:
 *                   $ref: '#/components/schemas/SubjectType'
 *                 batchName:
 *                   type: string
 *                 semesters:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Semester'
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 courseBuckets:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/CourseBucket'
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Unable to fetch subject offerings
 */
router.get(
  "/:id/offerings",
  authorizeRoles([UserRole.Admin, UserRole.Student]),
  SubjectController.getSubjectOfferings,
);

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: Subject deleted successfully
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Unable to delete subject
 */
router.delete(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  SubjectController.deleteSubject,
);

/**
 * @swagger
 * /subjects/{subjectId}/allotments:
 *   post:
 *     summary: Run allotments for a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: Allotments created successfully
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Unable to create allotments
 */
router.post(
  "/:subjectId/allotments",
  authorizeRoles([UserRole.Admin]),
  SubjectController.runAllotmentsForSubject,
);

/**
 * @swagger
 * /subjects/{subjectId}/allotments:
 *   get:
 *     summary: Get subject allotments
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     responses:
 *       200:
 *         description: Subject allotments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 subjectType:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     allotmentType:
 *                       type: string
 *                 batch:
 *                   $ref: '#/components/schemas/Batch'
 *                 standaloneAllotments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                       course:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                 bucketAllotments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                       courseBucket:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Unable to fetch subject allotments
 */
router.get(
  "/:subjectId/allotments",
  authorizeRoles([UserRole.Admin]),
  SubjectController.getSubjectAllotments,
);

router.get(
  "/:subjectId/allotments/stats",
  authorizeRoles([UserRole.Admin]),
  SubjectController.getAllotmentStats,
);

router.put(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  SubjectController.updateSubject,
);

router.get(
  "/allotments/me",
  authorizeRoles([UserRole.Student]),
  SubjectController.getStudentAllotments,
);

export default router;
