import express from "express";
import minorSpecializationController from "../controllers/MinorSpecializationController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: MinorSpecializations
 *   description: API for managing minor specializations
 */

/**
 * @swagger
 * /minor-specializations:
 *   get:
 *     summary: Get all minor specializations
 *     tags: [MinorSpecializations]
 *     responses:
 *       200:
 *         description: List of all minor specializations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MinorSpecialization'
 *       500:
 *         description: Internal server error
 */
router.get("/", minorSpecializationController.getAllMinorSpecializations);

/**
 * @swagger
 * /minor-specializations/{id}:
 *   get:
 *     summary: Get a minor specialization by ID
 *     tags: [MinorSpecializations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The minor specialization ID
 *     responses:
 *       200:
 *         description: Minor specialization details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MinorSpecialization'
 *       404:
 *         description: Minor specialization not found
 *       500:
 *         description: Internal server error
 */
router.get("/:id", minorSpecializationController.getMinorSpecializationById);

/**
 * @swagger
 * /minor-specializations/bulk-add:
 *   post:
 *     summary: Bulk add minor specializations
 *     tags: [MinorSpecializations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               minorSpecializations:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     departmentId:
 *                       type: string
 *                 example:
 *                   - name: "Data Science"
 *                     departmentId: "123e4567-e89b-12d3-a456-426614174000"
 *                   - name: "AI & ML"
 *                     departmentId: "123e4567-e89b-12d3-a456-426614174001"
 *     responses:
 *       201:
 *         description: Minor specializations added successfully
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
 *         description: Invalid input
 *       500:
 *         description: Internal server error
 */
router.post("/bulk-add", minorSpecializationController.addMinorSpecializations);

export default router;
