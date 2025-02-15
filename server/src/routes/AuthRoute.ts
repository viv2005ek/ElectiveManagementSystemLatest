import { Router } from "express";
import authController from "../controllers/authController";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for handling authentication (login, register)
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt-token-here"
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
router.post("/login", authController.loginController);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               registrationNumber:
 *                 type: string
 *                 example: "S1234567A"
 *     responses:
 *       201:
 *         description: Successfully registered a new user
 *       400:
 *         description: Invalid input or user already exists
 *       500:
 *         description: Internal server error
 */
router.post("/register", authController.registerController);

// Uncomment this route if needed in the future
// router.post('/admin/logout', authController.logoutController);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/logout", authController.logoutController);

export default router;
