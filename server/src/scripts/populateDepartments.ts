import { prisma } from '../prismaClient';

async function main() {
  const departments = [
    { name: 'Computer Science' },
    { name: 'Mechanical Engineering' },
    { name: 'Electrical Engineering' },
    { name: 'Civil Engineering' },
    { name: 'Biotechnology' },
  ];

  for (const department of departments) {
    await prisma.department.upsert({
      where: { name: department.name },
      update: {},
      create: department,
    });
  }

  console.log('✅ Departments seeded successfully');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding departments:', e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
