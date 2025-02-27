import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const DepartmentController = {
  /**
   * Get all departments, optionally filter by schoolId
   */
  async getAllDepartments(req: Request, res: Response): Promise<any> {
    try {
      const { schoolId } = req.query; // Extract schoolId from query params

      const departments = await prisma.department.findMany({
        where: schoolId ? { schoolId: String(schoolId) } : {}, // Apply filter if schoolId exists
        include: {
          school: true,
          professors: true,
          courses: true,
          courseBuckets: true,
        },
      });

      return res.status(200).json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Get department by ID
   */
  async getDepartmentById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      const department = await prisma.department.findUnique({
        where: { id },
        include: {
          school: true,
          professors: true,
          courses: true,
          courseBuckets: true,
        },
      });

      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      return res.status(200).json(department);
    } catch (error) {
      console.error("Error fetching department:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Create a new department
   */
  async createDepartment(req: Request, res: Response): Promise<any> {
    try {
      const { name, schoolId } = req.body;

      if (!name || !schoolId) {
        return res
          .status(400)
          .json({ message: "Name and schoolId are required" });
      }

      const department = await prisma.department.create({
        data: { name, schoolId },
      });

      return res.status(201).json(department);
    } catch (error) {
      console.error("Error creating department:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Update department by ID
   */
  async updateDepartment(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { name, schoolId } = req.body;

      const updatedDepartment = await prisma.department.update({
        where: { id },
        data: { name, schoolId },
      });

      return res.status(200).json(updatedDepartment);
    } catch (error) {
      console.error("Error updating department:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Delete department by ID
   */
  async deleteDepartment(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      await prisma.department.delete({ where: { id } });

      return res
        .status(200)
        .json({ message: "Department deleted successfully" });
    } catch (error) {
      console.error("Error deleting department:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default DepartmentController;
