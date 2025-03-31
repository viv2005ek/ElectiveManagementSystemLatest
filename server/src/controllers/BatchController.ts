import {Request, Response} from "express";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const BatchController = {
  // Get all batches
  getAllBatches: async (req: Request, res: Response): Promise<any> => {
    try {
      const batches = await prisma.batch.findMany();
      res.json(batches);
    } catch (error) {
      res.status(500).json({ error: "Error fetching batches" });
    }
  },

  // Get a single batch by ID
  getBatchById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const batch = await prisma.batch.findUnique({ where: { id } });
      if (!batch) return res.status(404).json({ error: "Batch not found" });
      res.json(batch);
    } catch (error) {
      res.status(500).json({ error: "Error fetching batch" });
    }
  },

  // Create a new batch
  createBatch: async (req: Request, res: Response): Promise<any> => {
    try {
      const { year } = req.body;
      const batch = await prisma.batch.create({ data: { year } });
      res.status(201).json(batch);
    } catch (error) {
      res.status(500).json({ error: "Error creating batch" });
    }
  },

  // Update a batch by ID
  updateBatch: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { year } = req.body;
      const batch = await prisma.batch.update({
        where: { id },
        data: { year },
      });
      res.json(batch);
    } catch (error) {
      res.status(500).json({ error: "Error updating batch" });
    }
  },

  // Delete a batch by ID
  deleteBatch: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      await prisma.batch.delete({ where: { id } });
      res.json({ message: "Batch deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting batch" });
    }
  },
};

export default BatchController;
