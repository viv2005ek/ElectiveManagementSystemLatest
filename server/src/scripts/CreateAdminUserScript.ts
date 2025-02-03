import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { prisma } from '../prismaClient';

dotenv.config()


async function createAdmin() {
  const email = 'shreshthpurohit@gmail.com';
  const password = process.env.PASSWORD || "password1234";
  const registrationNumber = 'ADM001';

  try {
    const existingAdmin = await prisma.adminCredential.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      console.log('Admin already exists with this email.');
      return;
    }

    const passwordHash = await bcrypt.hash(password, 1);

    const newAdmin = await prisma.adminCredential.create({
      data: {
        email,
        passwordHash,
        registrationNumber,
      },
    });

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
