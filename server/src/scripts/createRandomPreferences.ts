import { PrismaClient } from "@prisma/client";
import { shuffle } from "lodash";

const prisma = new PrismaClient();

async function assignPreferencesToAllStudents() {
  try {
    console.log("Starting preference assignment for all students...");

    // Fetch all subjects with open preference windows
    const subjects = await prisma.subject.findMany({
      where: {
        isPreferenceWindowOpen: true,
      },
      include: {
        coursesWithSeats: {
          include: {
            course: true,
          },
        },
      },
    });

    if (subjects.length === 0) {
      console.log("No subjects with open preference windows found.");
      return;
    }

    console.log(
      `Found ${subjects.length} subjects with open preference windows.`,
    );

    // Process each subject
    for (const subject of subjects) {
      console.log(`Processing subject: ${subject.name}`);

      // Fetch all students eligible for this subject
      const students = await prisma.student.findMany({
        where: {
          program: {
            subjects: {
              some: {
                id: subject.id,
              },
            },
          },
          isDeleted: false,
        },
      });

      if (students.length === 0) {
        console.log(`No students found for subject: ${subject.name}`);
        continue;
      }

      console.log(
        `Found ${students.length} students for subject: ${subject.name}`,
      );

      // Get available courses for the subject
      const availableCourses = subject.coursesWithSeats.map(
        (cws) => cws.course,
      );
      if (availableCourses.length === 0) {
        console.log(`No courses available for subject: ${subject.name}`);
        continue;
      }

      // Assign preferences for each student
      for (const student of students) {
        console.log(
          `Assigning preferences for student: ${student.registrationNumber}`,
        );

        // Randomly shuffle courses for preferences
        const shuffledCourses = shuffle(availableCourses);
        const preferences = shuffledCourses.slice(
          0,
          Math.min(3, shuffledCourses.length),
        );

        // Create or update preferences for the student
        await prisma.standaloneSubjectPreference.upsert({
          where: {
            subjectId_studentId: {
              subjectId: subject.id,
              studentId: student.id,
            },
          },
          create: {
            subjectId: subject.id,
            studentId: student.id,
            firstPreferenceCourseId: preferences[0]?.id || null,
            secondPreferenceCourseId: preferences[1]?.id || null,
            thirdPreferenceCourseId: preferences[2]?.id || null,
            runAllotment: true,
          },
          update: {
            firstPreferenceCourseId: preferences[0]?.id || null,
            secondPreferenceCourseId: preferences[1]?.id || null,
            thirdPreferenceCourseId: preferences[2]?.id || null,
            runAllotment: true,
          },
        });

        console.log(
          `Preferences assigned for student: ${student.registrationNumber}`,
        );
      }
    }

    console.log("Preference assignment completed successfully!");
  } catch (error) {
    console.error("Error during preference assignment:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
assignPreferencesToAllStudents()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
