import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const BranchController = {
  /**
   * @desc Get all branches
   * @route GET /branches
   * @access Public
   */
  getAllBranches: async (req: Request, res: Response) => {
    try {
      const branches = await prisma.branch.findMany();
      res.status(200).json(branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ message: "Unable to fetch branches" });
    }
  },

  /**
   * @desc Get branch by ID
   * @route GET /branches/:id
   * @access Public
   */
  getBranchByID: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const branch = await prisma.branch.findUnique({
        where: { id },
      });

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      res.status(200).json(branch);
    } catch (error) {
      console.error("Error fetching branch:", error);
      res.status(500).json({ message: "Unable to fetch branch" });
    }
  },

  /**
   * @desc Get branches by department ID
   * @route GET /branches/department/:departmentId
   * @access Public
   */
  getBranchesByDepartmentId: async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    const { departmentId } = req.params;

    try {
      const branches = await prisma.branch.findMany({
        where: { departmentId },
      });

      if (!branches.length) {
        return res
          .status(404)
          .json({ message: "No branches found for this department" });
      }

      res.status(200).json(branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ message: "Unable to fetch branches" });
    }
  },
};

export default BranchController;
