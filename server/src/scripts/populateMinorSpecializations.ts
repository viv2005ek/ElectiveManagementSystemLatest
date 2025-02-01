import { prisma } from '../prismaClient'; // Adjust the import path to your Prisma client

const createMinorSpecializations = async () => {
  try {
    // Define 5 minor specializations to be created
    const minorSpecializations = [
      { name: 'Data Science' },
      { name: 'Artificial Intelligence' },
      { name: 'Cybersecurity' },
      { name: 'Blockchain Technology' },
      { name: 'Cloud Computing' },
    ];

    // Create each minor specialization in the database
    const createdMinorSpecializations = await prisma.minorSpecialization.createMany({
      data: minorSpecializations,
    });

    console.log(`Successfully created ${createdMinorSpecializations.count} minor specializations.`);
  } catch (error) {
    console.error('Error creating minor specializations:', error);
  }
};

// Run the script
createMinorSpecializations();
