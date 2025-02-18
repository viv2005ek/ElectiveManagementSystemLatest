import express from "express";
import departmentController from "../controllers/DepartmentController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: API for managing departments
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of all departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authorizeRoles([UserRole.ADMIN, UserRole.FACULTY]),
  departmentController.getAllDepartments,
);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The department ID
 *     responses:
 *       200:
 *         description: Department details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", departmentController.getDepartmentById);

/**
 * @swagger
 * /departments/bulk-add:
 *   post:
 *     summary: Add multiple departments
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departments
 *             properties:
 *               departments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: The name of the department
 *     responses:
 *       201:
 *         description: Departments added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *       400:
 *         description: Invalid input (missing or incorrect fields)
 *       500:
 *         description: Internal server error
 */
router.post("/bulk-add", departmentController.addDepartments);

export default router;
