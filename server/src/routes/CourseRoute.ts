import express from "express";
import CourseController from "../controllers/CourseController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.get(
  "/:id",
  authorizeRoles([UserRole.Admin]),
  CourseController.getCourseById,
);
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get courses with optional filters and pagination
 *     description: Retrieve a list of courses filtered by department, category, credits, and a search query, with pagination support.
 *     tags:
 *       - Courses
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
 *                 courseCategories:
 *                   type: object
 *                   properties:
 *                     id: string
 *                     name: string
 *                     allotmentType: string
 *
 *
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
 * /courses:
 *   post:
 *     summary: Add a new course
 *     tags: [Courses]
 *     responses:
 *       201:
 *         description: Course added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", authorizeRoles([UserRole.Admin]), CourseController.addCourse);

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
