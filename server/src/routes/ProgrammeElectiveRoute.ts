import express from "express";
import programmeElectiveController from "../controllers/ProgrammeElectiveController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: ProgrammeElectives
 *   description: API for managing programme electives
 */

/**
 * @swagger
 * /programme-electives/standalone:
 *   get:
 *     summary: Get all standalone programme electives
 *     tags: [ProgrammeElectives]
 *     responses:
 *       200:
 *         description: List of all standalone programme electives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProgrammeElective'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/standalone",
  programmeElectiveController.getAllProgrammeStandaloneElectives,
);

/**
 * @swagger
 * /programme-electives/under-minor-specializations:
 *   get:
 *     summary: Get all programme electives under minor specializations
 *     tags: [ProgrammeElectives]
 *     responses:
 *       200:
 *         description: List of all programme electives under minor specializations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProgrammeElective'
 *       500:
 *         description: Internal server error
 */
router.get(
  "/under-minor-specializations",
  programmeElectiveController.getAllProgrammeElectivesUnderMinorSpecializations,
);

/**
 * @swagger
 * /programme-electives/bulk-add:
 *   post:
 *     summary: Bulk add programme electives
 *     tags: [ProgrammeElectives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/IndependentProgrammeElective'
 *     responses:
 *       201:
 *         description: Programme electives created successfully
 *       400:
 *         description: Invalid input, expected an array of programme electives
 *       500:
 *         description: Internal server error
 */
router.post(
  "/independent/bulk-add",
  programmeElectiveController.bulkCreateProgrammeElectives,
);

/**
 * @swagger
 * /programme-electives/under-minor-specializations/bulk-add:
 *   post:
 *     summary: Bulk add programme electives to a minor specialization
 *     tags: [ProgrammeElectives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - minorSpecializationId
 *               - programmeElectives
 *             properties:
 *               minorSpecializationId:
 *                 type: string
 *                 description: ID of the minor specialization to which electives will be added
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               programmeElectives:
 *                 type: array
 *                 description: List of programme electives to be added
 *                 items:
 *                   $ref: '#/components/schemas/ProgrammeElective'
 *     responses:
 *       201:
 *         description: Programme electives added successfully
 *       400:
 *         description: Invalid input, missing required fields
 *       404:
 *         description: Minor specialization not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/under-minor-specializations/bulk-add",
  programmeElectiveController.bulkAddProgrammeElectivesToMinorSpecialization,
);

export default router;
