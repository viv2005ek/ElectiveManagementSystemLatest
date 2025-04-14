import {Request, Response} from "express";
import {prisma} from "../prismaClient";
import {AllotmentType, SubjectCourseBucketWithSeats, SubjectCourseWithSeats,} from "@prisma/client";

const SubjectPreferenceController = {
  fillPreferences: async (req: Request, res: Response): Promise<void> => {
    const { subjectId } = req.params;
    const { preferences }: { preferences: string[] } = req.body;
    const studentId = req.user.id;

    if (
      !Array.isArray(preferences) ||
      preferences.some((id: string) => false)
    ) {
      res
        .status(400)
        .json({ error: "Preferences must be an array of strings" });
      return;
    }
    if (preferences.length < 2) {
      res.status(400).json({ msg: "At least two preferences are required." });
      return;
    }

    try {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId, isPreferenceWindowOpen: true },
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
        await prisma.standaloneSubjectPreference.deleteMany({
          where: {
            subjectId: subjectId,
            studentId: studentId,
          },
        });

        await prisma.standaloneSubjectPreference.create({
          data: {
            subject: { connect: { id: subjectId } },
            student: { connect: { id: studentId } },
            ...(preferences[0] && {
              firstPreferenceCourse: { connect: { id: preferences[0] } },
            }),
            ...(preferences[1] && {
              secondPreferenceCourse: { connect: { id: preferences[1] } },
            }),
            ...(preferences[2] && {
              thirdPreferenceCourse: { connect: { id: preferences[2] } },
            }),
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

        await prisma.bucketSubjectPreference.deleteMany({
          where: {
            subjectId: subjectId,
            studentId: studentId,
          },
        });

        await prisma.bucketSubjectPreference.create({
          data: {
            subject: { connect: { id: subjectId } },
            student: { connect: { id: studentId } },
            ...(preferences[0] && {
              firstPreferenceCourseBucket: { connect: { id: preferences[0] } },
            }),
            ...(preferences[1] && {
              secondPreferenceCourseBucket: { connect: { id: preferences[1] } },
            }),
            ...(preferences[2] && {
              thirdPreferenceCourseBucket: { connect: { id: preferences[2] } },
            }),
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
    const page = Number(req.query.page) || 1;
    const search = String(req.query.search || "").trim();
    const preferenceStatus = String(
      req.query.preferenceStatus || "",
    ).toLowerCase();
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    try {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        select: {
          id: true,
          batchId: true,
        },
      });

      if (!subject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      const whereClause: any = {
        batchId: subject.batchId,
        OR: [
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      };

      if (preferenceStatus === "filled") {
        whereClause.AND = [
          {
            OR: [
              { standaloneSubjectPreferences: { some: { subjectId } } },
              { bucketSubjectPreferences: { some: { subjectId } } },
            ],
          },
        ];
      } else if (preferenceStatus === "not-filled") {
        whereClause.AND = [
          {
            AND: [
              { standaloneSubjectPreferences: { none: { subjectId } } },
              { bucketSubjectPreferences: { none: { subjectId } } },
            ],
          },
        ];
      }

      const totalStudents = await prisma.student.count({ where: whereClause });

      const studentsWithPreferences = await prisma.student.findMany({
        where: whereClause,
        include: {
          standaloneSubjectPreferences: {
            where: { subjectId },
            select: {
              firstPreferenceCourse: { select: { id: true, name: true } },
              secondPreferenceCourse: { select: { id: true, name: true } },
              thirdPreferenceCourse: { select: { id: true, name: true } },
              createdAt: true
            },
          },
          bucketSubjectPreferences: {
            where: { subjectId },
            select: {
              firstPreferenceCourseBucket: { select: { id: true, name: true } },
              secondPreferenceCourseBucket: {
                select: { id: true, name: true },
              },
              thirdPreferenceCourseBucket: { select: { id: true, name: true } },
              createdAt: true
            },
          },
        },
        skip,
        take: pageSize,
      });

      const students = studentsWithPreferences.map((student) => ({
        id: student.id,
        firstName: student.firstName,
        lastName: student.lastName,
        registrationNumber: student.registrationNumber,
        preferences:
          student.standaloneSubjectPreferences.length > 0
            ? student.standaloneSubjectPreferences[0]
            : student.bucketSubjectPreferences.length > 0
              ? student.bucketSubjectPreferences[0]
              : null,
      }));

      const filledPreferencesCount = await prisma.student.count({
        where: {
          batchId: subject.batchId,
          OR: [
            { standaloneSubjectPreferences: { some: { subjectId } } },
            { bucketSubjectPreferences: { some: { subjectId } } },
          ],
        },
      });

      const pendingStudentsCount = totalStudents - filledPreferencesCount;
      const totalPages = Math.ceil(totalStudents / pageSize);

      res.status(200).json({
        students,
        totalStudents,
        filledPreferencesCount,
        pendingStudentsCount,
        totalPages,
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching subject preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getSubjectPreferencesOfStudent: async (req: Request, res: Response) => {
    const { subjectId } = req.params;
    const studentId = req.user.id;

    try {
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId, isPreferenceWindowOpen: true },
        include: {
          subjectType: true,
        },
      });

      if (!subject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      type PreferenceOption = {
        id: string;
        name: string;
      } | null;

      type BucketPreference = {
        firstPreferenceCourseBucket: PreferenceOption;
        secondPreferenceCourseBucket: PreferenceOption;
        thirdPreferenceCourseBucket: PreferenceOption;
      };

      type CoursePreference = {
        firstPreferenceCourse: PreferenceOption;
        secondPreferenceCourse: PreferenceOption;
        thirdPreferenceCourse: PreferenceOption;
      };

      let preferences: BucketPreference | CoursePreference | null;

      if (subject.subjectType.allotmentType === AllotmentType.Bucket) {
        preferences = await prisma.bucketSubjectPreference.findUnique({
          where: {
            subjectId_studentId: {
              studentId: studentId,
              subjectId: subjectId,
            },
          },
          select: {
            firstPreferenceCourseBucket: {
              select: {
                id: true,
                name: true,
              },
            },
            secondPreferenceCourseBucket: {
              select: {
                id: true,
                name: true,
              },
            },
            thirdPreferenceCourseBucket: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      } else {
        preferences = await prisma.standaloneSubjectPreference.findUnique({
          where: {
            subjectId_studentId: {
              studentId: studentId,
              subjectId: subjectId,
            },
          },
          select: {
            firstPreferenceCourse: {
              select: {
                id: true,
                name: true,
              },
            },
            secondPreferenceCourse: {
              select: {
                id: true,
                name: true,
              },
            },
            thirdPreferenceCourse: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        });
      }

      if (!preferences) {
        res
          .status(404)
          .json({ error: "No preferences found for the student." });
        return;
      }

      const response =
        subject.subjectType.allotmentType === AllotmentType.Bucket
          ? [
              (preferences as BucketPreference).firstPreferenceCourseBucket,
              (preferences as BucketPreference).secondPreferenceCourseBucket,
              (preferences as BucketPreference).thirdPreferenceCourseBucket,
            ].filter(Boolean)
          : [
              (preferences as CoursePreference).firstPreferenceCourse,
              (preferences as CoursePreference).secondPreferenceCourse,
              (preferences as CoursePreference).thirdPreferenceCourse,
            ].filter(Boolean);

      res.status(200).json(response);
    } catch (error) {
      console.error("Error fetching subject preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updatePreferences: async (req: Request, res: Response): Promise<void> => {
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
          subjectType: {
            select: {
              name: true,
              allotmentType: true,
            },
          },
        },
      });

      if (!subject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        res.status(404).json({ error: "Student not found" });
        return;
      }

      if (subject.subjectType.allotmentType === AllotmentType.Standalone) {
        await prisma.standaloneSubjectPreference.deleteMany({
          where: {
            subjectId: subjectId,
            studentId: studentId,
          },
        });

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
        await prisma.bucketSubjectPreference.deleteMany({
          where: {
            subjectId: subjectId,
            studentId: studentId,
          },
        });

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

      res.status(200).json({ message: "Preference updated successfully" });
    } catch (error) {
      console.error("Error updating preference:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  updateSubjectPreferences: async (req: Request, res: Response) => {
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
          subjectType: true,
        },
      });

      if (!subject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      const student = await prisma.student.findUnique({
        where: { id: studentId },
      });

      if (!student) {
        res.status(404).json({ error: "Student not found" });
        return;
      }

      if (subject.subjectType.allotmentType === AllotmentType.Standalone) {
        await prisma.standaloneSubjectPreference.deleteMany({
          where: {
            subjectId: subjectId,
            studentId: studentId,
          },
        });

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
        await prisma.bucketSubjectPreference.deleteMany({
          where: {
            subjectId: subjectId,
            studentId: studentId,
          },
        });

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

      res.status(200).json({ message: "Preferences updated successfully" });
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
export default SubjectPreferenceController;
