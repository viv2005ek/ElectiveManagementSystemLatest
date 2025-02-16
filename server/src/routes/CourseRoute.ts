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
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Successfully retrieved courses
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  CourseController.getAllCourses,
);

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
 *     responses:
 *       200:
 *         description: Course details
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.ADMIN]),
  CourseController.getCourseById,
);

/**
 * @swagger
 * /courses/by-category/{id}:
 *   get:
 *     summary: Get courses by category ID
 *     description: Retrieve a list of courses filtered by a single category ID.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: A single category ID (UUID format)
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
 *         description: Bad request if category ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A valid category ID is required"
 *       404:
 *         description: No courses found for the given category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No courses found for the given category"
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
  "/by-category/detailed/:id",
  authorizeRoles([UserRole.ADMIN]),
  CourseController.getCoursesByCategoryDetailed,
);

/**
 * @swagger
 * /courses/by-category/{id}:
 *   get:
 *     summary: Get courses by category ID
 *     description: Retrieve a list of courses filtered by a single category ID.
 *     tags:
 *       - Courses
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: A single category ID (UUID format)
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
 *         description: Bad request if category ID is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "A valid category ID is required"
 *       404:
 *         description: No courses found for the given category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No courses found for the given category"
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
  "/by-category/:id",
  authorizeRoles([UserRole.ADMIN]),
  CourseController.getCoursesByCategory,
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
