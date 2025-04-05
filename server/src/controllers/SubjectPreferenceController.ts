import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import {
  AllotmentType,
  SubjectCourseBucketWithSeats,
  SubjectCourseWithSeats,
} from "@prisma/client";

const SubjectPreferenceController = {
  fillPreferences: async (req: Request, res: Response): Promise<void> => {
    const { subjectId } = req.params;
    const { preferences }: { preferences: string[] } = req.body;
    const studentId = req.user.id;

    if (
      !Array.isArray(preferences) ||
      preferences.some((id) => typeof id !== "string")
    ) {
      res
        .status(400)
        .json({ error: "Preferences must be an array of strings" });
      return;
    }

    try {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
          coursesWithSeats: true,
          courseBucketsWithSeats: true,
          subjectType: true,
          batch: true,
          programs: true,
        },
      });

      if (!subject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      const student = await prisma.student.findUnique({
        where: { id: studentId },
        include: {
          batch: true,
          program: true,
        },
      });

      if (!student) {
        res.status(404).json({ error: "Student not found" });
        return;
      }

      const isStudentInBatch = student.batchId === subject.batchId;
      if (!isStudentInBatch) {
        res.status(403).json({
          error:
            "Student is not enrolled in the batch associated with the subject",
        });
        return;
      }

      const isStudentInProgram = subject.programs.some(
        (program) => student.program.id === program.id,
      );

      if (!isStudentInProgram) {
        res.status(403).json({
          error:
            "Student is not enrolled in the program associated with the subject",
        });
        return;
      }

      const uniquePreferences = new Set(preferences);
      if (uniquePreferences.size !== preferences.length) {
        res.status(400).json({ error: "Preferences must be unique" });
        return;
      }

      if (subject.subjectType.allotmentType === AllotmentType.Standalone) {
        const validCourses = preferences.every((id) =>
          subject.coursesWithSeats.some(
            (course: SubjectCourseWithSeats) => course.courseId === id,
          ),
        );

        if (!validCourses) {
          res.status(400).json({ error: "Invalid course preferences" });
          return;
        }

        await prisma.standaloneSubjectPreference.create({
          data: {
            subject: { connect: { id: subjectId } },
            student: { connect: { id: studentId } },
            firstPreferenceCourse: { connect: { id: preferences[0] } },
            secondPreferenceCourse: { connect: { id: preferences[1] } },
            thirdPreferenceCourse: { connect: { id: preferences[2] } },
          },
        });
      } else if (subject.subjectType.allotmentType === AllotmentType.Bucket) {
        const validBuckets = preferences.every((id) =>
          subject.courseBucketsWithSeats.some(
            (bucket: SubjectCourseBucketWithSeats) =>
              bucket.courseBucketId === id,
          ),
        );

        if (!validBuckets) {
          res.status(400).json({ error: "Invalid bucket preferences" });
          return;
        }

        await prisma.bucketSubjectPreference.create({
          data: {
            subject: { connect: { id: subjectId } },
            student: { connect: { id: studentId } },
            firstPreferenceCourseBucket: { connect: { id: preferences[0] } },
            secondPreferenceCourseBucket: { connect: { id: preferences[1] } },
            thirdPreferenceCourseBucket: { connect: { id: preferences[2] } },
          },
        });
      } else {
        res.status(400).json({ error: "Invalid subject type" });
        return;
      }

      res.status(200).json({ message: "Preferences saved successfully" });
    } catch (error) {
      console.error("Error filling preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getSubjectPreferences: async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const size = parseInt(req.query.size as string) || 10;
    const skip = (page - 1) * size;

    try {
      const subjectInfo = await prisma.subject.findUnique({
        where: { id: subjectId },
        select: {
          name: true,
          subjectType: {
            select: {
              allotmentType: true,
            },
          },
          batch: true,
          standaloneSubjectPreferences: {
            select: {
              firstPreferenceCourse: true,
              secondPreferenceCourse: true,
              thirdPreferenceCourse: true,
            },
            skip,
            take: size,
          },
          bucketSubjectPreferences: {
            select: {
              student: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              firstPreferenceCourseBucket: {
                select: {
                  name: true,
                },
              },
              secondPreferenceCourseBucket: {
                select: {
                  name: true,
                },
              },
              thirdPreferenceCourseBucket: {
                select: {
                  name: true,
                },
              },
            },
            skip,
            take: size,
          },
        },
      });

      if (!subjectInfo) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      res.status(200).json(subjectInfo);
    } catch (error) {
      console.error("Error fetching subject preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
export default SubjectPreferenceController;
