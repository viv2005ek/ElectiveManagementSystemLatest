import { PrismaClient } from '@prisma/client';
import { prisma } from '../prismaClient';

const prismaClient = new PrismaClient();

const deleteAllData = async () => {
  try {
    console.log('Starting to delete all data...');

    // Delete records from many-to-many relationships or dependent models first
    await prisma.changeRequest.deleteMany({});
    await prisma.facultyElectiveAllotment.deleteMany({});
    await prisma.programmeElectiveAllotment.deleteMany({});
    await prisma.semesterBranchPermission.deleteMany({});
    await prisma.minorSpecializationPreference.deleteMany({});

    // Then, delete records from the "many" side of one-to-many relationships
    await prisma.programmeElective.deleteMany({});
    await prisma.minorSpecialization.deleteMany({});
    await prisma.branch.deleteMany({});
    await prisma.department.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.faculty.deleteMany({});
    await prisma.student.deleteMany({});

    // Finally, delete the "root" models (those without foreign dependencies)
    await prisma.studentCredential.deleteMany({});
    await prisma.facultyCredential.deleteMany({});
    await prisma.adminCredential.deleteMany({});

    console.log('All data has been deleted successfully.');
  } catch (error) {
    console.error('Error deleting data:', error);
  } finally {
    await prismaClient.$disconnect(); // Disconnect after operation
  }
};

// Execute the delete script
deleteAllData();
