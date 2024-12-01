import { prisma } from '../prismaClient';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    const adminData = {
      registrationNumber: "229310254",
      email: "shreshthpurohit@gmail.com",
      password: "hello", // Raw password to be hashed
      firstName: "Shreshth",
      lastName: "Purohit",
    };

    // Hash the password
    const passwordHash = await bcrypt.hash(adminData.password, 10);

    // Use a transaction to ensure both tables are updated atomically
    const newAdmin = await prisma.$transaction(async (tx) => {
      // Insert into AdminCredential
      const adminCredential = await tx.adminCredential.create({
        data: {
          registrationNumber: adminData.registrationNumber,
          email: adminData.email,
          passwordHash: passwordHash,
        },
      });

      // Insert into Admin
      const admin = await tx.admin.create({
        data: {
          id: adminCredential.id,
          registrationNumber: adminData.registrationNumber,
          email: adminData.email,
        },
      });

      return { adminCredential, admin };
    });

    console.log("Admin and AdminCredential created successfully:", newAdmin);
  } catch (error) {
    console.error("Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
