import { prisma } from '../prismaClient'; // Adjust the import path to your Prisma client

const addStudents = async () => {
  try {
    const departments = await Promise.all(
      Array.from({ length: 5 }, (_, index) => {
        return prisma.department.upsert({
          where: { name: `Department ${(index + 1)}` },
          update: {},
          create: { name: `Department ${(index + 1)}` },
        });
      })
    );

    const branches = await Promise.all(
      Array.from({ length: 3 }, (_, index) => {
        return prisma.branch.upsert({
          where: { name: `Branch ${(index + 1)}` },
          update: {},
          create: {
            name: `Branch ${(index + 1)}`,
            departmentId: departments[index % 5].id,
          },
        });
      })
    );

    const students = Array.from({ length: 20 }, (_, index) => ({
      registrationNumber: `REG${1000 + index}`,
      email: `student${index + 1}@example.com`,
      firstName: `Student${index + 1}`,
      lastName: 'Doe',
      gender: index % 2 === 0 ? 'Male' : 'Female',
      semester: Math.floor(Math.random() * 8) + 1,
      departmentId: departments[index % 5].id,
      branchId: branches[index % 3].id,
      section: `Section ${String.fromCharCode(65 + (index % 5))}`,
      batch: Math.floor(Math.random() * 10) + 1,
      contactNumber: `123456789${index + 1}`,
    }));

    // Insert students into the database
    const result = await prisma.student.createMany({
      data: students,
    });

    console.log(`Successfully added ${result.count} students.`);
  } catch (error) {
    console.error('Error adding students:', error);
  }
};

// Run the script
addStudents();
