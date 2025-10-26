import { Router } from 'express';
import {
  createAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
} from '../controllers/adminController';

const router = Router();

/**
 * @swagger
 *  /admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNumber
 *               - email
 *               - firstName
 *               - password
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "ADM2024001"
 *               email:
 *                 type: string
 *                 example: "admin@university.edu"
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               middleName:
 *                 type: string
 *                 example: "Michael"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               password:
 *                 type: string
 *                 example: "securePassword123"
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Bad request - missing required fields
 *       409:
 *         description: Conflict - admin already exists
 */
router.post('/', createAdmin);

/**
 * @swagger
 *  /admins:
 *   get:
 *     summary: Get all admins with pagination and search
 *     tags: [Admins]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for name, email, or registration number
 *     responses:
 *       200:
 *         description: List of admins
 */
router.get('/', getAllAdmins);

/**
 * @swagger
 *  /admins/{id}:
 *   get:
 *     summary: Get admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin details
 *       404:
 *         description: Admin not found
 */
router.get('/:id', getAdminById);

/**
 * @swagger
 *  /admins/{id}:
 *   put:
 *     summary: Update admin
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registrationNumber:
 *                 type: string
 *                 example: "ADM2024001"
 *               email:
 *                 type: string
 *                 example: "updated@university.edu"
 *               firstName:
 *                 type: string
 *                 example: "Jane"
 *               middleName:
 *                 type: string
 *                 example: "Marie"
 *               lastName:
 *                 type: string
 *                 example: "Smith"
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       404:
 *         description: Admin not found
 *       409:
 *         description: Conflict - duplicate email or registration number
 */
router.put('/:id', updateAdmin);

/**
 * @swagger
 *  /admins/{id}:
 *   delete:
 *     summary: Delete admin (soft delete)
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 */
router.delete('/:id', deleteAdmin);

export default router;