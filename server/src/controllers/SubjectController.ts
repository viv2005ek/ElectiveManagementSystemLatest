import {Request, Response} from "express";
import {prisma} from "../prismaClient";

const SubjectController = {
  getAllSubjects: async (req: Request, res: Response): Promise<void> => {
    const {
      page = 1,
      pageSize = 10,
      search = "",
      batchId,
      semesterId,
      subjectTypeId,
      isPreferenceWindowOpen,
      isAllotmentFinalized,
      programIds,
    } = req.query;

    const filters: any = {
      AND: [
        batchId ? { batchId: batchId as string } : {},
        semesterId ? { semesterId: semesterId as string } : {},
        subjectTypeId ? { subjectTypeId: subjectTypeId as string } : {},
        isPreferenceWindowOpen !== undefined
          ? { isPreferenceWindowOpen: isPreferenceWindowOpen === "true" }
          : {},
        isAllotmentFinalized !== undefined
          ? { isAllotmentFinalized: isAllotmentFinalized === "true" }
          : {},
        programIds
          ? {
              programs: {
                some: { id: { in: (programIds as string).split(",") } },
              },
            }
          : {},
        search
          ? { name: { contains: search as string, mode: "insensitive" } }
          : {},
      ],
    };

    try {
      const totalSubjects = await prisma.subject.count({ where: filters });
      const totalPages = Math.ceil(totalSubjects / Number(pageSize));

      const subjects = await prisma.subject.findMany({
        where: filters,
        include: {
          batch: true,
          programs: {
            include: {
              students: true,
            },
          },
          standaloneSubjectPreferences: true,
          bucketSubjectPreferences: true,
        },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
      });

      const subjectsWithDetails = subjects.map((subject) => {
        const totalStudents = subject.programs.reduce(
          (acc, program) => acc + program.students.length,
          0,
        );
        const preferencesFilled =
          subject.standaloneSubjectPreferences.length +
          subject.bucketSubjectPreferences.length;
        const remainingStudents = totalStudents - preferencesFilled;

        return {
          id: subject.id,
          name: subject.name,
          batch: subject.batch,
          totalStudents,
          preferencesFilled,
          remainingStudents,
          isPreferenceWindowOpen: subject.isPreferenceWindowOpen,
          isAllotmentFinalized: subject.isAllotmentFinalized,
        };
      });

      res.status(200).json({
        subjects: subjectsWithDetails,
        totalPages,
        currentPage: Number(page),
      });
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  createSubject: async (req: Request, res: Response): Promise<any> => {
    console.dir(req.body, { depth: null });
    try {
      const {
        name,
        batchId,
        subjectTypeId,
        departmentId,
        facultyId,
        schoolId,
        programIds,
        semesterId,
        semesterIds,
        coursesWithSeats = [],
        courseBucketsWithSeats = [],
      } = req.body;

      // Validate required fields
      if (!name || !batchId || !subjectTypeId || !programIds?.length) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const subject = await prisma.subject.create({
        data: {
          name,
          batch: { connect: { id: batchId } },
          subjectType: { connect: { id: subjectTypeId } },
          semester: semesterId ? { connect: { id: semesterId } } : undefined,
          semesters: {
            connect: semesterIds.map((id: string) => ({ id })) || [],
          },
          school: schoolId ? { connect: { id: schoolId } } : undefined,
          department: departmentId
            ? { connect: { id: departmentId } }
            : undefined,
          faculty: facultyId ? { connect: { id: facultyId } } : undefined,
          programs: {
            connect: programIds.map((id: string) => ({ id })),
          },
          isPreferenceWindowOpen: false,
          isAllotmentFinalized: false,
        },
      });

      // Create SubjectCourseWithSeats entries
      await prisma.subjectCourseWithSeats.createMany({
        data: coursesWithSeats.map(
          ({ id, seats }: { id: string; seats: number }) => ({
            courseId: id,
            subjectId: subject.id,
            totalSeats: seats,
            availableSeats: seats,
          }),
        ),
      });

      // Create SubjectCourseBucketWithSeats entries
      await prisma.subjectCourseBucketWithSeats.createMany({
        data: courseBucketsWithSeats.map(
          ({ id, seats }: { id: string; seats: number }) => ({
            courseBucketId: id,
            subjectId: subject.id,
            totalSeats: seats,
            availableSeats: seats,
          }),
        ),
      });

      res.status(201).json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getSubjectById: async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params;

    try {
      const subject = await prisma.subject.findUnique({
        where: { id },
        include: {
          semester: true,
          batch: true,
          subjectType: true,
          semesters: true,
          programs: true,
          coursesWithSeats: {
            include: {
              course: true,
            },
          },
          courseBucketsWithSeats: {
            include: {
              courseBucket: true,
            },
          },
        },
      });

      if (!subject) {
        return res.status(404).json({ error: "Subject not found" });
      }

      res.status(200).json(subject);
    } catch (error) {
      console.error("Error fetching subject details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateSubjectStatus: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { isPreferenceWindowOpen, isAllotmentFinalized } = req.body;

    if (
      typeof isPreferenceWindowOpen !== "boolean" ||
      typeof isAllotmentFinalized !== "boolean"
    ) {
      res.status(400).json({ error: "Invalid input data" });
    }

    // Ensure only one of the fields can be true at once
    if (isPreferenceWindowOpen && isAllotmentFinalized) {
      res.status(400).json({
        error:
          "Only one of isPreferenceWindowOpen or isAllotmentFinalized can be true at once",
      });
    }

    try {
      const subject = await prisma.subject.update({
        where: { id },
        data: {
          isPreferenceWindowOpen,
          isAllotmentFinalized,
        },
      });

      res.status(200).json(subject);
    } catch (error) {
      console.error("Error updating subject status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default SubjectController;
