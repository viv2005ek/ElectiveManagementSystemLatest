import { prisma } from '../prismaClient'; // Adjust the import path to your Prisma client

async function populateDepartments() {
  try {
    // Define the department names
    const departmentNames = [
      'Computer Science and Engineering',
      'Mechanical Engineering',
      'Electrical Engineering',
      'Civil Engineering',
      'Chemical Engineering',
    ];

    // Create the departments
    const departments = await Promise.all(
      departmentNames.map((name) =>
        prisma.department.create({
          data: { name },
        })
      )
    );

    console.log('Departments created successfully:', departments);
  } catch (error: any) {
    console.error('Error populating departments:', error.message);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}

// Run the script
populateDepartments();
