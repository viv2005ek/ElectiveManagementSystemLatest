import { prisma } from '../prismaClient'; // Import your Prisma client instance

async function createMinorSpecializations() {
  // Create 5 Minor Specializations
  const minorSpecializations = await Promise.all(
    Array.from({ length: 5 }, (_, index) => {
      return prisma.minorSpecialization.create({
        data: {
          name: `Minor Specialization ${index + 1}`,
          ProgrammeElectives: {
            create: Array.from({ length: 5 }, (_, idx) => ({
              courseCode: `ELEC-${index + 1}-${idx + 1}`,
              name: `Elective ${idx + 1} for Minor ${index + 1}`,
              semester: 1, // or any appropriate semester value
            })),
          },
        },
      });
    })
  );

  console.log('Minor Specializations created:', minorSpecializations);
}

createMinorSpecializations()
  .catch((error) => {
    console.error('Error creating Minor Specializations:', error);
  })
  .finally(() => {
    prisma.$disconnect(); // Disconnect Prisma client when done
  });
