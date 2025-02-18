import express from "express";
import StudentController from "../controllers/StudentController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API for managing students
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter students by department ID
 *       - in: query
 *         name: branchId
 *         schema:
 *           type: string
 *         description: Filter students by branch ID
 *       - in: query
 *         name: semester
 *         schema:
 *           type: number
 *         description: Filter students by semester
 *       - in: query
 *         name: batch
 *         schema:
 *           type: integer
 *         description: Filter students by batch
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search students by first name, last name, or registration number
 *     responses:
 *       200:
 *         description: List of all students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  StudentController.getAllStudents,
);


/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID (a unique identifier for the student)
 *     responses:
 *       200:
 *         description: Student details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found with the given ID
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.ADMIN]),
  StudentController.getStudentById,
);

/**
 * @swagger
 * /students/bulk-add:
 *   post:
 *     summary: Bulk add students and their credentials
 *     tags: [Students]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [students]
 *             properties:
 *               students:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - firstName
 *                     - lastName
 *                     - gender
 *                     - contactNumber
 *                     - registrationNumber
 *                     - semester
 *                     - batch
 *                     - email
 *                     - section
 *                     - departmentId
 *                     - branchId
 *                     - password
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       example: "John"
 *                     lastName:
 *                       type: string
 *                       example: "Doe"
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE, OTHER]
 *                       example: "MALE"
 *                     contactNumber:
 *                       type: string
 *                       example: "+1234567890"
 *                     registrationNumber:
 *                       type: string
 *                       example: "2023001"
 *                     semester:
 *                       type: integer
 *                       example: 3
 *                     batch:
 *                       type: integer
 *                       example: 2023
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john.doe@example.com"
 *                     section:
 *                       type: string
 *                       example: "A"
 *                     departmentId:
 *                       type: string
 *                       example: "dep123"
 *                     branchId:
 *                       type: string
 *                       example: "brn456"
 *                     password:
 *                       type: string
 *                       format: password
 *                       example: "SecurePass123!"
 *     responses:
 *       201:
 *         description: Students and credentials added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Students and credentials added successfully (duplicates skipped)"
 *                 students:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "stu001"
 *                       firstName:
 *                         type: string
 *                         example: "John"
 *                       lastName:
 *                         type: string
 *                         example: "Doe"
 *                       gender:
 *                         type: string
 *                         example: "MALE"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *       400:
 *         description: Invalid input, expected an array of students
 *       500:
 *         description: Internal server error
 */
router.post(
  "/bulk-add",
  authorizeRoles([UserRole.ADMIN]),
  StudentController.bulkAddStudents,
);

export default router;
