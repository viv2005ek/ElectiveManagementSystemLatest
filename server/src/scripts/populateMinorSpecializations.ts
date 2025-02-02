import { prisma } from '../prismaClient';

async function seedMinorSpecializations() {
  try {
    console.log('Seeding minor specializations...');

    // Define departments (Assuming we already have department IDs)
    const departments = await prisma.department.findMany();
    if (departments.length < 1) {
      console.error('No departments found. Please create departments first.');
      return;
    }

    // Sample minor specializations data
    const minorSpecializationsData = [
      { name: 'Data Science' },
      { name: 'Cybersecurity' },
      { name: 'Artificial Intelligence' },
      { name: 'Cloud Computing' },
      { name: 'Blockchain Technology' },
    ];

    for (const specialization of minorSpecializationsData) {
      // Pick a random department
      const randomDepartment = departments[Math.floor(Math.random() * departments.length)];

      // Create minor specialization
      const minorSpecialization = await prisma.minorSpecialization.create({
        data: {
          name: specialization.name,
          departmentId: randomDepartment.id,
        },
      });

      console.log(`Created Minor Specialization: ${specialization.name}`);

      // Define 4 programme electives for this specialization
      const electives = [
        { courseCode: `${specialization.name.slice(0, 3).toUpperCase()}101`, name: `${specialization.name} Basics` },
        { courseCode: `${specialization.name.slice(0, 3).toUpperCase()}201`, name: `Advanced ${specialization.name}` },
        { courseCode: `${specialization.name.slice(0, 3).toUpperCase()}301`, name: `${specialization.name} Applications` },
        { courseCode: `${specialization.name.slice(0, 3).toUpperCase()}401`, name: `Capstone in ${specialization.name}` },
      ];

      // Insert programme electives
      for (const elective of electives) {
        await prisma.programmeElective.create({
          data: {
            courseCode: elective.courseCode,
            name: elective.name,
            semester: Math.floor(Math.random() * 8) + 1, // Assign random semester (1-8)
            minorSpecializationId: minorSpecialization.id,
          },
        });
        console.log(`Added Elective: ${elective.name}`);
      }
    }

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Error seeding minor specializations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedMinorSpecializations();
