import { Request, Response } from "express";
import { prisma } from "../prismaClient";

// Utility function for error handling
const handleServerError = (res: Response, error: any, message: string) => {
  console.error(message, error);
  res.status(500).json({ message, error: error.message || error });
};

const CourseController = {
  // Get a course by ID
  getCourseById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          department: true,
          subjectTypes: true,
          semester: true,
        },
      });

      if (!course || course.isDeleted) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(course);
    } catch (error) {
      handleServerError(res, error, "Error fetching course");
    }
  },

  // Get courses with filters
  getCourses: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        departmentId,
        categoryId,
        categoryIds,
        credits,
        search,
        semesterId,
        page = 1,
        limit = 10,
      } = req.query;

      const filters: any = { isDeleted: false };

      if (departmentId) filters.departmentId = departmentId;
      if (semesterId) filters.semesterId = semesterId;
      if (categoryId) {
        // Override categoryIds if categoryId is provided
        filters.courseBuckets = { some: { id: categoryId } };
      } else if (categoryIds) {
        const categoryArray = Array.isArray(categoryIds)
          ? categoryIds
          : [categoryIds];
        filters.courseBuckets = { some: { id: { in: categoryArray } } };
      }

      if (credits) filters.credits = Number(credits);
      if (search) {
        filters.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { code: { contains: search, mode: "insensitive" } },
        ];
      }

      const offset = (Number(page) - 1) * Number(limit);
      const courses = await prisma.course.findMany({
        where: filters,
        include: { department: true, subjectTypes: true },
        skip: offset,
        take: Number(limit),
      });

      const totalCourses = await prisma.course.count({ where: filters });

      res.status(200).json({
        courses,
        count: courses.length,
        totalCourses,
        totalPages: Math.ceil(totalCourses / Number(limit)),
        currentPage: Number(page),
      });
    } catch (error) {
      handleServerError(res, error, "Error fetching courses");
    }
  },

  // Add a new course
  addCourse: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        name,
        code,
        credits,
        departmentId,
        subjectTypeIds,
        courseBucketIds,
        semesterId,
      } = req.body;

      if (!name || !code || !credits || !departmentId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existingCourse = await prisma.course.findUnique({
        where: { code_departmentId: { code, departmentId } },
      });
      if (existingCourse) {
        return res.status(400).json({
          message: "Course code must be unique within the department",
        });
      }

      const newCourse = await prisma.course.create({
        data: {
          name,
          code,
          credits,
          department: {
            connect: { id: departmentId },
          },
          semester: {
            connect: { id: semesterId },
          },
          subjectTypes: {
            connect: subjectTypeIds.map((id: string) => ({ id })),
          },
        },
      });

      res
        .status(201)
        .json({ message: "Course added successfully", data: newCourse });
    } catch (error) {
      handleServerError(res, error, "Error adding course");
    }
  },

  updateCourse: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { code, name, credits, departmentId, subjectTypeIds, semesterId } =
        req.body;

      // Validate required fields
      if (
        !id ||
        (!code && !name && !credits && !departmentId && !subjectTypeIds)
      ) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const updateData: any = {};
      if (code) updateData.code = code;
      if (name) updateData.name = name;
      if (credits) updateData.credits = credits;
      if (departmentId) updateData.departmentId = departmentId;
      if (semesterId) updateData.semesterId = semesterId;
      if (subjectTypeIds) {
        updateData.subjectTypes = {
          set: subjectTypeIds.map((subjectTypeId: string) => ({
            id: subjectTypeId,
          })),
        };
      }

      const updatedCourse = await prisma.course.update({
        where: { id },
        data: updateData,
      });

      res.status(200).json(updatedCourse);
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Soft delete a course
  deleteCourse: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const existingCourse = await prisma.course.findUnique({ where: { id } });

      if (!existingCourse || existingCourse.isDeleted) {
        return res.status(404).json({ message: "Course not found" });
      }

      await prisma.course.update({ where: { id }, data: { isDeleted: true } });
      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      handleServerError(res, error, "Error deleting course");
    }
  },
};

export default CourseController;
