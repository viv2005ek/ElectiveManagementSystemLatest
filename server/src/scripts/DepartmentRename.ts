const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const renameDepartment = async () => {
  try {
    const updatedDepartment = await prisma.department.update({
      where: {
        name: "Department 2",
      },
      data: {
        name: "Department of Computer Science & Engineering", // Change this to the desired new name
      },
    });

    // console.log(`Department renamed to: ${updatedDepartment.name}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("Error renaming department:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

renameDepartment();
