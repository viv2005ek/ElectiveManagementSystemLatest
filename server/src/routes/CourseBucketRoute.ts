import express from "express";
import CourseBucketController from "../controllers/CourseBucketController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: CourseBuckets
 *   description: API for managing course buckets
 */

/**
 * @swagger
 * /course-buckets:
 *   get:
 *     summary: Get all course buckets
 *     tags: [CourseBuckets]
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by department ID
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by school ID
 *       - in: query
 *         name: facultyId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by faculty ID
 *       - in: query
 *         name: subjectTypeId
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter by subject type ID
 *     responses:
 *       200:
 *         description: Successfully retrieved course buckets
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CourseBucket'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authorizeRoles([UserRole.Admin]),
  CourseBucketController.getAllCourseBuckets,
);

/**
 * @swagger
 * /course-buckets/{id}:
 *   get:
 *     summary: Get a course bucket by ID
 *     tags: [CourseBuckets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course bucket ID
 *     responses:
 *       200:
 *         description: Course bucket details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CourseBucket'
 *       404:
 *         description: Course bucket not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  CourseBucketController.getCourseBucketById,
);

/**
 * @swagger
 * /course-buckets/bulk-add:
 *   post:
 *     summary: Bulk add course buckets
 *     tags: [CourseBuckets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               courseBuckets:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     departmentId:
 *                       type: string
 *                 example:
 *                   - name: "Machine Learning Bucket"
 *                     departmentId: "dep001"
 *                   - name: "Cybersecurity Bucket"
 *                     departmentId: "dep002"
 *     responses:
 *       201:
 *         description: Course buckets added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post(
  "/bulk-add",
  authorizeRoles([UserRole.Admin]),
  CourseBucketController.addCourseBuckets,
);

export default router;
