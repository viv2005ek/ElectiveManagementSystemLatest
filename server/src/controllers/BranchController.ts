import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BranchController = {
  getAllBranches: async (req: Request, res: Response): Promise<any> => {
    try {
      const branches = await prisma.branch.findMany({
        include: {
          department: true, // Include department details
        },
      });
      res.status(200).json(branches);
    } catch (error) {
      console.error("Error fetching branches:", error);
      res.status(500).json({ message: "Unable to fetch branches" });
    }
  },

  getBranchByID: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;
    try {
      const branch = await prisma.branch.findUnique({
        where: { id },
        include: {
          department: true,
        },
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

  getBranchesByDepartmentId: async (
    req: Request,
    res: Response,
  ): Promise<any> => {
    const { departmentId } = req.params;
    try {
      const branches = await prisma.branch.findMany({
        where: { departmentId },
        include: {
          department: true,
        },
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
  bulkAddBranches: async (req: Request, res: Response): Promise<any> => {
    const { branches } = req.body;

    if (!Array.isArray(branches) || branches.length === 0) {
      return res
        .status(400)
        .json({ message: "Provide a valid array of branches" });
    }

    try {
      // Validate department existence
      const departmentIds = [...new Set(branches.map((b) => b.departmentId))];
      const existingDepartments = await prisma.department.findMany({
        where: { id: { in: departmentIds } },
        select: { id: true },
      });
      const validDepartmentIds = new Set(existingDepartments.map((d) => d.id));

      if (departmentIds.some((id) => !validDepartmentIds.has(id))) {
        return res
          .status(400)
          .json({ message: "Invalid departmentId(s) provided" });
      }

      // Check for duplicate branch names within the same department
      const existingBranches = await prisma.branch.findMany({
        where: {
          departmentId: { in: departmentIds },
          isDeleted: false,
        },
        select: { name: true, departmentId: true },
      });

      const existingBranchMap = new Map();
      existingBranches.forEach((b) => {
        existingBranchMap.set(`${b.name}-${b.departmentId}`, true);
      });

      const uniqueBranches = branches.filter(
        (b) => !existingBranchMap.has(`${b.name}-${b.departmentId}`),
      );

      if (uniqueBranches.length === 0) {
        return res
          .status(409)
          .json({ message: "All provided branches already exist" });
      }

      // Bulk insert branches
      const createdBranches = await prisma.$transaction(
        uniqueBranches.map((branch) =>
          prisma.branch.create({
            data: {
              name: branch.name,
              departmentId: branch.departmentId,
            },
          }),
        ),
      );

      res.status(201).json({
        message: "Branches added successfully",
        branches: createdBranches,
      });
    } catch (error) {
      console.error("Error adding branches:", error);
      res.status(500).json({ message: "Unable to add branches" });
    }
  },
};

export default BranchController;
