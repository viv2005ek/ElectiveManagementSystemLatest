import express from 'express';
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
router.post('/', SubjectController.createSubject);


/**
 * @swagger
 * /subjects:
 *   get:
 *     summary: Get all subjects with optional filtering and search
 *     tags: [Subjects]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by subject name
 *       - in: query
 *         name: subjectTypeId
 *         schema:
 *           type: string
 *       - in: query
 *         name: semesterId
 *         schema:
 *           type: string
 *       - in: query
 *         name: batchId
 *         schema:
 *           type: string
 *       - in: query
 *         name: isAllotmentWindowOpen
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isAllotmentFinalized
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: A list of subjects
 *       500:
 *         description: Failed to fetch subjects
 */
router.get('/', SubjectController.getAllSubjects);

/**
 * @swagger
 * /subjects/{id}:
 *   get:
 *     summary: Get a single subject by ID
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subject details
 *       404:
 *         description: Subject not found
 *       500:
 *         description: Failed to fetch subject
 */
router.get('/:id', SubjectController.getSubjectById);

/**
 * @swagger
 * /subjects/{id}:
 *   patch:
 *     summary: Update a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               semester:
 *                 type: integer
 *                 minimum: 1
 *               batchId:
 *                 type: string
 *               subjectTypeId:
 *                 type: string
 *               isPreferenceWindowOpen:
 *                 type: boolean
 *               isAllotmentFinalized:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Successfully updated
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to update subject
 */
router.patch('/:id', SubjectController.updateSubject);

/**
 * @swagger
 * /subjects/{id}:
 *   delete:
 *     summary: Delete a subject
 *     tags: [Subjects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted
 *       500:
 *         description: Failed to delete subject
 */
router.delete('/:id', SubjectController.deleteSubject);

export default router;
