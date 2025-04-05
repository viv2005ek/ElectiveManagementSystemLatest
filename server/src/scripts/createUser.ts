import { Gender, PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createUser(
  email: string,
  password: string,
  role: UserRole,
  firstName: string,
  lastName: string,
  registrationNumber: string,
  additionalData: any,
) {
  const passwordHash = await bcrypt.hash(password, 10);

  const credential = await prisma.credential.create({
    data: {
      email,
      passwordHash,
      role,
    },
  });

  let user;
  switch (role) {
    case UserRole.Student:
      user = await prisma.student.create({
        data: {
          email,
          firstName,
          lastName,
          registrationNumber,
          credentialId: credential.id,
          ...additionalData,
        },
      });
      break;
    case UserRole.Professor:
      user = await prisma.professor.create({
        data: {
          email,
          firstName,
          lastName,
          registrationNumber,
          credentialId: credential.id,
          ...additionalData,
        },
      });
      break;
    case UserRole.Admin:
      user = await prisma.admin.create({
        data: {
          email,
          firstName,
          lastName,
          registrationNumber,
          credentialId: credential.id,
          ...additionalData,
        },
      });
      break;
    default:
      throw new Error("Invalid user role");
  }

  return user;
}

// Example usage
createUser(
  "ayushsharma@gmail.com",
  "password123",
  UserRole.Student,
  "John",
  "Doe",
  "123456",
  {
    gender: Gender.Male,
    programId: "program-id",
    batchId: "batch-id",
    contactNumber: "1234567890",
    semester: 1,
  },
)
  .then((user) => {
    console.log("User created:", user);
  })
  .catch((error) => {
    console.error("Error creating user:", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
