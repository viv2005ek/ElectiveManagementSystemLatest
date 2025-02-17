import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const CourseController = {
  // Get a course by ID
  getCourseById: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          department: true,
          courseCategories: true,
          courseBuckets: true,
          subjectPreferences: true,
          courseAllotment: true,
        },
      });
      console.log("hello");

      if (!course || course.isDeleted) {
        return res.status(404).json({ message: "Course not found" });
      }

      res.status(200).json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Unable to fetch course" });
    }
  },

  getCoursesByCategory: async (req: Request, res: Response): Promise<any> => {
    try {
      const { departmentId, categoryId } = req.query;
      console.log("Received request for getCoursesByCategory");
      console.log("Query Params:", req.query);

      console.log("id", departmentId);

      const filters: any = {
        isDeleted: false,
      };

      if (departmentId) {
        filters.departmentId = departmentId;
      }

      if (categoryId) {
        filters.courseCategories = {
          some: { id: categoryId },
        };
      }

      const courses = await prisma.course.findMany({
        where: filters,
      });

      res.status(200).json({ courses, count: courses.length });
    } catch (error) {
      console.error(" Error fetching courses:", error);
      res.status(500).json({ message: "Unable to fetch courses", error });
    }
  },

  getCoursesFiltered: async (req: Request, res: Response): Promise<any> => {
    try {
      const { departmentId, categoryId } = req.query; // Extract query parameters
      console.log("Received request for getCoursesFiltered");
      console.log("Query Params:", req.query);

      const filters: any = {
        isDeleted: false,
      };

      if (departmentId) {
        filters.departmentId = departmentId;
      }

      if (categoryId) {
        filters.courseCategories = {
          some: { id: categoryId },
        };
      }

      const courses = await prisma.course.findMany({
        where: filters,
        include: {
          department: true,
        },
      });

      res.status(200).json({ courses, count: courses.length });
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      res.status(500).json({ message: "Unable to fetch courses", error });
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
        courseCategories,
        courseBuckets,
      } = req.body;

      if (!name || !code || !credits || !departmentId) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const existingCourse = await prisma.course.findUnique({
        where: { code },
      });
      if (existingCourse) {
        return res.status(400).json({ message: "Course code must be unique" });
      }

      const newCourse = await prisma.course.create({
        data: {
          name,
          code,
          credits,
          departmentId,
          courseCategories: courseCategories
            ? { connect: courseCategories.map((id: string) => ({ id })) }
            : undefined,
          courseBuckets: courseBuckets
            ? { connect: courseBuckets.map((id: string) => ({ id })) }
            : undefined,
        },
      });

      res
        .status(201)
        .json({ message: "Course added successfully", data: newCourse });
    } catch (error) {
      console.error("Error adding course:", error);
      res.status(500).json({ message: "Unable to add course" });
    }
  },

  // Bulk add courses
  bulkAddCourses: async (req: Request, res: Response): Promise<any> => {
    try {
      const { courses } = req.body;

      if (!Array.isArray(courses) || courses.length === 0) {
        return res
          .status(400)
          .json({ message: "Provide a valid array of courses" });
      }

      // Validate department existence
      const departmentIds = [...new Set(courses.map((c) => c.departmentId))];
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

      // Check for duplicate course codes
      const existingCourses = await prisma.course.findMany({
        where: {
          code: { in: courses.map((c) => c.code) },
        },
        select: { code: true },
      });

      const existingCourseCodes = new Set(existingCourses.map((c) => c.code));
      const uniqueCourses = courses.filter(
        (c) => !existingCourseCodes.has(c.code),
      );

      if (uniqueCourses.length === 0) {
        return res
          .status(409)
          .json({ message: "All provided courses already exist" });
      }

      // Bulk insert courses
      const createdCourses = await prisma.$transaction(
        uniqueCourses.map((course) =>
          prisma.course.create({
            data: {
              name: course.name,
              code: course.code,
              credits: course.credits,
              departmentId: course.departmentId,
              courseCategories: course.courseCategories
                ? {
                    connect: course.courseCategories.map((id: string) => ({
                      id,
                    })),
                  }
                : undefined,
              courseBuckets: course.courseBuckets
                ? {
                    connect: course.courseBuckets.map((id: string) => ({ id })),
                  }
                : undefined,
            },
          }),
        ),
      );

      res.status(201).json({
        message: "Courses added successfully",
        courses: createdCourses,
      });
    } catch (error) {
      console.error("Error adding courses:", error);
      res.status(500).json({ message: "Unable to add courses" });
    }
  },

  // Update a course
  updateCourse: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const {
        name,
        code,
        credits,
        departmentId,
        courseCategories,
        courseBuckets,
      } = req.body;

      const existingCourse = await prisma.course.findUnique({ where: { id } });
      if (!existingCourse || existingCourse.isDeleted) {
        return res.status(404).json({ message: "Course not found" });
      }

      const updatedCourse = await prisma.course.update({
        where: { id },
        data: {
          name,
          code,
          credits,
          departmentId,
          courseCategories: courseCategories
            ? { set: courseCategories.map((id: string) => ({ id })) }
            : undefined,
          courseBuckets: courseBuckets
            ? { set: courseBuckets.map((id: string) => ({ id })) }
            : undefined,
        },
      });

      res
        .status(200)
        .json({ message: "Course updated successfully", data: updatedCourse });
    } catch (error) {
      console.error("Error updating course:", error);
      res.status(500).json({ message: "Unable to update course" });
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

      await prisma.course.update({
        where: { id },
        data: { isDeleted: true },
      });

      res.status(200).json({ message: "Course deleted successfully" });
    } catch (error) {
      console.error("Error deleting course:", error);
      res.status(500).json({ message: "Unable to delete course" });
    }
  },
};

export default CourseController;
