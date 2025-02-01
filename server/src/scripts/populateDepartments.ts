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

    // Create departments and branches
    const departments = await Promise.all(
      departmentNames.map((name, index) =>
        prisma.department.create({
          data: {
            name,
            branches: {
              create: [
                {
                  name: `${name} - Branch 1`, // Create Branch 1 for each department
                },
                {
                  name: `${name} - Branch 2`, // Create Branch 2 for each department
                },
              ],
            },
          },
        })
      )
    );

    console.log('Departments and branches created successfully:', departments);
  } catch (error: any) {
    console.error('Error populating departments:', error.message);
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client
  }
}

// Run the script
populateDepartments();
