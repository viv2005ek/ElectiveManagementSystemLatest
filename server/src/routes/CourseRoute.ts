import express from "express";
import CourseController from "../controllers/CourseController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: API for managing courses
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get courses with optional filters and pagination
 *     description: Retrieve a list of courses filtered by department, category, credits, and a search query, with pagination support.
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional department ID to filter courses.
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional category ID to filter courses.
 *       - in: query
 *         name: credits
 *         schema:
 *           type: integer
 *         required: false
 *         description: Optional number of credits to filter courses.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional search query to filter by course name or code.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         required: false
 *         description: Number of courses per page.
 *     responses:
 *       200:
 *         description: Successfully retrieved courses with pagination.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 courses:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *                 count:
 *                   type: integer
 *                   example: 10
 *                 totalCourses:
 *                   type: integer
 *                   example: 50
 *                 totalPages:
 *                   type: integer
 *                   example: 5
 *                 currentPage:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Bad request if query parameters are invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters"
 *       404:
 *         description: No courses found for the given filters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No courses found for the given filters"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to fetch courses"
 */
router.get("/", authorizeRoles([UserRole.Admin]), CourseController.getCourses);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Unable to fetch course
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  CourseController.getCourseById,
);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - credits
 *               - departmentId
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               credits:
 *                 type: integer
 *               departmentId:
 *                 type: string
 *               subjectTypeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               courseBucketIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Course added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", authorizeRoles([UserRole.Admin]), CourseController.addCourse);

/**
 * @swagger
 * /courses/{id}:
 *   patch:
 *     summary: Update an existing course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               credits:
 *                 type: integer
 *               departmentId:
 *                 type: string
 *               subjectTypeIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Course'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  CourseController.updateCourse,
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Soft delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The course ID
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  CourseController.deleteCourse,
);

export default router;
