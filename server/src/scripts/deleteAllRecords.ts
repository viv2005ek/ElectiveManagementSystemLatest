import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearDatabase() {
  try {
    console.log("Deleting all records...");

    // Disable foreign key constraints temporarily
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
      "CourseAllotment", "SubjectPreferences",
      "CourseBucket", "CourseCategory", "Course",
      "Student", "Faculty", "Admin",
      "Credential", "Branch", "Department"
      RESTART IDENTITY CASCADE;
    `);

    console.log("All records deleted successfully ✅");
  } catch (error) {
    console.error("Error clearing database:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
clearDatabase();
