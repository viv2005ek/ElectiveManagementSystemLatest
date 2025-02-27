import express from "express";
import EnumsController from "../controllers/EnumsController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Enums
 *   description: API for retrieving enums used in the system
 */

/**
 * @swagger
 * /enums/gender:
 *   get:
 *     summary: Get all gender options
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of gender options
 */
router.get("/gender", EnumsController.getGenders);

/**
 * @swagger
 * /enums/program-types:
 *   get:
 *     summary: Get all program types
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of program types
 */
router.get("/program-types", EnumsController.getProgramTypes);

/**
 * @swagger
 * /enums/user-roles:
 *   get:
 *     summary: Get all user roles
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of user roles
 */
router.get("/user-roles", EnumsController.getUserRoles);

/**
 * @swagger
 * /enums/allotment-types:
 *   get:
 *     summary: Get all allotment types
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of allotment types
 */
router.get("/allotment-types", EnumsController.getAllotmentTypes);

/**
 * @swagger
 * /enums/allotment-statuses:
 *   get:
 *     summary: Get all allotment statuses
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of allotment statuses
 */
router.get("/allotment-statuses", EnumsController.getAllotmentStatuses);

/**
 * @swagger
 * /enums/subject-scopes:
 *   get:
 *     summary: Get all subject scopes
 *     tags: [Enums]
 *     responses:
 *       200:
 *         description: List of subject scopes
 */
router.get("/subject-scopes", EnumsController.getSubjectScopes);

export default router;
