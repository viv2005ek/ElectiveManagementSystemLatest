import { Request, Response } from "express";
import { prisma } from "../prismaClient";
import { AllotmentStatus, AllotmentType, Status } from "@prisma/client";

// Helper function for standalone pending allotments
async function processStandalonePendingAllotments(
  subject: any,
  unallottedStudents: any[],
  writeOps: any[]
) {
  // Get courses with available seats, sorted by current student count (ascending)
  const coursesWithStats = await Promise.all(
    subject.coursesWithSeats.map(async (courseWithSeats: any) => {
      const studentCount = await prisma.standaloneAllotment.count({
        where: {
          subjectId: subject.id,
          courseId: courseWithSeats.courseId
        }
      });

      const availableSeats = courseWithSeats.availableSeats !== null 
        ? courseWithSeats.availableSeats
        : Infinity;

      return {
        ...courseWithSeats,
        currentStudentCount: studentCount,
        availableSeats,
        effectiveAvailableSeats: availableSeats === Infinity 
          ? unallottedStudents.length 
          : Math.max(0, availableSeats)
      };
    })
  );

  // Sort courses by current student count (courses with least students first)
  const sortedCourses = coursesWithStats
    .filter(course => course.effectiveAvailableSeats > 0)
    .sort((a, b) => a.currentStudentCount - b.currentStudentCount);

  console.log('Sorted courses for distribution:', sortedCourses.map(c => ({
    name: c.course.name,
    currentCount: c.currentStudentCount,
    available: c.effectiveAvailableSeats
  })));

  if (sortedCourses.length === 0) {
    throw new Error("No courses with available seats for pending allotments");
  }

  const allotments = [];
  let studentIndex = 0;

  // Distribute students to courses with least students first
  while (studentIndex < unallottedStudents.length && sortedCourses.length > 0) {
    for (let i = 0; i < sortedCourses.length && studentIndex < unallottedStudents.length; i++) {
      const currentCourse = sortedCourses[i];
      
      if (currentCourse.effectiveAvailableSeats > 0) {
        const student = unallottedStudents[studentIndex];
        
        allotments.push({
          subjectId: subject.id,
          studentId: student.id,
          courseId: currentCourse.courseId,
          allotmentStatus: AllotmentStatus.Pending,
        });

        // Update available seats
        if (currentCourse.availableSeats !== Infinity) {
          currentCourse.availableSeats--;
          currentCourse.effectiveAvailableSeats--;
        }

        studentIndex++;
      }
    }

    // Re-sort courses after each full pass to maintain least-filled-first order
    sortedCourses.sort((a, b) => a.currentStudentCount - b.currentStudentCount);
  }

  if (allotments.length > 0) {
    writeOps.push(
      prisma.standaloneAllotment.createMany({
        data: allotments,
      })
    );

    // Update seat counts for courses with limited seats
    const seatUpdates = coursesWithStats
      .filter(course => course.availableSeats !== Infinity)
      .map(course =>
        prisma.subjectCourseWithSeats.update({
          where: { id: course.id },
          data: { availableSeats: course.availableSeats },
        })
      );

    writeOps.push(...seatUpdates);
  }
}

// Helper function for bucket pending allotments
async function processBucketPendingAllotments(
  subject: any,
  unallottedStudents: any[],
  writeOps: any[]
) {
  // Determine semester ID for bucket allotments
  let semesterId: string | null = null;
  
  if (subject.semesters && subject.semesters.length > 0) {
    semesterId = subject.semesters[0].id;
  } else if (subject.semester) {
    semesterId = subject.semester.id;
  }

  if (!semesterId) {
    throw new Error("No semester configured for bucket allotment");
  }

  // Get course buckets with available seats, sorted by current student count
  const bucketsWithStats = await Promise.all(
    subject.courseBucketsWithSeats.map(async (bucketWithSeats: any) => {
      const studentCount = await prisma.bucketAllotment.count({
        where: {
          subjectId: subject.id,
          courseBucketId: bucketWithSeats.courseBucketId
        }
      });

      const availableSeats = bucketWithSeats.availableSeats !== null 
        ? bucketWithSeats.availableSeats
        : Infinity;

      return {
        ...bucketWithSeats,
        currentStudentCount: studentCount,
        availableSeats,
        effectiveAvailableSeats: availableSeats === Infinity 
          ? unallottedStudents.length 
          : Math.max(0, availableSeats)
      };
    })
  );

  // Sort buckets by current student count (buckets with least students first)
  const sortedBuckets = bucketsWithStats
    .filter(bucket => bucket.effectiveAvailableSeats > 0)
    .sort((a, b) => a.currentStudentCount - b.currentStudentCount);

  console.log('Sorted buckets for distribution:', sortedBuckets.map(b => ({
    name: b.courseBucket.name,
    currentCount: b.currentStudentCount,
    available: b.effectiveAvailableSeats
  })));

  if (sortedBuckets.length === 0) {
    throw new Error("No course buckets with available seats for pending allotments");
  }

  const allotments = [];
  let studentIndex = 0;

  // Distribute students to buckets with least students first
  while (studentIndex < unallottedStudents.length && sortedBuckets.length > 0) {
    for (let i = 0; i < sortedBuckets.length && studentIndex < unallottedStudents.length; i++) {
      const currentBucket = sortedBuckets[i];
      
      if (currentBucket.effectiveAvailableSeats > 0) {
        const student = unallottedStudents[studentIndex];
        
        // Get the first course in the bucket
        const firstCourse = currentBucket.courseBucket.courses[0];
        if (!firstCourse) {
          throw new Error(`No courses found in bucket ${currentBucket.courseBucket.name}`);
        }

        allotments.push({
          subjectId: subject.id,
          studentId: student.id,
          courseBucketId: currentBucket.courseBucketId,
          courseId: firstCourse.course.id,
          semesterId,
          allotmentStatus: AllotmentStatus.Pending,
        });

        // Update available seats
        if (currentBucket.availableSeats !== Infinity) {
          currentBucket.availableSeats--;
          currentBucket.effectiveAvailableSeats--;
        }

        studentIndex++;
      }
    }

    // Re-sort buckets after each full pass to maintain least-filled-first order
    sortedBuckets.sort((a, b) => a.currentStudentCount - b.currentStudentCount);
  }

  if (allotments.length > 0) {
    writeOps.push(
      prisma.bucketAllotment.createMany({
        data: allotments,
      })
    );

    // Update seat counts for buckets with limited seats
    const seatUpdates = bucketsWithStats
      .filter(bucket => bucket.availableSeats !== Infinity)
      .map(bucket =>
        prisma.subjectCourseBucketWithSeats.update({
          where: { id: bucket.id },
          data: { availableSeats: bucket.availableSeats },
        })
      );

    writeOps.push(...seatUpdates);
  }
}


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
        select: {
          name: true,
          semester: true,
          batch: true,
          department: true,
          faculty: true,
          school: true,
          isPreferenceWindowOpen: true,
          isAllotmentFinalized: true,
          dueDate: true,
          subjectType: true,
          numberOfCoursesInBucket: true,
          semesters: true,
          programs: {
            include: {
              department: true,
            },
          },
          coursesWithSeats: {
            select: {
              id: true,
              course: {
                select: {
                  id: true,
                  code: true,
                  name: true,
                  credits: true,
                  department: true,
                },
              },
              totalSeats: true,
            },
          },
          courseBucketsWithSeats: {
            select: {
              courseBucket: {
                include: {
                  department: true,
                  courses: {
                    select: {
                      course: {
                        select: {
                          id: true,
                          code: true,
                          credits: true,
                          name: true,
                        },
                      },
                      orderIndex: true,
                    },
                  },
                },
              },
              totalSeats: true,
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
      // First, delete preferences if the subject is being finalized
      if (isAllotmentFinalized) {
        console.log(
          `Deleting preferences for subject ${id} as it is being finalized`,
        );

        // Delete standalone preferences
        const deletedStandalone =
          await prisma.standaloneSubjectPreference.deleteMany({
            where: {
              subjectId: id,
            },
          });
        console.log(
          `Deleted ${deletedStandalone.count} standalone preferences`,
        );

        // Delete bucket preferences
        const deletedBucket = await prisma.bucketSubjectPreference.deleteMany({
          where: {
            subjectId: id,
          },
        });
        console.log(`Deleted ${deletedBucket.count} bucket preferences`);
      }

      // Then update the subject status
      const updatedSubject = await prisma.subject.update({
        where: { id },
        data: {
          isPreferenceWindowOpen,
          isAllotmentFinalized,
          dueDate: isPreferenceWindowOpen ? dueDate : null,
        },
      });

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
        },
        select: {
          id: true,
          name: true,
          subjectType: true,
          dueDate: true,
          isPreferenceWindowOpen: true,
          semester: true,
          semesters: true,
          standaloneSubjectPreferences: {
            where: {
              studentId: student.id,
            },
          },
          bucketSubjectPreferences: {
            where: {
              studentId: student.id,
            },
          },
        },
      });

      const subjectsWithStatus = subjects.map((subject) => {
        const hasPreferences =
          subject.standaloneSubjectPreferences.length > 0 ||
          subject.bucketSubjectPreferences.length > 0;
        return {
          id: subject.id,
          name: subject.name,
          subjectType: subject.subjectType,
          dueDate: subject.dueDate,
          isPreferenceWindowOpen: subject.isPreferenceWindowOpen,
          semester: subject.semester,
          semesters: subject.semesters,
          status: hasPreferences ? Status.Completed : Status.Pending,
        };
      });

      res.status(200).json(subjectsWithStatus);
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
        where: { id: id, isPreferenceWindowOpen: true },
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
        semester: true, // Keep for standalone subjects
        semesters: true, // Add for bucket subjects
        standaloneSubjectPreferences: { 
          where: { runAllotment: true }
        },
        bucketSubjectPreferences: { 
          where: { runAllotment: true }
        },
      },
    });

    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }

    const hasRunAllotment =
      subject.standaloneSubjectPreferences.length > 0 ||
      subject.bucketSubjectPreferences.length > 0;

    if (!hasRunAllotment) {
      res.status(400).json({ error: "No preferences to process for allotment" });
      return;
    }

    // Prepare write operations - KEEP EXISTING LOGIC FOR STANDALONE
    const writeOps: any[] = [
      prisma.standaloneAllotment.deleteMany({ where: { subjectId } }),
      prisma.bucketAllotment.deleteMany({ where: { subjectId } }),
    ];

    if (subject.subjectType.allotmentType === AllotmentType.Standalone) {
      // KEEP ORIGINAL STANDALONE LOGIC UNCHANGED
      const standaloneAllotments = [];

      for (const preference of subject.standaloneSubjectPreferences) {
        const course = await prisma.subjectCourseWithSeats.findUnique({
          where: {
            courseId_subjectId: {
              courseId: preference.firstPreferenceCourseId!,
              subjectId: subject.id,
            },
          },
        });

        if (
          course &&
          (course.availableSeats === null || course.availableSeats > 0)
        ) {
          standaloneAllotments.push({
            subjectId: subject.id,
            studentId: preference.studentId,
            courseId: preference.firstPreferenceCourseId!,
            allotmentStatus: AllotmentStatus.Pending,
          });

          if (course.availableSeats !== null) {
            writeOps.push(
              prisma.subjectCourseWithSeats.update({
                where: { id: course.id },
                data: { availableSeats: course.availableSeats - 1 },
              }),
            );
          }
        }
      }

      if (standaloneAllotments.length > 0) {
        writeOps.push(
          prisma.standaloneAllotment.createMany({
            data: standaloneAllotments,
          }),
        );
      }

    } else if (subject.subjectType.allotmentType === AllotmentType.Bucket) {
      // ONLY MODIFY BUCKET LOGIC
      console.log("Processing bucket allotments");
      
      // FIX: Proper semester determination for buckets
      let semesterId: string | null = null;
      
      // Priority 1: Use semesters array (for bucket subjects)
      if (subject.semesters && subject.semesters.length > 0) {
        semesterId = subject.semesters[0].id;
        console.log(`Using semester from semesters array: ${semesterId}`);
      } 
      // Priority 2: Fallback to single semester (backward compatibility)
      else if (subject.semester) {
        semesterId = subject.semester.id;
        console.log(`Using single semester: ${semesterId}`);
      }

      if (!semesterId) {
        res.status(400).json({ 
          error: "No semester configured for bucket allotment" 
        });
        return;
      }

      const bucketAllotments = [];

      for (const preference of subject.bucketSubjectPreferences) {
        const courseBucketWithSeats = await prisma.subjectCourseBucketWithSeats.findUnique({
          where: {
            courseBucketId_subjectId: {
              courseBucketId: preference.firstPreferenceCourseBucketId!,
              subjectId: subject.id,
            },
          },
          include: {
            courseBucket: {
              include: {
                courses: {
                  include: { 
                    course: true 
                  },
                  orderBy: { orderIndex: "asc" },
                  take: 1, // Keep original logic - take first course
                },
              },
            },
          },
        });

        if (
          courseBucketWithSeats &&
          (courseBucketWithSeats.availableSeats === null ||
            courseBucketWithSeats.availableSeats > 0) &&
          courseBucketWithSeats.courseBucket.courses.length > 0
        ) {
          const firstCourse = courseBucketWithSeats.courseBucket.courses[0];

          bucketAllotments.push({
            subjectId: subject.id,
            studentId: preference.studentId,
            courseBucketId: preference.firstPreferenceCourseBucketId!,
            courseId: firstCourse.course.id,
            semesterId, // Use the properly determined semesterId
            allotmentStatus: AllotmentStatus.Pending,
          });

          if (courseBucketWithSeats.availableSeats !== null) {
            writeOps.push(
              prisma.subjectCourseBucketWithSeats.update({
                where: { id: courseBucketWithSeats.id },
                data: {
                  availableSeats: courseBucketWithSeats.availableSeats - 1,
                },
              }),
            );
          }
        }
      }

      if (bucketAllotments.length > 0) {
        writeOps.push(
          prisma.bucketAllotment.createMany({
            data: bucketAllotments,
          }),
        );
      }
    }

    // Execute all write ops inside a single transaction
    await prisma.$transaction(writeOps);

    res.status(200).json({ message: "Allotments created successfully" });
  } catch (error) {
    console.error("Error creating allotments:", error);
    res.status(500).json({ error: "Internal server error" });
  }
},
 runPendingAllotments: async (req: Request, res: Response): Promise<void> => {
    const { subjectId } = req.params;

    try {
      console.log(`Starting pending allotments for subject ID: ${subjectId}`);

      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
        include: {
          subjectType: true,
          semester: true,
          semesters: true,
          programs: {
            select: { id: true }
          },
          batch: {
            select: { id: true }
          },
          coursesWithSeats: {
            include: {
              course: true,
            },
          },
          courseBucketsWithSeats: {
            include: {
              courseBucket: {
                include: {
                  courses: {
                    include: {
                      course: true,
                    },
                    orderBy: { orderIndex: "asc" },
                  },
                },
              },
            },
          },
        },
      });

      if (!subject) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      // Get all students who should be allotted but haven't been
      const totalStudents = await prisma.student.count({
        where: {
          batchId: subject.batch.id,
          programId: {
            in: subject.programs.map(program => program.id)
          },
          isDeleted: false
        }
      });

      // Get already allotted students
      const allottedStudents = await prisma.student.findMany({
        where: {
          OR: [
            {
              standaloneAllotments: {
                some: { subjectId }
              }
            },
            {
              bucketAllotments: {
                some: { subjectId }
              }
            }
          ]
        },
        select: { id: true }
      });

      const allottedStudentIds = new Set(allottedStudents.map(s => s.id));

      // Get unallotted students (students with no preferences filled)
      const unallottedStudents = await prisma.student.findMany({
        where: {
          batchId: subject.batch.id,
          programId: {
            in: subject.programs.map(program => program.id)
          },
          isDeleted: false,
          id: {
            notIn: Array.from(allottedStudentIds)
          },
          // Students who didn't fill preferences for this subject
          AND: [
            {
              standaloneSubjectPreferences: {
                none: {
                  subjectId: subjectId
                }
              }
            },
            {
              bucketSubjectPreferences: {
                none: {
                  subjectId: subjectId
                }
              }
            }
          ]
        },
        select: {
          id: true,
          registrationNumber: true,
          firstName: true,
          lastName: true,
        }
      });

      console.log(`Found ${unallottedStudents.length} unallotted students`);

      if (unallottedStudents.length === 0) {
        res.status(400).json({ error: "No pending students to allot" });
        return;
      }

      const writeOps: any[] = [];

      if (subject.subjectType.allotmentType === AllotmentType.Standalone) {
        await processStandalonePendingAllotments(
          subject,
          unallottedStudents,
          writeOps
        );
      } else if (subject.subjectType.allotmentType === AllotmentType.Bucket) {
        await processBucketPendingAllotments(
          subject,
          unallottedStudents,
          writeOps
        );
      }

      // Execute all write operations in a transaction
      if (writeOps.length > 0) {
        await prisma.$transaction(writeOps);
        console.log(`Successfully allotted ${unallottedStudents.length} pending students`);
      }

      res.status(200).json({ 
        message: `Pending allotments completed successfully. Allotted ${unallottedStudents.length} students.`,
        allottedCount: unallottedStudents.length
      });

    } catch (error) {
      console.error("Error running pending allotments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },


  getSubjectAllotments: async (req: Request, res: Response): Promise<void> => {
    const { subjectId } = req.params;
    const { search, page = 1, pageSize = 6 } = req.query;

    try {
      const allotmentsInfo = await prisma.subject.findUnique({
        where: { id: subjectId },
        select: {
          standaloneAllotments: {
            where: search
              ? {
                  student: {
                    OR: [
                      {
                        firstName: {
                          contains: search as string,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        lastName: {
                          contains: search as string,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        registrationNumber: {
                          contains: search as string,
                          mode: "insensitive" as const,
                        },
                      },
                    ],
                  },
                }
              : undefined,
            select: {
              student: {
                select: {
                  registrationNumber: true,
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
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
          },
          bucketAllotments: {
            where: search
              ? {
                  student: {
                    OR: [
                      {
                        firstName: {
                          contains: search as string,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        lastName: {
                          contains: search as string,
                          mode: "insensitive" as const,
                        },
                      },
                      {
                        registrationNumber: {
                          contains: search as string,
                          mode: "insensitive" as const,
                        },
                      },
                    ],
                  },
                }
              : undefined,
            select: {
              student: {
                select: {
                  registrationNumber: true,
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
            skip: (Number(page) - 1) * Number(pageSize),
            take: Number(pageSize),
          },
        },
      });

      if (!allotmentsInfo) {
        res.status(404).json({ error: "Subject not found" });
        return;
      }

      const [totalStandaloneAllotments, totalBucketAllotments] =
        await Promise.all([
          prisma.standaloneAllotment.count({
            where: {
              subjectId,
              ...(search
                ? {
                    student: {
                      OR: [
                        {
                          firstName: {
                            contains: search as string,
                            mode: "insensitive" as const,
                          },
                        },
                        {
                          lastName: {
                            contains: search as string,
                            mode: "insensitive" as const,
                          },
                        },
                      ],
                    },
                  }
                : {}),
            },
          }),
          prisma.bucketAllotment.count({
            where: {
              subjectId,
              ...(search
                ? {
                    student: {
                      OR: [
                        {
                          firstName: {
                            contains: search as string,
                            mode: "insensitive" as const,
                          },
                        },
                        {
                          lastName: {
                            contains: search as string,
                            mode: "insensitive" as const,
                          },
                        },
                      ],
                    },
                  }
                : {}),
            },
          }),
        ]);

      const totalAllotments = totalStandaloneAllotments + totalBucketAllotments;
      const totalPages = Math.ceil(totalAllotments / Number(pageSize));

      res.status(200).json({
        ...allotmentsInfo,
        totalPages,
        currentPage: Number(page),
      });
    } catch (error) {
      console.error("Error fetching allotments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

 // In SubjectController.ts - update getAllotmentStats function
getAllotmentStats: async (req: Request, res: Response): Promise<void> => {
  const { subjectId } = req.params;

  try {
    // First, get the subject to find its batch and programs
    const subject = await prisma.subject.findUnique({
      where: { id: subjectId },
      include: {
        programs: {
          select: { id: true }
        },
        batch: {
          select: { id: true }
        }
      }
    });

    if (!subject) {
      res.status(404).json({ error: "Subject not found" });
      return;
    }

    // Use the EXACT SAME logic as getSubjectPreferences
    const totalStudents = await prisma.student.count({
      where: {
        batchId: subject.batch.id,
        programId: {
          in: subject.programs.map(program => program.id)
        },
        isDeleted: false
      }
    });

    console.log(`Total students for subject ${subjectId}:`, totalStudents);
    console.log('Batch ID:', subject.batch.id);
    console.log('Program IDs:', subject.programs.map(p => p.id));

    // Rest of your existing code for courses and buckets...
    const allCourses = await prisma.subjectCourseWithSeats.findMany({
      where: { subjectId },
      select: {
        course: {
          select: { id: true, name: true, code: true },
        },
      },
    });

    const allCourseBuckets = await prisma.subjectCourseBucketWithSeats.findMany({
      where: { subjectId },
      select: {
        courseBucket: {
          select: { id: true, name: true },
        },
      },
    });

    const courseStats = await prisma.standaloneAllotment.groupBy({
      by: ["courseId"],
      where: { subjectId },
      _count: { courseId: true },
    });

    const courseBucketStats = await prisma.bucketAllotment.groupBy({
      by: ["courseBucketId"],
      where: { subjectId },
      _count: { courseBucketId: true },
    });

    const courses = allCourses.map(({ course }) => {
      const stat = courseStats.find((s) => s.courseId === course.id);
      return {
        id: course.id,
        name: course.name,
        code: course.code,
        studentCount: stat ? stat._count.courseId : 0,
      };
    });

    const courseBuckets = allCourseBuckets.map(({ courseBucket }) => {
      const stat = courseBucketStats.find(
        (s) => s.courseBucketId === courseBucket.id,
      );
      return {
        id: courseBucket.id,
        name: courseBucket.name,
        studentCount: stat ? stat._count.courseBucketId : 0,
      };
    });

    const totalAllottedStudents =
      courseStats.reduce((acc, stat) => acc + stat._count.courseId, 0) +
      courseBucketStats.reduce((acc, stat) => acc + stat._count.courseBucketId, 0);

    const unallottedStudents = totalStudents - totalAllottedStudents;

    const result = {
      courses: [...courses],
      courseBuckets: [...courseBuckets],
      totalStudents,
      totalAllottedStudents,
      unallottedStudents,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching allotment stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
},

  updateSubject: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const {
      name,
      batchId,
      subjectTypeId,
      semesterId,
      departmentId,
      schoolId,
      facultyId,
      programIds,
      coursesWithSeats,
    } = req.body;

    try {
      // Build the update data object dynamically
      const updateData: any = {};

      if (name) updateData.name = name;
      if (batchId) updateData.batch = { connect: { id: batchId } };
      if (subjectTypeId)
        updateData.subjectType = { connect: { id: subjectTypeId } };
      if (semesterId) updateData.semester = { connect: { id: semesterId } };
      if (departmentId)
        updateData.department = { connect: { id: departmentId } };
      if (schoolId) updateData.school = { connect: { id: schoolId } };
      if (facultyId) updateData.faculty = { connect: { id: facultyId } };
      if (programIds) {
        updateData.programs = {
          set: programIds.map((programId: string) => ({ id: programId })),
        };
      }

      // Update the subject
      const updatedSubject = await prisma.subject.update({
        where: { id },
        data: updateData,
      });

      // Update courses with seats if provided
      if (coursesWithSeats && coursesWithSeats.length > 0) {
        await prisma.subjectCourseWithSeats.deleteMany({
          where: { subjectId: id },
        });

        await prisma.subjectCourseWithSeats.createMany({
          data: coursesWithSeats.map(
            ({ id: courseId, seats }: { id: string; seats: number }) => ({
              courseId,
              subjectId: id,
              totalSeats: seats && seats !== 0 ? seats : null,
              availableSeats: seats && seats !== 0 ? seats : null,
            }),
          ),
        });
      }

      res.status(200).json({
        message: "Subject updated successfully",
        subject: updatedSubject,
      });
    } catch (error) {
      console.error("Error updating subject:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getStudentAllotments: async (req: Request, res: Response): Promise<void> => {
    const { id: studentId } = req.user; // Assuming `req.user` contains the authenticated student's ID

    try {
      // Fetch standalone allotments
      const standaloneAllotments = await prisma.standaloneAllotment.findMany({
        where: { studentId },
        include: {
          course: {
            select: {
              id: true,
              name: true,
              code: true,
              credits: true,
              department: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
              semester: {
                select: {
                  id: true,
                  number: true,
                },
              },
              semesters: {
                select: {
                  id: true,
                  number: true,
                },
              },
            },
          },
        },
      });

      // Fetch bucket allotments
      const bucketAllotments = await prisma.bucketAllotment.findMany({
        where: { studentId },
        include: {
          courseBucket: {
            select: {
              id: true,
              name: true,
              courses: {
                select: {
                  course: {
                    select: {
                      id: true,
                      name: true,
                      code: true,
                      credits: true,
                      department: {
                        select: {
                          id: true,
                          name: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          subject: {
            select: {
              id: true,
              name: true,
            },
          },
          semester: {
            select: {
              id: true,
              number: true,
            },
          },
        },
      });

      // Combine results
      res.status(200).json({
        standaloneAllotments,
        bucketAllotments,
      });
    } catch (error) {
      console.error("Error fetching student allotments:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  getSubjectCourseStudents: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { subjectCourseWithSeatsId } = req.params;
    const { sectionId, search, page = 1, limit = 10 } = req.query;

    try {
      if (!subjectCourseWithSeatsId) {
        res.status(400).json({ error: "Subject course ID is required" });
        return;
      }

      const skip = (Number(page) - 1) * Number(limit);

      // First get the subject course details
      const subjectCourse = await prisma.subjectCourseWithSeats.findUnique({
        where: {
          id: subjectCourseWithSeatsId,
        },
        include: {
          subject: {
            select: {
              id: true,
              name: true,
              subjectType: {
                select: {
                  name: true,
                  allotmentType: true,
                },
              },
              batch: {
                select: {
                  year: true,
                },
              },
            },
          },
          course: {
            select: {
              id: true,
              name: true,
              code: true,
              credits: true,
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!subjectCourse) {
        res.status(404).json({ error: "Subject course not found" });
        return;
      }

      const where = {
        AND: [
          {
            isDeleted: false,
            electiveSections: {
              some: {
                subjectCourseWithSeatsId,
                ...(sectionId ? { id: sectionId as string } : {}),
              },
            },
          },
          search
            ? {
                OR: [
                  {
                    firstName: {
                      contains: search as string,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    lastName: {
                      contains: search as string,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    registrationNumber: {
                      contains: search as string,
                      mode: "insensitive" as const,
                    },
                  },
                ],
              }
            : {},
        ],
      };

      const [totalCount, students] = await prisma.$transaction([
        prisma.student.count({ where }),
        prisma.student.findMany({
          where,
          select: {
            id: true,
            firstName: true,
            middleName: true,
            lastName: true,
            registrationNumber: true,
            semester: true,
            program: {
              select: {
                name: true,
                department: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            batch: {
              select: {
                year: true,
              },
            },
            electiveSections: {
              where: {
                subjectCourseWithSeatsId,
              },
              select: {
                name: true,
              },
            },
          },
          orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
          skip,
          take: Number(limit),
        }),
      ]);

      const totalPages = Math.ceil(totalCount / Number(limit));

      res.status(200).json({
        subjectCourse: {
          id: subjectCourse.id,
          subject: subjectCourse.subject,
          course: subjectCourse.course,
        },
        students,
        pagination: {
          currentPage: Number(page),
          totalPages,
          totalItems: totalCount,
          hasMore: Number(page) < totalPages,
        },
      });
    } catch (error) {
      console.error("Error fetching subject course students:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getSubjectCourseInfo: async (req: Request, res: Response): Promise<void> => {
    try {
      const { subjectCourseWithSeatsId } = req.params;

      const subjectCourseWithSeats =
        await prisma.subjectCourseWithSeats.findUnique({
          where: {
            id: subjectCourseWithSeatsId,
          },
          include: {
            subject: {
              include: {
                batch: true,
                subjectType: true,
              },
            },
            course: {
              include: {
                department: true,
              },
            },
            sections: {
              include: {
                students: {
                  select: {
                    id: true,
                    registrationNumber: true,
                    firstName: true,
                    middleName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        });

      if (!subjectCourseWithSeats) {
        res.status(404).json({ message: "Subject course not found" });
        return;
      }

      const response = {
        id: subjectCourseWithSeats.id,
        subject: {
          id: subjectCourseWithSeats.subject.id,
          name: subjectCourseWithSeats.subject.name,
          batch: subjectCourseWithSeats.subject.batch,
          subjectType: subjectCourseWithSeats.subject.subjectType,
        },
        course: {
          id: subjectCourseWithSeats.course.id,
          name: subjectCourseWithSeats.course.name,
          code: subjectCourseWithSeats.course.code,
          credits: subjectCourseWithSeats.course.credits,
          department: subjectCourseWithSeats.course.department,
        },
        totalSeats: subjectCourseWithSeats.totalSeats,
        availableSeats: subjectCourseWithSeats.availableSeats,
        sections: subjectCourseWithSeats.sections.map((section) => ({
          id: section.id,
          name: section.name,
          students: section.students,
        })),
      };

      res.json(response);
    } catch (error) {
      console.error("Error fetching subject course info:", error);
      res.status(500).json({ message: "Error fetching subject course info" });
    }
  },
};

export default SubjectController;
