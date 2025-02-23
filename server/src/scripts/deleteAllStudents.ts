import { prisma } from '../prismaClient';

const deleteAllStudents = async () => {
  try {
    await prisma.student.deleteMany();
    console.log("All student records deleted successfully.");
  } catch (error) {
    console.error("Error deleting student records:", (error as Error).message);
  } finally {
    await prisma.$disconnect();
  }
};

deleteAllStudents();
