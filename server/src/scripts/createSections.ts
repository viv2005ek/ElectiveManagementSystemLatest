import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createSections() {
  try {
    console.log("Starting section creation...");

    // Get all programs
    const programs = await prisma.program.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // Get all batches
    const batches = await prisma.batch.findMany({
      select: {
        id: true,
        year: true,
      },
      orderBy: {
        year: "desc",
      },
    });

    console.log(
      `Found ${programs.length} programs and ${batches.length} batches`,
    );

    // Create sections for each program-batch combination
    for (const program of programs) {
      for (const batch of batches) {
        console.log(`Creating sections for ${program.name} - ${batch.year}`);

        // Create 5 sections for each combination
        const sectionLetters = ["A", "B", "C", "D", "E"];
        const createdSections = [];

        for (const letter of sectionLetters) {
          const section = await prisma.section.create({
            data: {
              name: `${letter}`,
              program: {
                connect: { id: program.id },
              },
              batch: {
                connect: { id: batch.id },
              },
            },
          });
          createdSections.push(section);
          console.log(`Created section ${section.name}`);
        }

        // Get all students for this program and batch
        const students = await prisma.student.findMany({
          where: {
            programId: program.id,
            batchId: batch.id,
            sectionId: null, // Only get students without a section
          },
          select: {
            id: true,
            firstName: true,
            lastName: true,
            registrationNumber: true,
          },
        });

        console.log(
          `Found ${students.length} students to assign for ${program.name} - ${batch.year}`,
        );

        // Randomly assign students to sections
        for (const student of students) {
          const randomSection =
            createdSections[Math.floor(Math.random() * createdSections.length)];
          await prisma.student.update({
            where: { id: student.id },
            data: {
              section: {
                connect: { id: randomSection.id },
              },
            },
          });
          console.log(
            `Assigned ${student.registrationNumber} to section ${randomSection.name}`,
          );
        }
      }
    }

    console.log(
      "Section creation and student assignment completed successfully!",
    );
  } catch (error) {
    console.error("Error in section creation:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createSections()
  .then(() => {
    console.log("Script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
