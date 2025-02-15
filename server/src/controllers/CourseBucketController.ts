import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const CourseBucketsController = {
  getAllCourseBuckets: async (req: Request, res: Response): Promise<any> => {
    try {
      const courseBuckets = await prisma.courseBucket.findMany({
        where: { isDeleted: false },
        include: {
          courses: true,
          department: true,
        },
      });
      res.status(200).json(courseBuckets);
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
          courses: true,
          department: true,
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

  addCourseBuckets: async (req: Request, res: Response): Promise<any> => {
    try {
      const { courseBuckets } = req.body;

      if (!Array.isArray(courseBuckets) || courseBuckets.length === 0) {
        return res.status(400).json({
          message: "Invalid input. Provide an array of course buckets.",
        });
      }

      const createdBuckets = await prisma.$transaction(
        courseBuckets.map((bucket) => {
          if (!bucket.name || !bucket.departmentId) {
            throw new Error(
              "Each course bucket must have a name and departmentId.",
            );
          }
          return prisma.courseBucket.create({
            data: {
              name: bucket.name,
              departmentId: bucket.departmentId,
            },
          });
        }),
      );

      res.status(201).json({
        message: "Course buckets added successfully",
        data: createdBuckets,
      });
    } catch (error) {
      console.error("Error adding course buckets:", error);
      res.status(500).json({ message: "Unable to add course buckets" });
    }
  },
};

export default CourseBucketsController;
