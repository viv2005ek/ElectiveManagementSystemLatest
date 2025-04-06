import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { AllotmentStatus, AllotmentType } from "@prisma/client";

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
        select: {
          id: true,
          name: true,
          batch: true,
          dueDate: true,
          isPreferenceWindowOpen: true,
          isAllotmentFinalized: true,
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
          dueDate: subject.dueDate,
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
  createSubject: async (req: Request, res: Response): Promise<void> => {
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
        res.status(400).json({ error: "Missing required fields" });
        return;
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
            totalSeats: seats && seats !== 0 ? seats : null,
            availableSeats: seats && seats !== 0 ? seats : null,
          }),
        ),
      });

      // Create SubjectCourseBucketWithSeats entries
      await prisma.subjectCourseBucketWithSeats.createMany({
        data: courseBucketsWithSeats.map(
          ({ id, seats }: { id: string; seats: number }) => ({
            courseBucketId: id,
            subjectId: subject.id,
            totalSeats: seats !== 0 ? seats : null,
            availableSeats: seats !== 0 ? seats : null,
          }),
        ),
      });

      res.status(201).json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getSubjectById: async (req: Request, res: Response): Promise<void> => {
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
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      res.status(200).json(subject);
    } catch (error) {
      console.error("Error fetching subject details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  updateSubjectStatus: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { isPreferenceWindowOpen, isAllotmentFinalized, dueDate } = req.body;

    if (
      typeof isPreferenceWindowOpen !== "boolean" ||
      typeof isAllotmentFinalized !== "boolean"
    ) {
      res.status(400).json({ error: "Invalid input data" });
      return;
    }

    // Ensure only one of the fields can be true at once
    if (isPreferenceWindowOpen && isAllotmentFinalized) {
      res.status(400).json({
        error:
          "Only one of isPreferenceWindowOpen or isAllotmentFinalized can be true at once",
      });
      return;
    }

    // Ensure dueDate is provided when setting isPreferenceWindowOpen from false to true
    const subject = await prisma.subject.findUnique({ where: { id } });
    if (
      subject &&
      !subject.isPreferenceWindowOpen &&
      isPreferenceWindowOpen &&
      !dueDate
    ) {
      res.status(400).json({
        error: "Due date must be provided when opening the preference window",
      });
      return;
    }

    try {
      const updatedSubject = await prisma.subject.update({
        where: { id },
        data: {
          isPreferenceWindowOpen,
          isAllotmentFinalized,
          dueDate:
            isPreferenceWindowOpen || !isAllotmentFinalized ? dueDate : null,
        },
      });

      if (isAllotmentFinalized) {
        await prisma.standaloneSubjectPreference.deleteMany({
          where: {
            subjectId: id,
          },
        });
        await prisma.bucketSubjectPreference.deleteMany({
          where: {
            subjectId: id,
          },
        });
      }

      res.status(200).json(updatedSubject);
    } catch (error) {
      console.error("Error updating subject status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getSubjectsForStudent: async (req: Request, res: Response): Promise<void> => {
    console.log(req.user.id);
    try {
      const student = await prisma.student.findUnique({
        where: { id: req.user.id },
        include: {
          program: true,
        },
      });
      console.log(student);

      if (!student) {
        res.status(404).json({ error: "Student not found" });
        return;
      }

      const programId = student.program.id;

      const subjects = await prisma.subject.findMany({
        where: {
          isPreferenceWindowOpen: true,
          programs: {
            some: {
              id: programId,
            },
          },
          batch: {
            id: student.batchId,
          },
          AND: [
            {
              standaloneSubjectPreferences: {
                none: {
                  studentId: student.id,
                  changeRequested: false,
                },
              },
            },
            {
              bucketSubjectPreferences: {
                none: {
                  studentId: student.id,
                  changeRequested: false,
                },
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          subjectType: true,
          dueDate: true,
          isPreferenceWindowOpen: true,
          semester: true,
          semesters: true,
        },
      });

      res.status(200).json(subjects);
    } catch (error) {
      console.error("Error fetching subjects for student:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getSubjectOfferings: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { page = 1, search = "" } = req.query;
    const pageSize = 10;

    if (!id) {
      res.status(400).json({ error: "Subject ID is required" });
      return;
    }

    try {
      const subject = await prisma.subject.findUnique({
        where: { id: id },
        include: {
          coursesWithSeats: {
            include: {
              course: true,
            },
            where: {
              course: {
                name: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
            },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
          },
          courseBucketsWithSeats: {
            include: {
              courseBucket: {
                include: {
                  courses: {
                    include: {
                      course: true,
                    },
                  },
                },
              },
            },
            where: {
              courseBucket: {
                name: {
                  contains: search as string,
                  mode: "insensitive",
                },
              },
            },
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
          },
          subjectType: true,
          semesters: true,
          semester: true,
          batch: true,
        },
      });

      if (!subject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      const totalCourses = await prisma.subjectCourseWithSeats.count({
        where: {
          subjectId: id,
          course: {
            name: {
              contains: search as string,
              mode: "insensitive",
            },
          },
        },
      });

      const totalCourseBuckets =
        await prisma.subjectCourseBucketWithSeats.count({
          where: {
            subjectId: id,
            courseBucket: {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          },
        });

      const totalItems = totalCourses + totalCourseBuckets;
      const totalPages = Math.ceil(totalItems / Number(pageSize));

      const offerings = {
        subjectName: subject.name,
        subjectType: subject.subjectType,
        batchName: subject.batch.year,
        semesters: subject.semesters,
        semester: subject.semester,
        courses: subject.coursesWithSeats.map((courseWithSeats) => ({
          id: courseWithSeats.course.id,
          name: courseWithSeats.course.name,
          code: courseWithSeats.course.code,
          totalSeats: courseWithSeats.totalSeats,
          availableSeats: courseWithSeats.availableSeats,
        })),
        courseBuckets: subject.courseBucketsWithSeats.map(
          (bucketWithSeats) => ({
            id: bucketWithSeats.courseBucket.id,
            name: bucketWithSeats.courseBucket.name,
            totalSeats: bucketWithSeats.totalSeats,
            availableSeats: bucketWithSeats.availableSeats,
            courses: bucketWithSeats.courseBucket.courses.map(
              (courseBucketCourse) => ({
                id: courseBucketCourse.course.id,
                name: courseBucketCourse.course.name,
                code: courseBucketCourse.course.code,
                credits: courseBucketCourse.course.credits,
                departmentId: courseBucketCourse.course.departmentId,
              }),
            ),
          }),
        ),
        totalPages,
      };

      res.status(200).json(offerings);
    } catch (error) {
      console.error("Error fetching subject offerings:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  deleteSubject: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const deletedSubject = await prisma.subject.delete({
        where: { id },
      });

      if (!deletedSubject) {
        res.status(404).json({ message: "Subject with given ID not found" });
      }

      res
        .status(200)
        .json({ message: "Subject deleted successfully", deletedSubject });
    } catch (error) {
      console.error("Error deleting subject:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  runAllotmentsForSubject: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { subjectId } = req.params;

    try {
      console.log(`Starting allotments for subject ID: ${subjectId}`);

      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
          subjectType: true,
          standaloneSubjectPreferences: {
            where: { runAllotment: true },
            include: {
              firstPreferenceCourse: true,
              secondPreferenceCourse: true,
              thirdPreferenceCourse: true,
            },
            orderBy: [{ createdAt: "asc" }, { updatedAt: "asc" }],
          },
          bucketSubjectPreferences: {
            where: { runAllotment: true },
            include: {
              firstPreferenceCourseBucket: {
                include: {
                  courses: true,
                },
              },
              secondPreferenceCourseBucket: {
                include: {
                  courses: true,
                },
              },
              thirdPreferenceCourseBucket: {
                include: {
                  courses: true,
                },
              },
            },
            orderBy: [{ updatedAt: "asc" }, { createdAt: "asc" }],
          },
        },
      });

      if (!subject) {
        console.log(`Subject not found: ${subjectId}`);
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      console.log(`Subject found: ${subject.name}`);

      if (subject.subjectType.allotmentType === AllotmentType.Standalone) {
        const standaloneAllotments = [];
        for (const preference of subject.standaloneSubjectPreferences) {
          console.log(
            `Processing preference for student ID: ${preference.studentId}`,
          );

          const course = await prisma.subjectCourseWithSeats.findUnique({
            where: {
              courseId_subjectId: {
                courseId: preference.firstPreferenceCourseId,
                subjectId: subject.id,
              },
            },
          });

          if (
            course &&
            (course.availableSeats === null || course.availableSeats > 0)
          ) {
            console.log(
              `Allocating course ID: ${preference.firstPreferenceCourseId} to student ID: ${preference.studentId}`,
            );
            standaloneAllotments.push({
              subjectId: subject.id,
              studentId: preference.studentId,
              courseId: preference.firstPreferenceCourseId,
              semesterId: subject.semesterId || "",
              allotmentStatus: AllotmentStatus.Pending,
            });
            await prisma.subjectCourseWithSeats.update({
              where: { id: course.id },
              data: {
                availableSeats:
                  course.availableSeats !== null
                    ? course.availableSeats - 1
                    : null,
              },
            });
          } else {
            console.log(
              `No available seats for course ID: ${preference.firstPreferenceCourseId}`,
            );
          }
        }

        if (standaloneAllotments.length > 0) {
          console.log(
            `Creating ${standaloneAllotments.length} standalone allotments`,
          );
          await prisma.standaloneAllotment.createMany({
            data: standaloneAllotments,
          });
        } else {
          console.log("No standalone allotments to create");
        }
      } else if (subject.subjectType.allotmentType === AllotmentType.Bucket) {
        const bucketAllotments = [];
        for (const preference of subject.bucketSubjectPreferences) {
          console.log(
            `Processing bucket preference for student ID: ${preference.studentId}`,
          );

          const courseBucketWithSeats =
            await prisma.subjectCourseBucketWithSeats.findUnique({
              where: {
                courseBucketId_subjectId: {
                  courseBucketId: preference.firstPreferenceCourseBucketId,
                  subjectId: subject.id,
                },
              },
              include: {
                courseBucket: {
                  include: {
                    courses: true,
                  },
                },
              },
            });

          if (
            courseBucketWithSeats &&
            (courseBucketWithSeats.availableSeats === null ||
              courseBucketWithSeats.availableSeats > 0)
          ) {
            const course = courseBucketWithSeats.courseBucket.courses
              ? courseBucketWithSeats.courseBucket.courses[0]
              : null;
            if (course) {
              console.log(
                `Allocating course bucket ID: ${preference.firstPreferenceCourseBucketId} to student ID: ${preference.studentId}`,
              );
              bucketAllotments.push({
                subjectId: subject.id,
                studentId: preference.studentId,
                courseBucketId: preference.firstPreferenceCourseBucketId,
                courseId: course.id,
                semesterId: subject.semesterId || "",
                allotmentStatus: AllotmentStatus.Pending,
              });
              await prisma.subjectCourseBucketWithSeats.update({
                where: { id: courseBucketWithSeats.id },
                data: {
                  availableSeats:
                    courseBucketWithSeats.availableSeats !== null
                      ? courseBucketWithSeats.availableSeats - 1
                      : null,
                },
              });
            } else {
              console.log(
                `No courses found in course bucket ID: ${preference.firstPreferenceCourseBucketId}`,
              );
            }
          } else {
            console.log(
              `No available seats for course bucket ID: ${preference.firstPreferenceCourseBucketId}`,
            );
          }
        }

        if (bucketAllotments.length > 0) {
          console.log(`Creating ${bucketAllotments.length} bucket allotments`);
          await prisma.bucketAllotment.createMany({
            data: bucketAllotments,
          });
        } else {
          console.log("No bucket allotments to create");
        }
      }

      res.status(200).json({ message: "Allotments created successfully" });
    } catch (error) {
      console.error("Error creating allotments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getSubjectAllotments: async (req: Request, res: Response): Promise<void> => {
    const { subjectId } = req.params;

    try {
      const allotmentsInfo = await prisma.subject.findUnique({
        where: { id: subjectId },
        select: {
          name: true,
          subjectType: {
            select: {
              name: true,
              allotmentType: true,
            },
          },
          batch: true,
          standaloneAllotments: {
            select: {
              student: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              course: {
                select: {
                  name: true,
                },
              },
            },
          },
          bucketAllotments: {
            select: {
              student: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              courseBucket: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!allotmentsInfo) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      res.status(200).json(allotmentsInfo);
    } catch (error) {
      console.error("Error fetching allotments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};
export default SubjectController;
