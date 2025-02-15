import express from "express";
import BranchController from "../controllers/BranchController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Branches
 *   description: API endpoints for managing branches
 */

/**
 * @swagger
 * /branches:
 *   get:
 *     summary: Get all branches
 *     tags: [Branches]
 *     responses:
 *       200:
 *         description: Successfully retrieved all branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *
 *       500:
 *         description: Unable to fetch branches
 */
router.get(
  "/",
  authorizeRoles([UserRole.ADMIN]),
  BranchController.getAllBranches,
);

/**
 * @swagger
 * /branches/{id}:
 *   get:
 *     summary: Get a branch by ID
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The branch ID
 *     responses:
 *       200:
 *         description: Successfully retrieved the branch
 *         content:
 *           application/json:
 *
 *       404:
 *         description: Branch not found
 *       500:
 *         description: Unable to fetch branch
 */
router.get(
  "/:id",
  authorizeRoles([UserRole.ADMIN]),
  BranchController.getBranchByID,
);

/**
 * @swagger
 * /branches/department/{departmentId}:
 *   get:
 *     summary: Get all branches under a specific department
 *     tags: [Branches]
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: The department ID
 *     responses:
 *       200:
 *         description: Successfully retrieved branches for the department
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *
 *       404:
 *         description: No branches found for this department
 *       500:
 *         description: Unable to fetch branches
 */
router.get(
  "/department/:departmentId",
  authorizeRoles([UserRole.ADMIN]),
  BranchController.getBranchesByDepartmentId,
);

export default router;
