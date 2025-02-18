import express from "express";
import CourseController from "../controllers/CourseController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get courses by optional department and category IDs
 *     description: Retrieve a list of courses filtered by department and/or category IDs.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional department ID to filter courses
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: false
 *         description: Optional category ID to filter courses
 *     responses:
 *       200:
 *         description: Successfully retrieved courses
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
 *                   example: 5
 *       400:
 *         description: Bad request if query parameters are invalid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid query parameters"
 *       404:
 *         description: No courses found for the given filters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No courses found for the given filters"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unable to fetch courses"
 */
router.get(
  "/",
  // authorizeRoles([UserRole.ADMIN]),
  CourseController.getCoursesFiltered,
);

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
router.post("/", authorizeRoles([UserRole.ADMIN]), CourseController.addCourse);

/**
 * @swagger
 * /courses/bulk-add:
 *   post:
 *     summary: Bulk add courses
 *     tags: [Courses]
 *     responses:
 *       201:
 *         description: Courses added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post(
  "/bulk-add",
  authorizeRoles([UserRole.ADMIN]),
  CourseController.bulkAddCourses,
);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authorizeRoles([UserRole.ADMIN]),
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
  authorizeRoles([UserRole.ADMIN]),
  CourseController.deleteCourse,
);

export default router;
