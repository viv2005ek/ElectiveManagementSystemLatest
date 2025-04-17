import express from "express";
import studentController from "../controllers/StudentController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";
import SubjectController from "../controllers/SubjectController";

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
 *         name: programId
 *         schema:
 *           type: string
 *         description: Filter students by program ID
 *       - in: query
 *         name: batchId
 *         schema:
 *           type: string
 *         description: Filter students by batch ID
 *       - in: query
 *         name: semester
 *         schema:
 *           type: integer
 *         description: Filter students by semester
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Filter students by department ID
 *       - in: query
 *         name: schoolId
 *         schema:
 *           type: string
 *         description: Filter students by school ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search students by first, middle, and last name combined or registration number
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of students per page
 *     responses:
 *       200:
 *         description: List of all students with pagination info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 students:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Student'
 *                 totalPages:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 pageSize:
 *                   type: integer
 *       500:
 *         description: Unable to fetch students
 */
router.get(
  "/",
  // authorizeRoles([UserRole.Admin]),
  studentController.getAllStudents,
);

/**
 * @swagger
 * /subjects/student:
 *   get:
 *     summary: Get subjects for a student
 *     tags: [Subjects]
 *     responses:
 *       200:
 *         description: List of subjects for the student
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subject'
 *       500:
 *         description: Unable to fetch subjects for student
 */
router.get(
  "/active-subjects",
  authorizeRoles([UserRole.Student]),
  SubjectController.getSubjectsForStudent,
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
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student details successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       404:
 *         description: Student not found
 *       500:
 *         description: Unable to fetch student
 */
router.get(
  "/:id",
  // authorizeRoles([UserRole.Admin]),
  studentController.getStudentById,
);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Soft delete a student
 *     tags: [Students]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The student ID
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       404:
 *         description: Student not found
 *       500:
 *         description: Unable to delete student
 */
router.delete(
  "/:id",
  // authorizeRoles([UserRole.Admin]),
  studentController.deleteStudent,
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
 *                     - batchId
 *                     - email
 *                     - programId
 *                     - password
 *                   properties:
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     gender:
 *                       type: string
 *                       enum: [MALE, FEMALE, OTHER]
 *                     contactNumber:
 *                       type: string
 *                     registrationNumber:
 *                       type: string
 *                     semester:
 *                       type: integer
 *                     batchId:
 *                       type: string
 *                     email:
 *                       type: string
 *                     programId:
 *                       type: string
 *                     password:
 *                       type: string
 *     responses:
 *       201:
 *         description: Students and credentials added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Unable to add students
 */
router.post(
  "/bulk-add",
  // authorizeRoles([UserRole.Admin]),
  studentController.bulkAddStudents,
);

export default router;
