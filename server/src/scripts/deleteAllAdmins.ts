import { prisma } from '../prismaClient'; // Adjust the path as necessary

async function clearAdminTables() {
  try {
    await prisma.admin.deleteMany({});
    console.log('All rows from Admin table have been deleted.');

    await prisma.adminCredential.deleteMany({});
    console.log('All rows from AdminCredential table have been deleted.');
  } catch (error) {
    console.error('Error clearing Admin and AdminCredential tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAdminTables();
