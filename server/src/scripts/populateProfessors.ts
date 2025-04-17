import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    // First, ensure we have professor ranks
    const ranks = await Promise.all([
      prisma.professorRank.upsert({
        where: { name: "Assistant Professor" },
        update: {},
        create: { name: "Assistant Professor", priority: 3 },
      }),
      prisma.professorRank.upsert({
        where: { name: "Associate Professor" },
        update: {},
        create: { name: "Associate Professor", priority: 2 },
      }),
      prisma.professorRank.upsert({
        where: { name: "Professor" },
        update: {},
        create: { name: "Professor", priority: 1 },
      }),
    ]);

    // Get a random department for assignment
    const departments = await prisma.department.findMany({});

    if (departments.length === 0) {
      throw new Error(
        "No departments found. Please run the main seed script first.",
      );
    }

    const professors = [
      {
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@university.edu",
        registrationNumber: "PROF001",
        rankName: "Professor",
      },
      {
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@university.edu",
        registrationNumber: "PROF002",
        rankName: "Associate Professor",
      },
      {
        firstName: "Michael",
        lastName: "Williams",
        email: "michael.williams@university.edu",
        registrationNumber: "PROF003",
        rankName: "Assistant Professor",
      },
      {
        firstName: "Emily",
        lastName: "Brown",
        email: "emily.brown@university.edu",
        registrationNumber: "PROF004",
        rankName: "Professor",
      },
      {
        firstName: "David",
        lastName: "Miller",
        email: "david.miller@university.edu",
        registrationNumber: "PROF005",
        rankName: "Associate Professor",
      },
      {
        firstName: "Jennifer",
        lastName: "Davis",
        email: "jennifer.davis@university.edu",
        registrationNumber: "PROF006",
        rankName: "Assistant Professor",
      },
      {
        firstName: "Robert",
        lastName: "Wilson",
        email: "robert.wilson@university.edu",
        registrationNumber: "PROF007",
        rankName: "Professor",
      },
      {
        firstName: "Lisa",
        lastName: "Anderson",
        email: "lisa.anderson@university.edu",
        registrationNumber: "PROF008",
        rankName: "Associate Professor",
      },
      {
        firstName: "James",
        lastName: "Taylor",
        email: "james.taylor@university.edu",
        registrationNumber: "PROF009",
        rankName: "Assistant Professor",
      },
      {
        firstName: "Maria",
        lastName: "Garcia",
        email: "maria.garcia@university.edu",
        registrationNumber: "PROF010",
        rankName: "Professor",
      },
    ];

    console.log("Creating professors...");

    for (const professor of professors) {
      const randomDepartment =
        departments[Math.floor(Math.random() * departments.length)];
      const professorRank = ranks.find(
        (rank) => rank.name === professor.rankName,
      );

      if (!professorRank) {
        throw new Error(`Professor rank ${professor.rankName} not found`);
      }

      // Create credential first
      const credential = await prisma.credential.create({
        data: {
          email: professor.email,
          passwordHash: await hash("password123", 10), // Default password
          role: "Professor",
        },
      });

      // Create professor
      await prisma.professor.create({
        data: {
          firstName: professor.firstName,
          lastName: professor.lastName,
          email: professor.email,
          registrationNumber: professor.registrationNumber,
          departmentId: randomDepartment.id,
          professorRankId: professorRank.id,
          credentialId: credential.id,
        },
      });

      console.log(
        `Created professor: ${professor.firstName} ${professor.lastName}`,
      );
    }

    console.log("Successfully populated professors table!");
  } catch (error) {
    console.error("Error populating professors:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
