import { prisma } from '../prismaClient';

const addStudents = async () => {
  try {
    const students = Array.from({ length: 20 }, (_, index) => ({
      registrationNumber: `REG${1000 + index}`,
      email: `student${index + 1}@example.com`,
      semester: Math.floor(Math.random() * 8) + 1, // Random semester between 1 and 8
      DepartmentId: `Department${(index % 5) + 1}`, // Random department ID from 1 to 5
      DepartmentName: `Department ${(index % 5) + 1}`, // Department name
      BranchId: `Branch${(index % 3) + 1}`, // Random branch ID from 1 to 3
      BranchName: `Branch ${(index % 3) + 1}`, // Branch name
    }));

    const result = await prisma.student.createMany({
      data: students,
    });

    console.log(`Successfully added ${result.count} students.`);
  } catch (error) {
    console.error('Error adding students:', error);
  }
};

addStudents();
