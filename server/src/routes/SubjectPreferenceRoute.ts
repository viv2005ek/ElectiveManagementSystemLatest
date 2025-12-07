import express from "express";
import SubjectPreferenceController from "../controllers/SubjectPreferenceController";
import { authorizeRoles } from "../middleware/roleMiddleware";
import { UserRole } from "@prisma/client";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: SubjectPreferences
 *   description: API for managing subject preferences
 */

/**
 * @swagger
 * /subject-preferences/{subjectId}:
 *   post:
 *     summary: Fill subject preferences for a student
 *     tags: [SubjectPreferences]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               preferences:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Preferences saved successfully
 *       400:
 *         description: Invalid input data
 *       403:
 *         description: Student not enrolled in the batch or program associated with the subject
 *       404:
 *         description: Subject or student not found
 *       500:
 *         description: Internal server error
 */
router.post(
  "/:subjectId",
  authorizeRoles([UserRole.Student]),
  SubjectPreferenceController.fillPreferences,
);

router.get(
  "/:subjectId/me",
  authorizeRoles([UserRole.Student]),
  SubjectPreferenceController.getSubjectPreferencesOfStudent,
);
// Add this route (Admin only)
router.get(
  "/:subjectId/export",
  authorizeRoles([UserRole.Admin]),   // ensure only authorized users can export
  SubjectPreferenceController.exportSubjectPreferences,
);


/**
 * @swagger
 * /subject-preferences/{subjectId}:
 *   get:
 *     summary: Get subject preferences
 *     tags: [SubjectPreferences]
 *     parameters:
 *       - in: path
 *         name: subjectId
 *         required: true
 *         schema:
 *           type: string
 *         description: The subject ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of preferences per page
 *     responses:
 *       200:
 *         description: List of subject preferences
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 subjectType:
 *                   type: object
 *                   properties:
 *                     allotmentType:
 *                       type: string
 *                 batch:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     year:
 *                       type: integer
 *                 standaloneSubjectPreferences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       firstPreferenceCourse:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       secondPreferenceCourse:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       thirdPreferenceCourse:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                 bucketSubjectPreferences:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       student:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                           lastName:
 *                             type: string
 *                       firstPreferenceCourseBucket:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       secondPreferenceCourseBucket:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                       thirdPreferenceCourseBucket:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Internal server error
 */
router.get(
  "/:subjectId",
  authorizeRoles([UserRole.Admin]),
  SubjectPreferenceController.getSubjectPreferences,
);

export default router;
