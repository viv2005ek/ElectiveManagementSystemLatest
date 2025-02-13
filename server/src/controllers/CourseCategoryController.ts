import { Request, Response } from 'express';
import { prisma } from '../prismaClient';

const CourseCategoryController = {
  // Get all course categories
  async getAllCourseCategories(req: Request, res: Response): Promise<any> {
    try {
      const categories = await prisma.courseCategory.findMany({
        where: { isDeleted: false },
      });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course categories" });
    }
  },

  // Get a single course category by ID
  async getCourseCategoryById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const category = await prisma.courseCategory.findUnique({
        where: { id },
      });

      if (!category || category.isDeleted) {
        return res.status(404).json({ error: "Course category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch course category" });
    }
  },

  // Create a new course category
  async createCourseCategory(req: Request, res: Response): Promise<any> {
    try {
      const { name, allotmentType } = req.body;

      const existingCategory = await prisma.courseCategory.findUnique({
        where: { name },
      });

      if (existingCategory) {
        return res
          .status(400)
          .json({ error: "Course category already exists" });
      }

      const newCategory = await prisma.courseCategory.create({
        data: { name, allotmentType },
      });

      res.status(201).json(newCategory);
    } catch (error) {
      res.status(500).json({ error: "Failed to create course category" });
    }
  },

  // Update a course category
  async updateCourseCategory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { name, allotmentType } = req.body;

      const category = await prisma.courseCategory.findUnique({
        where: { id },
      });

      if (!category || category.isDeleted) {
        return res.status(404).json({ error: "Course category not found" });
      }

      const updatedCategory = await prisma.courseCategory.update({
        where: { id },
        data: { name, allotmentType },
      });

      res.json(updatedCategory);
    } catch (error) {
      res.status(500).json({ error: "Failed to update course category" });
    }
  },

  // Soft delete a course category
  async deleteCourseCategory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;

      const category = await prisma.courseCategory.findUnique({
        where: { id },
      });

      if (!category || category.isDeleted) {
        return res.status(404).json({ error: "Course category not found" });
      }

      await prisma.courseCategory.update({
        where: { id },
        data: { isDeleted: true },
      });

      res.json({ message: "Course category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete course category" });
    }
  },
};

export default CourseCategoryController;
