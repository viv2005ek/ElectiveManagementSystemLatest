import express from 'express';
import CourseCategoryController from '../controllers/CourseCategoryController';
import { authorizeRoles } from '../middleware/roleMiddleware';
import { UserRole } from '@prisma/client';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Course Categories
 *   description: API endpoints for managing course categories
 */

/**
 * @swagger
 * /course-categories:
 *   post:
 *     summary: Create a new course category
 *     tags: [Course Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - allotmentType
 *             properties:
 *               name:
 *                 type: string
 *                 description: The unique name of the course category
 *               allotmentType:
 *                 type: string
 *                 enum: [STANDALONE, BUCKET]
 *                 description: The allotment type for the course category
 *     responses:
 *       201:
 *         description: Course category created successfully
 *       400:
 *         description: Course category already exists
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  CourseCategoryController.createCourseCategory,
);

/**
 * @swagger
 * /course-categories:
 *   get:
 *     summary: Get all course categories
 *     tags: [Course Categories]
 *     responses:
 *       200:
 *         description: List of course categories
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  CourseCategoryController.getAllCourseCategories,
);

/**
 * @swagger
 * /course-categories/{id}:
 *   get:
 *     summary: Get a course category by ID
 *     tags: [Course Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course category
 *     responses:
 *       200:
 *         description: Course category details
 *       404:
 *         description: Course category not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.ADMIN]),
  CourseCategoryController.getCourseCategoryById,
);

/**
 * @swagger
 * /course-categories/{id}:
 *   put:
 *     summary: Update a course category by ID
 *     tags: [Course Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course category
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Updated name of the course category
 *               allotmentType:
 *                 type: string
 *                 enum: [STANDALONE, BUCKET]
 *                 description: Updated allotment type
 *     responses:
 *       200:
 *         description: Course category updated successfully
 *       404:
 *         description: Course category not found
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authorizeRoles([UserRole.ADMIN]),
  CourseCategoryController.updateCourseCategory,
);

/**
 * @swagger
 * /course-categories/{id}:
 *   delete:
 *     summary: Delete a course category by ID (soft delete)
 *     tags: [Course Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course category
 *     responses:
 *       200:
 *         description: Course category deleted successfully
 *       404:
 *         description: Course category not found
 *       500:
 *         description: Internal server error
 */
router.delete(
  "/:id",
  authorizeRoles([UserRole.ADMIN]),
  CourseCategoryController.deleteCourseCategory,
);

export default router;
