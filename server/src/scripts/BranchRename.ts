const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const renameBranch = async () => {
  try {
    const updatedBranch = await prisma.branch.update({
      where: {
        name: "Branch 2 of Department 2",
      },
      data: {
        name: "CSE IOT/IS", // Change this to the desired new name
      },
    });

    console.log(`Department renamed to: ${updatedBranch.name}`);

    await prisma.$disconnect();
  } catch (error) {
    console.error("Error renaming department:", error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

renameBranch();
