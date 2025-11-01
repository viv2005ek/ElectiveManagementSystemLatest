import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const CourseBucketsController = {
  getAllCourseBuckets: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        departmentIds,
        departmentId,
        schoolIds,
        schoolId,
        facultyIds,
        facultyId,
        programIds,
        programId,
        subjectTypeIds,
        subjectTypeId,
        subjectId,
        totalCredits,
        numberOfCourses,
        name,
        page = 1,
      } = req.query;

      const filters: any = { isDeleted: false };

      if (departmentIds) {
        filters.departmentId = { in: (departmentIds as string).split(",") };
      } else if (departmentId) {
        filters.departmentId = departmentId;
      }

      if (schoolIds) {
        filters.department = {
          schoolId: { in: (schoolIds as string).split(",") },
        };
      } else if (schoolId) {
        filters.department = { schoolId };
      }

      if (facultyIds) {
        filters.department = {
          school: { facultyId: { in: (facultyIds as string).split(",") } },
        };
      } else if (facultyId) {
        filters.department = {
          school: { facultyId },
        };
      }

      if (programIds) {
        filters.programId = { in: (programIds as string).split(",") };
      } else if (programId) {
        filters.programId = programId;
      }

      if (subjectTypeIds) {
        filters.subjectTypes = {
          some: { id: { in: (subjectTypeIds as string).split(",") } },
        };
      } else if (subjectTypeId) {
        filters.subjectTypes = { some: { id: subjectTypeId } };
      }

      if (subjectId) {
        filters.courseBucketCourses = {
          some: { courseId: subjectId },
        };
      }

      if (totalCredits) {
        filters.totalCredits = Number(totalCredits);
      }

      if (numberOfCourses) {
        filters.numberOfCourses = Number(numberOfCourses);
      }

      if (name) {
        filters.name = { contains: String(name), mode: "insensitive" };
      }

      const pageSize = 10;
      const skip = (Number(page) - 1) * pageSize;

      // Get total count of matching course buckets
      const totalCount = await prisma.courseBucket.count({ where: filters });
      const totalPages = Math.ceil(totalCount / pageSize);

      const courseBuckets = await prisma.courseBucket.findMany({
        where: filters,
        include: {
          department: {
            select: {
              id: true,
              name: true,
            },
          },
          subjectTypes: {
            select: {
              name: true,
            },
          },
          courses: {
            select: {
              course: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                },
              },
              orderIndex: true,
            },
          },
        },
        skip,
        take: pageSize,
      });

      res.status(200).json({
        courseBuckets,
        totalPages,
        currentPage: Number(page),
      });
    } catch (error) {
      console.error("Error fetching course buckets:", error);
      res.status(500).json({ message: "Unable to fetch course buckets" });
    }
  },

  getCourseBucketById: async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const courseBucket = await prisma.courseBucket.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            course: true, // Add this line to include course data
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
        department: {
          include: {
            school: {
              include: {
                faculty: true,
              },
            },
          },
        },
        subjectTypes: true,
      },
    });

    if (!courseBucket || courseBucket.isDeleted) {
      return res.status(404).json({ message: "Course bucket not found" });
    }

    res.status(200).json(courseBucket);
  } catch (error) {
    console.error("Error fetching course bucket:", error);
    res.status(500).json({ message: "Unable to fetch course bucket" });
  }
},

  addCourseBucket: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, departmentId, numberOfCourses, subjectTypeIds, courses } =
        req.body;

      // Basic validation
      if (!name || !departmentId || numberOfCourses === undefined) {
        res.status(400).json({ message: "Missing required fields." });
        return;
      }

      if (!Array.isArray(courses) || courses.length === 0) {
        res.status(400).json({
          message: "Courses must be a non-empty array with id and orderIndex.",
        });
        return;
      }

      for (const course of courses) {
        if (!course.id || course.orderIndex === undefined) {
          res.status(400).json({
            message: "Each course must have an id and orderIndex.",
          });
          return;
        }
      }

      const courseIds = courses.map((c) => c.id);

      // Check if department exists
      const department = await prisma.department.findUnique({
        where: { id: departmentId },
      });
      if (!department) {
        res.status(404).json({ message: "Department not found." });
        return;
      }

      // Validate subject types exist
      if (subjectTypeIds?.length > 0) {
        const subjectTypes = await prisma.subjectType.findMany({
          where: { id: { in: subjectTypeIds } },
        });
        if (subjectTypes.length !== subjectTypeIds.length) {
          res
            .status(400)
            .json({ message: "One or more subject types not found." });
          return;
        }
      }

      // Validate courses and their subject types
      const fetchedCourses = await prisma.course.findMany({
        where: { id: { in: courseIds } },
        include: { subjectTypes: true },
      });

      if (fetchedCourses.length !== courseIds.length) {
        res.status(400).json({ message: "One or more courses not found." });
        return;
      }

      // Check if each course has at least the required subject types
      for (const course of fetchedCourses) {
        const courseSubjectTypeIds = course.subjectTypes.map((st) => st.id);
        const hasAllRequiredTypes = subjectTypeIds.every((reqTypeId: string) =>
          courseSubjectTypeIds.includes(reqTypeId),
        );

        if (!hasAllRequiredTypes) {
          res.status(400).json({
            message: `Course ${course.name || course.id} does not have all required subject types.`,
          });
          return;
        }
      }

      // Calculate total credits
      const totalCredits = fetchedCourses.reduce(
        (sum, course) => sum + (course.credits || 0),
        0,
      );

      // Create course bucket and associations in a transaction
      const createdBucket = await prisma.$transaction(async (tx) => {
        const bucket = await tx.courseBucket.create({
          data: {
            name,
            department: { connect: { id: departmentId } },
            numberOfCourses,
            subjectTypes: subjectTypeIds
              ? { connect: subjectTypeIds.map((id: string) => ({ id })) }
              : undefined,
            totalCredits,
          },
        });

        await tx.courseBucketCourse.createMany({
          data: courses.map(({ id, orderIndex }) => ({
            courseBucketId: bucket.id,
            courseId: id,
            orderIndex,
          })),
        });

        return bucket;
      });

      res.status(201).json({
        message: "Course bucket created successfully",
        data: createdBucket,
      });
    } catch (error) {
      console.error("Error adding course bucket:", error);
      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to add course bucket",
      });
    }
  },
};

export default CourseBucketsController;
