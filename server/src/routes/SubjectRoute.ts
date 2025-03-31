import express from "express";
import SubjectController from "../controllers/SubjectController";

const router = express.Router();

/**
 * @swagger
 * /subjects:
 *   post:
 *     summary: Create a new subject
 *     tags: [Subjects]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - subjectTypeId
 *               - batchId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the subject
 *               semester:
 *                 type: integer
 *                 minimum: 1
 *                 nullable: true
 *                 description: Optional semester number
 *               batchId:
 *                 type: string
 *                 description: ID of the batch the subject belongs to
 *               subjectTypeId:
 *                 type: string
 *                 description: ID of the subject type
 *               programIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of program IDs associated with the subject
 *               courseIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of course IDs associated with the subject
 *               courseBucketIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: List of course bucket IDs associated with the subject
 *               isPreferenceWindowOpen:
 *                 type: boolean
 *                 description: Whether the preference window is open
 *               isAllotmentFinalized:
 *                 type: boolean
 *                 description: Whether the allotment is finalized
 *     responses:
 *       201:
 *         description: Successfully created
 *       400:
 *         description: Validation error (missing required fields)
 *       500:
 *         description: Failed to create subject
 */
router.post("/", SubjectController.createSubject);

router.get("/", SubjectController.getAllSubjects);

router.patch("/:id/status", SubjectController.updateSubjectStatus);

export default router;
