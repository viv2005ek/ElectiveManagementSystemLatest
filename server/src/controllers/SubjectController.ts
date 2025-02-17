import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { AllotmentType } from "@prisma/client";

const SubjectController = {
  createSubject: async (req: Request, res: Response): Promise<any> => {
    try {
      const {
        name,
        semester,
        batch,
        branchIds,
        courseIds = [],
        categoryId,
        semesters,
        courseBucketIds = [],
        departmentId,
        canOptOutsideDepartment = false,
      } = req.body;

      if (!name) {
        return res
          .status(400)
          .json({ message: "Name is required for subject creation" });
      }

      if (!batch) {
        return res
          .status(400)
          .json({ message: "Batch is required for subject creation" });
      }

      if (!branchIds || !Array.isArray(branchIds) || branchIds.length === 0) {
        return res
          .status(400)
          .json({ message: "Branch IDs are required for subject creation" });
      }

      const existingSubject = await prisma.subject.findFirst({
        where: { batch, name, isDeleted: false },
      });

      if (existingSubject) {
        return res.status(400).json({
          message: "Subject with same name for the same batch already exists.",
        });
      }

      // Validate branch existence and department consistency if canOptOutsideDepartment is false
      const validBranches = await prisma.branch.findMany({
        where: { id: { in: branchIds } },
        select: { id: true, departmentId: true },
      });

      if (validBranches.length !== branchIds.length) {
        return res
          .status(400)
          .json({ message: "One or more Branch IDs are invalid" });
      }

      if (
        !canOptOutsideDepartment &&
        validBranches.some((branch) => branch.departmentId !== departmentId)
      ) {
        return res.status(400).json({
          message: "All branches must belong to the specified department",
        });
      }

      // Validate category existence
      const category = await prisma.courseCategory.findUnique({
        where: { id: categoryId },
      });

      if (!category) {
        return res.status(400).json({ message: "Invalid category ID" });
      }

      let newSubject = null;

      if (category.allotmentType === AllotmentType.STANDALONE) {
        if (!semester) {
          return res
            .status(400)
            .json({ message: "Semester is required for standalone subjects" });
        }

        const validCourses = await prisma.course.findMany({
          where: { id: { in: courseIds } },
          select: { id: true, departmentId: true },
        });

        if (validCourses.length !== courseIds.length) {
          return res
            .status(400)
            .json({ message: "One or more Course IDs are invalid" });
        }

        if (
          !canOptOutsideDepartment &&
          validCourses.some((course) => course.departmentId !== departmentId)
        ) {
          return res.status(400).json({
            message: "All courses must belong to the specified department",
          });
        }

        newSubject = await prisma.subject.create({
          data: {
            name,
            semester,
            batch,
            departmentId,
            categoryId,
            canOptOutsideDepartment,
            branches: { connect: branchIds.map((id) => ({ id })) },
            courses: { connect: courseIds.map((id: string) => ({ id })) },
          },
        });
      }

      if (category.allotmentType === AllotmentType.BUCKET) {
        if (!semesters || !Array.isArray(semesters) || semesters.length === 0) {
          return res.status(400).json({
            message: "Semesters mapping is required for bucket-based subjects",
          });
        }

        const validBuckets = await prisma.courseBucket.findMany({
          where: { id: { in: courseBucketIds } },
          select: { id: true, departmentId: true },
        });

        if (validBuckets.length !== courseBucketIds.length) {
          return res
            .status(400)
            .json({ message: "One or more Course Bucket IDs are invalid" });
        }

        if (
          !canOptOutsideDepartment &&
          validBuckets.some((bucket) => bucket.departmentId !== departmentId)
        ) {
          return res.status(400).json({
            message:
              "All course buckets must belong to the specified department",
          });
        }

        newSubject = await prisma.subject.create({
          data: {
            name,
            batch,
            categoryId,
            canOptOutsideDepartment,
            branches: { connect: branchIds.map((id) => ({ id })) },
            courses: { connect: courseIds.map((id: string) => ({ id })) },
            buckets: { connect: courseBucketIds.map((id: any) => ({ id })) },
          },
        });

        await prisma.$transaction(
          semesters.map((semester) =>
            prisma.bucketSubjectSemesterMapping.create({
              data: { subjectId: newSubject!.id, semester },
            }),
          ),
        );
      }

      if (!newSubject) {
        return res
          .status(400)
          .json({ message: "Invalid allotment type or missing required data" });
      }

      return res.status(201).json(newSubject);
    } catch (error) {
      console.error("Error creating subject:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  getSubjects: async (req: Request, res: Response): Promise<any> => {
    try {
      const subjects = await prisma.subject.findMany({
        include: {
          branches: true,
          courses: true,
          category: true,
        },
      });
      return res.status(200).json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  updateSubject: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      const { name, semester, batch, branchIds, courseIds, categoryId } =
        req.body;

      const updatedSubject = await prisma.subject.update({
        where: { id },
        data: {
          name,
          semester,
          batch,
          categoryId,
          branches: {
            set: branchIds.map((id: string) => ({ id })),
          },
          courses: {
            set: courseIds.map((id: string) => ({ id })),
          },
        },
      });

      return res.status(200).json(updatedSubject);
    } catch (error) {
      console.error("Error updating subject:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteSubject: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id } = req.params;
      await prisma.subject.delete({
        where: { id },
      });
      return res.status(200).json({ message: "Subject deleted successfully" });
    } catch (error) {
      console.error("Error deleting subject:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  updateEnrollmentStatus: async (req: Request, res: Response): Promise<any> => {
    try {
      const { id, isEnrollOpen, enrollmentDeadline } = req.body;

      if (!id || typeof isEnrollOpen !== "boolean") {
        return res
          .status(400)
          .json({ message: "Subject ID and isEnrollOpen status are required" });
      }

      const subject = await prisma.subject.update({
        where: { id },
        data: {
          isEnrollOpen,
          enrollmentDeadline: enrollmentDeadline
            ? new Date(enrollmentDeadline)
            : null,
        },
      });

      return res
        .status(200)
        .json({ message: "Enrollment status updated successfully", subject });
    } catch (error) {
      console.error("Error updating enrollment status:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default SubjectController;
