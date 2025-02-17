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
 *     parameters:
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *         description: Optional department ID to filter branches
 *     responses:
 *       200:
 *         description: Successfully retrieved all branches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
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



export default router;
