import { Request, Response } from "express";
import { prisma } from "../prismaClient";

const ElectiveSectionController = {
  // Get all professors
  getProfessors: async (req: Request, res: Response): Promise<void> => {
    const { search } = req.query;

    try {
      const professors = await prisma.professor.findMany({
        where: {
          isDeleted: false,
          OR: search
            ? [
                {
                  firstName: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: { contains: search as string, mode: "insensitive" },
                },
                { email: { contains: search as string, mode: "insensitive" } },
                {
                  registrationNumber: {
                    contains: search as string,
                    mode: "insensitive",
                  },
                },
              ]
            : undefined,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          registrationNumber: true,
          department: {
            select: {
              name: true,
              school: {
                select: {
                  name: true,
                },
              },
            },
          },
          professorRank: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
      });

      res.status(200).json(professors);
    } catch (error) {
      console.error("Error fetching professors:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Get all courses for a subject
  getSubjectCourses: async (req: Request, res: Response): Promise<void> => {
    const { subjectId } = req.params;

    try {
      const subjectCourses = await prisma.subjectCourseWithSeats.findMany({
        where: {
          subjectId,
        },
        select: {
          id: true,
          course: {
            select: {
              id: true,
              name: true,
              code: true,
              credits: true,
            },
          },
          totalSeats: true,
          availableSeats: true,
        },
      });

      res.status(200).json(subjectCourses);
    } catch (error) {
      console.error("Error fetching subject courses:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Fetch all sections for a subject (across all courses)
  getSubjectSections: async (req: Request, res: Response): Promise<void> => {
    const { subjectId } = req.params;

    try {
      const sections = await prisma.electiveSection.findMany({
        where: {
          SubjectCourseWithSeats: {
            subject: {
              id: subjectId,
            },
          },
        },
        include: {
          Course: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          professor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          students: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              registrationNumber: true,
            },
          },
          SubjectCourseWithSeats: {
            select: {
              id: true,
              totalSeats: true,
              availableSeats: true,
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json(sections);
    } catch (error) {
      console.error("Error fetching subject sections:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Fetch all sections for a specific subject-course combination
  getSubjectCourseSections: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { subjectCourseWithSeatsId } = req.params;

    try {
      const sections = await prisma.electiveSection.findMany({
        where: {
          subjectCourseWithSeatsId,
        },
        include: {
          Course: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
          professor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          students: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              registrationNumber: true,
            },
          },
          SubjectCourseWithSeats: {
            select: {
              id: true,
              totalSeats: true,
              availableSeats: true,
              subject: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      res.status(200).json(sections);
    } catch (error) {
      console.error("Error fetching subject course sections:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Fetch a section by ID with complete details
  getSectionById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      const section = await prisma.electiveSection.findUnique({
        where: { id },
        include: {
          Course: {
            select: {
              id: true,
              name: true,
              code: true,
              credits: true,
            },
          },
          professor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              professorRank: {
                select: {
                  name: true,
                },
              },
            },
          },
          students: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              registrationNumber: true,
              email: true,
              program: {
                select: {
                  name: true,
                },
              },
            },
          },
          SubjectCourseWithSeats: {
            select: {
              id: true,
              totalSeats: true,
              availableSeats: true,
              subject: {
                select: {
                  id: true,
                  name: true,
                  isPreferenceWindowOpen: true,
                  isAllotmentFinalized: true,
                  subjectType: {
                    select: {
                      name: true,
                      allotmentType: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!section) {
        res.status(404).json({ message: "Section not found" });
        return;
      }

      res.status(200).json(section);
    } catch (error) {
      console.error("Error fetching section by ID:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Create a new section
  createSection: async (req: Request, res: Response): Promise<void> => {
    const { name, subjectCourseWithSeatsId, courseId, professorId } = req.body;

    if (!name || !subjectCourseWithSeatsId || !courseId) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    try {
      // First verify that the SubjectCourseWithSeats exists and has available seats
      const subjectCourse = await prisma.subjectCourseWithSeats.findUnique({
        where: { id: subjectCourseWithSeatsId },
        select: {
          availableSeats: true,
          course: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!subjectCourse) {
        res.status(404).json({ error: "Subject course not found" });
        return;
      }

      if (
        subjectCourse.availableSeats !== null &&
        subjectCourse.availableSeats <= 0
      ) {
        res.status(400).json({ error: "No available seats in this course" });
        return;
      }

      // Verify that the courseId matches the course in SubjectCourseWithSeats
      if (subjectCourse.course.id !== courseId) {
        res.status(400).json({ error: "Course ID mismatch" });
        return;
      }

      const newSection = await prisma.electiveSection.create({
        data: {
          name,
          professorId,
          subjectCourseWithSeatsId,
          courseId,
        },
        include: {
          SubjectCourseWithSeats: {
            select: {
              id: true,
              totalSeats: true,
              availableSeats: true,
            },
          },
        },
      });

      res
        .status(201)
        .json({ message: "Section created successfully", section: newSection });
    } catch (error) {
      console.error("Error creating section:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Update an existing section
  updateSection: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { name, courseId, professorId, subjectCourseWithSeatsId } = req.body;

    try {
      const updatedSection = await prisma.electiveSection.update({
        where: { id },
        data: {
          name,
          courseId,
          professorId,
          subjectCourseWithSeatsId,
        },
        include: {
          SubjectCourseWithSeats: {
            select: {
              id: true,
              totalSeats: true,
              availableSeats: true,
            },
          },
        },
      });

      res.status(200).json({
        message: "Section updated successfully",
        section: updatedSection,
      });
    } catch (error) {
      console.error("Error updating section:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  // Delete a section
  deleteSection: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
      // Check if section exists and get student count
      const section = await prisma.electiveSection.findUnique({
        where: { id },
        include: {
          students: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!section) {
        res.status(404).json({ error: "Section not found" });
        return;
      }

      // Don't allow deletion if section has students
      if (section.students.length > 0) {
        res.status(400).json({
          error:
            "Cannot delete section with enrolled students. Please remove all students first.",
        });
        return;
      }

      // Delete the section
      await prisma.electiveSection.delete({
        where: { id },
      });

      res.status(200).json({ message: "Section deleted successfully" });
    } catch (error) {
      console.error("Error deleting section:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },

  allotStudentsToSections: async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const { subjectId } = req.params;
    const SECTION_CAPACITY = 70;

    try {
      // Combine deletion and reset in a single transaction
      await prisma.$transaction([
        prisma.electiveSection.deleteMany({
          where: {
            SubjectCourseWithSeats: { subjectId },
          },
        }),
        ...(await prisma.subjectCourseWithSeats
          .findMany({
            where: { subjectId },
            select: { id: true, totalSeats: true },
          })
          .then((courses) =>
            courses.map((course) =>
              prisma.subjectCourseWithSeats.update({
                where: { id: course.id },
                data: { availableSeats: course.totalSeats },
              }),
            ),
          )),
      ]);

      // Get courses and students in parallel
      const [subjectCourses, students] = await Promise.all([
        prisma.subjectCourseWithSeats.findMany({
          where: { subjectId },
          select: {
            id: true,
            courseId: true,
            totalSeats: true,
          },
        }),
        prisma.student.findMany({
          where: {
            isDeleted: false,
            standaloneSubjectPreferences: {
              some: { subjectId, runAllotment: true },
            },
          },
          select: {
            id: true,
            sectionId: true,
            standaloneSubjectPreferences: {
              where: { subjectId },
              select: {
                firstPreferenceCourseId: true,
                secondPreferenceCourseId: true,
                thirdPreferenceCourseId: true,
              },
            },
          },
          orderBy: { sectionId: "asc" },
        }),
      ]);

      if (!subjectCourses.length) {
        res.status(404).json({ error: "No courses found for this subject" });
        return;
      }

      if (!students.length) {
        res.status(404).json({ error: "No students found for allotment" });
        return;
      }

      // Pre-calculate sections and create them in a single transaction
      const sectionCreations = [];
      const courseSections: Record<string, string[]> = {};
      const sectionMap: Record<string, Record<string, string>> = {};

      for (const course of subjectCourses) {
        const requiredSections = Math.ceil(
          (course.totalSeats || SECTION_CAPACITY) / SECTION_CAPACITY,
        );
        const courseCreateData = Array(requiredSections)
          .fill(0)
          .map((_, index) => ({
            data: {
              name: String.fromCharCode(65 + index),
              subjectCourseWithSeatsId: course.id,
              courseId: course.courseId,
            },
          }));
        sectionCreations.push(...courseCreateData);
        sectionMap[course.courseId] = {};
      }

      const createdSections = await prisma.$transaction(
        sectionCreations.map((data) => prisma.electiveSection.create(data)),
      );

      // Map created sections to courses
      let sectionIndex = 0;
      for (const course of subjectCourses) {
        const requiredSections = Math.ceil(
          (course.totalSeats || SECTION_CAPACITY) / SECTION_CAPACITY,
        );
        courseSections[course.courseId] = createdSections
          .slice(sectionIndex, sectionIndex + requiredSections)
          .map((s) => s.id);
        sectionIndex += requiredSections;
      }

      // Group students by section and preferences
      const sectionGroups: Record<
        string,
        Array<{
          studentId: string;
          preferences: string[];
        }>
      > = {};

      students.forEach((student) => {
        const sectionId = student.sectionId || "unassigned";
        if (!sectionGroups[sectionId]) sectionGroups[sectionId] = [];
        const prefs = student.standaloneSubjectPreferences[0];
        const preferences = [
          prefs.firstPreferenceCourseId,
          prefs.secondPreferenceCourseId,
          prefs.thirdPreferenceCourseId,
        ].filter(Boolean) as string[];
        sectionGroups[sectionId].push({ studentId: student.id, preferences });
      });

      // Batch allotment process
      const allotments: { sectionId: string; studentId: string }[] = [];
      const sectionCapacity: Record<string, number> = {};

      // First pass: Try to keep same section students together
      for (const [originalSectionId, sectionStudents] of Object.entries(
        sectionGroups,
      )) {
        // Group students by their first preference
        const preferenceGroups: Record<string, typeof sectionStudents> = {};

        sectionStudents.forEach((student) => {
          const firstPref = student.preferences[0];
          if (firstPref) {
            preferenceGroups[firstPref] = preferenceGroups[firstPref] || [];
            preferenceGroups[firstPref].push(student);
          }
        });

        // Try to allocate groups to same sections
        for (const [courseId, students] of Object.entries(preferenceGroups)) {
          const availableSections = courseSections[courseId] || [];
          let targetSectionId = sectionMap[courseId][originalSectionId];

          if (!targetSectionId) {
            for (const sectionId of availableSections) {
              const currentCapacity = sectionCapacity[sectionId] || 0;
              if (currentCapacity < SECTION_CAPACITY) {
                targetSectionId = sectionId;
                sectionMap[courseId][originalSectionId] = sectionId;
                break;
              }
            }
          }

          if (targetSectionId) {
            for (const student of students) {
              const currentCapacity = sectionCapacity[targetSectionId] || 0;
              if (currentCapacity < SECTION_CAPACITY) {
                allotments.push({
                  sectionId: targetSectionId,
                  studentId: student.studentId,
                });
                sectionCapacity[targetSectionId] = currentCapacity + 1;
              }
            }
          }
        }
      }

      // Second pass: Allocate remaining students
      for (const sectionStudents of Object.values(sectionGroups)) {
        for (const student of sectionStudents) {
          if (!allotments.find((a) => a.studentId === student.studentId)) {
            let allocated = false;

            // Try preferences in order
            for (const courseId of student.preferences) {
              const availableSections = courseSections[courseId] || [];
              for (const sectionId of availableSections) {
                const currentCapacity = sectionCapacity[sectionId] || 0;
                if (currentCapacity < SECTION_CAPACITY) {
                  allotments.push({
                    sectionId,
                    studentId: student.studentId,
                  });
                  sectionCapacity[sectionId] = currentCapacity + 1;
                  allocated = true;
                  break;
                }
              }
              if (allocated) break;
            }

            // Fallback if still not allocated
            if (!allocated) {
              for (const sections of Object.values(courseSections)) {
                for (const sectionId of sections) {
                  const currentCapacity = sectionCapacity[sectionId] || 0;
                  if (currentCapacity < SECTION_CAPACITY) {
                    allotments.push({
                      sectionId,
                      studentId: student.studentId,
                    });
                    sectionCapacity[sectionId] = currentCapacity + 1;
                    allocated = true;
                    break;
                  }
                }
                if (allocated) break;
              }
            }
          }
        }
      }

      // Batch update allotments in chunks
      const CHUNK_SIZE = 1000;
      for (let i = 0; i < allotments.length; i += CHUNK_SIZE) {
        const chunk = allotments.slice(i, i + CHUNK_SIZE);
        await prisma.$transaction(
          chunk.map(({ sectionId, studentId }) =>
            prisma.electiveSection.update({
              where: { id: sectionId },
              data: {
                students: { connect: { id: studentId } },
                SubjectCourseWithSeats: {
                  update: { availableSeats: { decrement: 1 } },
                },
              },
            }),
          ),
        );
      }

      res.status(200).json({
        message: "Students allotted to sections successfully",
        allotmentsCount: allotments.length,
      });
    } catch (error) {
      console.error("Error allotting students to sections:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
};

export default ElectiveSectionController;
