import express from "express";
import BatchController from "../controllers/BatchController";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Batches
 *   description: Batch management endpoints
 */

/**
 * @swagger
 * /batches:
 *   get:
 *     summary: Get all batches
 *     description: Retrieve a list of all batches available in the system.
 *     tags: [Batches]
 *     operationId: getAllBatches
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of batches.
 */
router.get("/", BatchController.getAllBatches);

/**
 * @swagger
 * /batches/{id}:
 *   get:
 *     summary: Get batch by ID
 *     description: Retrieve details of a specific batch using its unique ID.
 *     tags: [Batches]
 *     operationId: getBatchById
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the batch.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved batch details.
 *       404:
 *         description: Batch not found.
 */
router.get("/:id", BatchController.getBatchById);

/**
 * @swagger
 * /batches:
 *   post:
 *     summary: Create a new batch
 *     description: Add a new batch to the system by specifying the batch year.
 *     tags: [Batches]
 *     operationId: createBatch
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *                 description: Year of the batch to be created.
 *     responses:
 *       201:
 *         description: Successfully created the batch.
 *       400:
 *         description: Invalid request parameters.
 */
router.post("/", BatchController.createBatch);

/**
 * @swagger
 * /batches/{id}:
 *   put:
 *     summary: Update batch by ID
 *     description: Modify the details of an existing batch using its ID.
 *     tags: [Batches]
 *     operationId: updateBatch
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the batch.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *                 description: Updated batch year.
 *     responses:
 *       200:
 *         description: Successfully updated the batch.
 *       400:
 *         description: Invalid request parameters.
 *       404:
 *         description: Batch not found.
 */
router.put("/:id", BatchController.updateBatch);

/**
 * @swagger
 * /batches/{id}:
 *   delete:
 *     summary: Delete batch by ID
 *     description: Remove a batch from the system using its unique ID.
 *     tags: [Batches]
 *     operationId: deleteBatch
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the batch.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Successfully deleted the batch.
 *       404:
 *         description: Batch not found.
 */
router.delete("/:id", BatchController.deleteBatch);

export default router;
