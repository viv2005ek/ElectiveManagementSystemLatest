import express from "express";
import DepartmentController from "../controllers/DepartmentController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         description: Optional school ID to filter departments
 *     responses:
 *       200:
 *         description: List of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Department'
 *       500:
 *         description: Internal server error
 */
router.get("/", DepartmentController.getAllDepartments);

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
router.get("/:id", DepartmentController.getDepartmentById);

/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - schoolId
 *             properties:
 *               name:
 *                 type: string
 *               schoolId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post("/", DepartmentController.createDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               schoolId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Department'
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", DepartmentController.updateDepartment);

/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department by ID
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
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", DepartmentController.deleteDepartment);

export default router;
