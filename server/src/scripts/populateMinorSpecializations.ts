import { prisma } from '../prismaClient'; // Import your Prisma client instance

async function populateMinorSpecializations() {
  try {
    // Ensure the department exists; use an existing departmentId or create one
    const department = await prisma.department.findFirst();
    if (!department) {
      throw new Error("No department found. Please create a department first.");
    }

    // Create 5 minor specializations, each with 5 electives
    const minorSpecializations = await Promise.all(
      Array.from({ length: 5 }, (_, index) => {
        return prisma.minorSpecialization.create({
          data: {
            name: `Minor Specialization ${index + 1}`,
            departmentId: department.id, // Associate with an existing department
            ProgrammeElectives: {
              create: Array.from({ length: 5 }, (_, idx) => ({
                courseCode: `Elective-${index + 1}-${idx + 1}`,
                name: `Elective ${idx + 1} for Minor ${index + 1}`,
                semester: idx + 1, // Assign semesters incrementally
              })),
            },
          },
        });
      })
    );

    console.log('Minor Specializations created successfully:', minorSpecializations);
  } catch (error: any) {
    console.error('Error creating Minor Specializations:', error.message);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}

// Run the script
populateMinorSpecializations();
