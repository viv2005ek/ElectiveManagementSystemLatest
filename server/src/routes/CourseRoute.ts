import express from "express";
import CourseController from "../controllers/CourseController";

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
router.get("/", CourseController.getAllCourses);

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
router.get("/:id", CourseController.getCourseById);

/**
 * @swagger
 * /courses/by-category:
 *   get:
 *     summary: Get courses by category IDs
 *     description: Retrieve a list of courses filtered by one or more category IDs.
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         required: true
 *         description: Comma-separated list of category IDs
 *     responses:
 *       200:
 *         description: Successfully retrieved courses
 *       400:
 *         description: Bad request if categories parameter is missing
 *       404:
 *         description: No courses found for the given categories
 *       500:
 *         description: Internal server error
 */
router.get("/courses/by-category", CourseController.getCoursesByCategory);

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
router.post("/", CourseController.addCourse);

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
router.post("/bulk-add", CourseController.bulkAddCourses);

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
router.put("/:id", CourseController.updateCourse);

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
router.delete("/:id", CourseController.deleteCourse);

export default router;
