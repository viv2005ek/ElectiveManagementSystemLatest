import { PrismaClient } from "@prisma/client";
import fs from "fs";
import csv from "csv-parser";
import { formatName } from "./formatName";

const prisma = new PrismaClient();

interface StudentCSV {
  "Student Name": string;
}

// Function to convert name to "Firstname Lastname" format

// Function to generate a random 10-digit registration number
const generateRandomRegistrationNumber = (): string => {
  return Math.floor(1000000000 + Math.random() * 9000000000).toString();
};

const importStudents = async () => {
  try {
    // Fetch all branches from the database
    const branches = await prisma.branch.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    if (branches.length === 0) {
      throw new Error("No branches found in the database!");
    }

    console.log(`Found ${branches.length} branches.`);

    const students: StudentCSV[] = [];

    fs.createReadStream("students.csv")
      .pipe(csv())
      .on("data", (row) => {
        students.push(row);
      })
      .on("end", async () => {
        console.log(`Read ${students.length} students from CSV.`);

        for (const student of students) {
          const { firstName, lastName } = formatName(student["Student Name"]);
          const registrationNumber = generateRandomRegistrationNumber();

          // Assign a random branch ID
          const randomBranch =
            branches[Math.floor(Math.random() * branches.length)];

          try {
            await prisma.student.create({
              data: {
                registrationNumber: registrationNumber,
                firstName,
                lastName,
                email: `${registrationNumber}@example.com`,
                gender: "OTHER", // Update as needed
                semester: 1, // Default semester value
                batch: 2025, // Example batch value
                contactNumber: "0000000000", // Placeholder contact number
                credential: {
                  create: {
                    email: `${registrationNumber}@example.com`,
                    passwordHash: "hashedpassword", // Replace with a hashed password
                    role: "STUDENT",
                  },
                },
                branch: {
                  connect: {
                    id: randomBranch.id,
                  },
                },
              },
            });
            console.log(
              `Added student: ${firstName} ${lastName}, Registration Number: ${registrationNumber}, Branch: ${randomBranch.name}`,
            );
          } catch (error) {
            console.error(
              `Error adding student ${registrationNumber}:`,
              (error as Error).message,
            );
          }
        }

        await prisma.$disconnect();
      });
  } catch (error) {
    console.error("Error during student import:", (error as Error).message);
    await prisma.$disconnect();
    process.exit(1);
  }
};

importStudents();
